// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {IGovernanceMessageEmitter} from "../interfaces/IGovernanceMessageEmitter.sol";
import {IRegistrationManager} from "@pnetwork-association/dao-v2-contracts/contracts/interfaces/IRegistrationManager.sol";
import {ILendingManager} from "@pnetwork-association/dao-v2-contracts/contracts/interfaces/ILendingManager.sol";
import {IEpochsManager} from "@pnetwork-association/dao-v2-contracts/contracts/interfaces/IEpochsManager.sol";
import {IPRegistry} from "../interfaces/IPRegistry.sol";
import {IPNetworkHub} from "../interfaces/IPNetworkHub.sol";
import {MerkleTree} from "../libraries/MerkleTree.sol";

error InvalidAmount(uint256 amount, uint256 expectedAmount);
error InvalidGovernanceMessageVerifier(address governanceMessagerVerifier, address expectedGovernanceMessageVerifier);
error InvalidSentinelRegistration(bytes1 kind);
error NotRegistrationManager(address registrationManager, address expectedRegistrationManager);
error NotDandelionVoting(address dandelionVoting, address expectedDandelionVoting);
error InvalidNumberOfGuardians(uint16 numberOfGuardians, uint16 expectedNumberOfGuardians);
error NetworkNotSupported(bytes4 networkId);

contract GovernanceMessageEmitter is IGovernanceMessageEmitter {
    bytes32 public constant GOVERNANCE_MESSAGE_ACTORS = keccak256("GOVERNANCE_MESSAGE_ACTORS");
    bytes32 public constant GOVERNANCE_MESSAGE_SLASH_ACTOR = keccak256("GOVERNANCE_MESSAGE_SLASH_ACTOR");
    bytes32 public constant GOVERNANCE_MESSAGE_RESUME_ACTOR = keccak256("GOVERNANCE_MESSAGE_RESUME_ACTOR");
    bytes32 public constant GOVERNANCE_MESSAGE_PROTOCOL_GOVERNANCE_CANCEL_OPERATION =
        keccak256("GOVERNANCE_MESSAGE_PROTOCOL_GOVERNANCE_CANCEL_OPERATION");

    address public immutable epochsManager;
    address public immutable lendingManager;
    address public immutable registrationManager;
    address public immutable dandelionVoting;
    address public immutable registry;

    uint256 public totalNumberOfMessages;

    modifier onlyRegistrationManager() {
        if (msg.sender != registrationManager) {
            revert NotRegistrationManager(msg.sender, dandelionVoting);
        }

        _;
    }

    modifier onlyDandelionVoting() {
        if (msg.sender != dandelionVoting) {
            revert NotDandelionVoting(msg.sender, dandelionVoting);
        }

        _;
    }

    constructor(
        address epochsManager_,
        address lendingManager_,
        address registrationManager_,
        address dandelionVoting_,
        address registry_
    ) {
        registry = registry_;
        epochsManager = epochsManager_;
        lendingManager = lendingManager_;
        dandelionVoting = dandelionVoting_;
        registrationManager = registrationManager_;
    }

    /// @inheritdoc IGovernanceMessageEmitter
    function propagateActors(address[] calldata guardians, address[] calldata sentinels) external {
        uint16 currentEpoch = IEpochsManager(epochsManager).currentEpoch();

        address[] memory effectiveGuardians = _filterGuardians(guardians);
        address[] memory effectiveSentinels = _filterSentinels(sentinels);
        address[] memory actors = new address[](effectiveGuardians.length + effectiveSentinels.length);

        for (uint256 i = 0; i < effectiveGuardians.length; ) {
            actors[i] = effectiveGuardians[i];
            unchecked {
                ++i;
            }
        }

        for (uint256 i = effectiveGuardians.length; i < effectiveGuardians.length + effectiveSentinels.length; ) {
            actors[i] = effectiveSentinels[i - effectiveGuardians.length];
            unchecked {
                ++i;
            }
        }

        emit ActorsPropagated(currentEpoch, actors);

        _sendMessage(
            abi.encode(
                GOVERNANCE_MESSAGE_ACTORS,
                abi.encode(currentEpoch, actors.length, MerkleTree.getRoot(_hashAddresses(actors)))
            )
        );
    }

    /// @inheritdoc IGovernanceMessageEmitter
    function protocolGovernanceCancelOperation(
        IPNetworkHub.Operation calldata operation,
        bytes4 networkId
    ) external onlyDandelionVoting {
        address[] memory hubs = new address[](1);
        uint32[] memory chainIds = new uint32[](1);

        address hub = IPRegistry(registry).getHubByNetworkId(networkId);
        if (hub == address(0)) {
            revert NetworkNotSupported(networkId);
        }

        uint32 chainId = IPRegistry(registry).getChainIdByNetworkId(networkId);
        hubs[0] = hub;
        chainIds[0] = chainId;

        emit GovernanceMessage(
            abi.encode(
                totalNumberOfMessages,
                chainIds,
                hubs,
                abi.encode(GOVERNANCE_MESSAGE_PROTOCOL_GOVERNANCE_CANCEL_OPERATION, abi.encode(operation))
            )
        );

        unchecked {
            ++totalNumberOfMessages;
        }
    }

    /// @inheritdoc IGovernanceMessageEmitter
    function resumeActor(address actor) external onlyRegistrationManager {
        _sendMessage(
            abi.encode(GOVERNANCE_MESSAGE_RESUME_ACTOR, abi.encode(IEpochsManager(epochsManager).currentEpoch(), actor))
        );
    }

    /// @inheritdoc IGovernanceMessageEmitter
    function slashActor(address actor) external onlyRegistrationManager {
        _sendMessage(
            abi.encode(GOVERNANCE_MESSAGE_SLASH_ACTOR, abi.encode(IEpochsManager(epochsManager).currentEpoch(), actor))
        );
    }

    function _filterGuardians(address[] calldata guardians) internal view returns (address[] memory) {
        uint16 currentEpoch = IEpochsManager(epochsManager).currentEpoch();
        // uint16 totalNumberOfGuardians = IRegistrationManager(registrationManager).totalNumberOfGuardiansByEpoch(
        //     currentEpoch
        // );

        // uint16 numberOfValidGuardians;
        // for (uint16 index = 0; index < guardians; ) {
        //     IRegistrationManager.Registration memory registration = IRegistrationManager(registrationManager)
        //         .guardianRegistration(guardians[index]);

        //     if (registration.kind == 0x03 && currentEpoch >= registration.startEpoch && currentEpoch <= registration.endEpoch) {
        //         unchecked {
        //             ++numberOfValidGuardians;
        //         }
        //     }
        //     unchecked {
        //         ++index;
        //     }
        // }

        // if (totalNumberOfGuardians != numberOfValidGuardians) {
        //     revert InvalidNumberOfGuardians(numberOfValidGuardians, totalNumberOfGuardians);
        // }

        return guardians;
    }

    function _filterSentinels(address[] memory sentinels) internal view returns (address[] memory) {
        uint16 currentEpoch = IEpochsManager(epochsManager).currentEpoch();
        uint32 totalBorrowedAmount = ILendingManager(lendingManager).totalBorrowedAmountByEpoch(currentEpoch);
        uint256 totalSentinelStakedAmount = IRegistrationManager(registrationManager).totalSentinelStakedAmountByEpoch(
            currentEpoch
        );
        uint256 totalAmount = totalBorrowedAmount + totalSentinelStakedAmount;

        int256[] memory validIndexes = new int256[](sentinels.length);
        uint256 totalValidSentinels = 0;
        uint256 cumulativeAmount = 0;

        // NOTE: be sure that totalSentinelStakedAmount + totalBorrowedAmount = cumulativeAmount.
        // There could be also sentinels that has less than 200k PNT because of slashing.
        // These sentinels will be filtered in the next step
        for (uint256 index; index < sentinels.length; ) {
            IRegistrationManager.Registration memory registration = IRegistrationManager(registrationManager)
                .sentinelRegistration(sentinels[index]);

            bytes1 registrationKind = registration.kind;
            if (registrationKind == 0x01) {
                // NOTE: no need to check startEpoch and endEpoch since we are using sentinelStakedAmountByEpochOf
                uint256 amount = IRegistrationManager(registrationManager).sentinelStakedAmountByEpochOf(
                    sentinels[index],
                    currentEpoch
                );
                cumulativeAmount += amount;
                if (amount >= 200000) {
                    validIndexes[index] = int256(index);
                    unchecked {
                        totalValidSentinels++;
                    }
                } else {
                    validIndexes[index] = -1;
                }
            } else if (
                registrationKind == 0x02 &&
                currentEpoch >= registration.startEpoch &&
                currentEpoch <= registration.endEpoch
            ) {
                cumulativeAmount += 200000;
                validIndexes[index] = int256(index);
                unchecked {
                    totalValidSentinels++;
                }
            } else {
                revert InvalidSentinelRegistration(registrationKind);
            }

            unchecked {
                ++index;
            }
        }

        if (totalAmount != cumulativeAmount) {
            revert InvalidAmount(totalAmount, cumulativeAmount);
        }

        address[] memory effectiveSentinels = new address[](totalValidSentinels);
        uint256 j = 0;
        for (uint256 i = 0; i < validIndexes.length; ) {
            int256 validIndex = validIndexes[i];
            if (validIndex != -1) {
                effectiveSentinels[j] = sentinels[uint256(validIndex)];
                unchecked {
                    j++;
                }
            }
            unchecked {
                i++;
            }
        }

        return effectiveSentinels;
    }

    function _hashAddresses(address[] memory addresses) internal pure returns (bytes32[] memory) {
        bytes32[] memory data = new bytes32[](addresses.length);
        for (uint256 i = 0; i < addresses.length; i++) {
            data[i] = keccak256(abi.encodePacked(addresses[i]));
        }
        return data;
    }

    function _sendMessage(bytes memory message) internal {
        address[] memory hubs = IPRegistry(registry).getSupportedHubs();
        uint32[] memory chainIds = IPRegistry(registry).getSupportedChainIds();

        emit GovernanceMessage(abi.encode(totalNumberOfMessages, chainIds, hubs, message));

        unchecked {
            ++totalNumberOfMessages;
        }
    }
}
