// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

import {IGovernanceMessageHandler} from "./IGovernanceMessageHandler.sol";

/**
 * @title IPNetworkHub
 * @author pNetwork
 *
 * @notice
 */
interface IPNetworkHub is IGovernanceMessageHandler {
    enum Actor {
        Governance,
        Guardian,
        Sentinel
    }

    enum ActorStatus {
        Active,
        Challenged,
        Inactive
    }

    enum ChallengeStatus {
        Null,
        Pending,
        Solved,
        Unsolved
    }

    enum OperationStatus {
        Null,
        Queued,
        Executed,
        Cancelled
    }

    struct Action {
        address actor;
        uint64 timestamp;
    }

    struct Challenge {
        uint256 nonce;
        address actor;
        address challenger;
        uint64 timestamp;
    }

    struct Operation {
        bytes32 originBlockHash;
        bytes32 originTransactionHash;
        bytes32 optionsMask;
        uint256 nonce;
        uint256 underlyingAssetDecimals;
        uint256 assetAmount;
        uint256 protocolFeeAssetAmount;
        uint256 networkFeeAssetAmount;
        uint256 forwardNetworkFeeAssetAmount;
        address underlyingAssetTokenAddress;
        bytes4 originNetworkId;
        bytes4 destinationNetworkId;
        bytes4 forwardDestinationNetworkId;
        bytes4 underlyingAssetNetworkId;
        string destinationAccount;
        string underlyingAssetName;
        string underlyingAssetSymbol;
        bytes userData;
    }

    /**
     * @dev Emitted when a challenge is opened.
     *
     * @param challenge The challenge
     */
    event ChallengeStarted(Challenge challenge);

    /**
     * @dev Emitted when a challenge is solved.
     *
     * @param challenge The challenge
     */
    event ChallengeSolved(Challenge challenge);

    /**
     * @dev Emitted when an operation is queued.
     *
     * @param operation The queued operation
     */
    event OperationQueued(Operation operation);

    /**
     * @dev Emitted when an operation is executed.
     *
     * @param operation The executed operation
     */
    event OperationExecuted(Operation operation);

    /**
     * @dev Emitted when an operation is cancelled.
     *
     * @param operation The cancelled operation
     */
    event OperationCancelled(Operation operation);

    /**
     * @dev Emitted when the Governance instruct an cancel action on an operation.
     *
     * @param operation The cancelled operation
     */
    event GovernanceOperationCancelled(Operation operation);

    /**
     * @dev Emitted when a Guardian instruct an cancel action on an operation.
     *
     * @param operation The cancelled operation
     */
    event GuardianOperationCancelled(Operation operation);

    /**
     * @dev Emitted when a Sentinel instruct an cancel action on an operation.
     *
     * @param operation The cancelled operation
     */
    event SentinelOperationCancelled(Operation operation);

    /**
     * @dev Emitted when a sentinel resumes after having being slashed
     *
     * @param sentinel The resumed sentinel
     */
    event SentinelResumed(address indexed sentinel);

    /**
     * @dev Emitted when a guardian resumes after having being slashed
     *
     * @param guardian The resumed sentinel
     */
    event GuardianResumed(address indexed guardian);

    /**
     * @dev Emitted when an user operation is generated.
     *
     * @param nonce The nonce
     * @param destinationAccount The account to which the funds will be delivered
     * @param destinationNetworkId The destination network id
     * @param underlyingAssetName The name of the underlying asset
     * @param underlyingAssetSymbol The symbol of the underlying asset
     * @param underlyingAssetDecimals The number of decimals of the underlying asset
     * @param underlyingAssetTokenAddress The address of the underlying asset
     * @param underlyingAssetNetworkId The network id of the underlying asset
     * @param assetTokenAddress The asset token address
     * @param assetAmount The asset mount
     * @param protocolFeeAssetTokenAddress the protocol fee asset token address
     * @param protocolFeeAssetAmount the protocol fee asset amount
     * @param networkFeeAssetAmount the network fee asset amount
     * @param forwardNetworkFeeAssetAmount the forward network fee asset amount
     * @param forwardDestinationNetworkId the protocol fee network id
     * @param userData The user data
     * @param optionsMask The options
     */
    event UserOperation(
        uint256 nonce,
        string destinationAccount,
        bytes4 destinationNetworkId,
        string underlyingAssetName,
        string underlyingAssetSymbol,
        uint256 underlyingAssetDecimals,
        address underlyingAssetTokenAddress,
        bytes4 underlyingAssetNetworkId,
        address assetTokenAddress,
        uint256 assetAmount,
        address protocolFeeAssetTokenAddress,
        uint256 protocolFeeAssetAmount,
        uint256 networkFeeAssetAmount,
        uint256 forwardNetworkFeeAssetAmount,
        bytes4 forwardDestinationNetworkId,
        bytes userData,
        bytes32 optionsMask
    );

    /*
     * @notice Calculates the challenge id.
     *
     * @param challenge
     *
     * @return bytes32 representing the challenge id.
     */
    function challengeIdOf(Challenge memory challenge) external view returns (bytes32);

    /*
     * @notice Calculates the operation challenge period.
     *
     * @param operation
     *
     * @return (uint64, uin64) representing the start and end timestamp of an operation challenge period.
     */
    function challengePeriodOf(Operation calldata operation) external view returns (uint64, uint64);

    /*
     * @notice Return the status of a challenge.
     *
     * @param challenge
     *
     * @return (ChallengeStatus) representing the challenge status
     */
    function getChallengeStatus(Challenge calldata challenge) external view returns (ChallengeStatus);

    /*
     * @notice Calculates the current challenge period duration considering the number of operations in queue.
     *     *
     * @return uint64 representing the current challenge period duration.
     */
    function getCurrentChallengePeriodDuration() external view returns (uint64);

    /*
     * @notice Returns the guardians merkle root for a given epoch.
     *
     * @param epoch
     *
     * @return bytes32 representing the guardians merkle root for a given epoch.
     */
    function getGuardiansMerkleRootForEpoch(uint16 epoch) external view returns (bytes32);

    /*
     * @notice Returns the sentinels merkle root for a given epoch.
     *
     * @param epoch
     *
     * @return bytes32 representing the sentinels merkle root for a given epoch.
     */
    function getSentinelsMerkleRootForEpoch(uint16 epoch) external view returns (bytes32);

    /*
     * @notice Returns the number of inactive actors for the current epoch.
     *
     *
     * @return bytes32 representing the number of inactive actors for the current epoch.
     */
    function getTotalNumberOfInactiveActorsForCurrentEpoch() external view returns (uint16);

    /*
     * @notice Return the status of an operation.
     *
     * @param operation
     *
     * @return (OperationStatus) the operation status.
     */
    function operationStatusOf(Operation calldata operation) external view returns (OperationStatus);

    /*
     * @notice Calculates the operation id.
     *
     * @param operation
     *
     * @return (bytes32) the operation id.
     */
    function operationIdOf(Operation memory operation) external pure returns (bytes32);

    /*
     * @notice A Guardian instruct a cancel action. If 2 actors agree on it the operation is cancelled.
     *
     * @param operation
     * @param proof
     *
     */
    function protocolGuardianCancelOperation(Operation calldata operation, bytes32[] calldata proof) external;

    /*
     * @notice The Governance instruct a cancel action. If 2 actors agree on it the operation is cancelled.
     *
     * @param operation
     *
     */
    function protocolGovernanceCancelOperation(Operation calldata operation) external;

    /*
     * @notice A Sentinel instruct a cancel action. If 2 actors agree on it the operation is cancelled.
     *
     * @param operation
     * @param proof
     *
     */
    function protocolSentinelCancelOperation(Operation calldata operation, bytes32[] calldata proof) external;

    /*
     * @notice Execute an operation that has been queued.
     *
     * @param operation
     *
     */
    function protocolExecuteOperation(Operation calldata operation) external payable;

    /*
     * @notice Queue an operation.
     *
     * @param operation
     *
     */
    function protocolQueueOperation(Operation calldata operation) external payable;

    /*
     * @notice Slash a sentinel of a guardians previously challenges if it was not able to solve the challenge in time.
     *
     * @param challenge
     *
     */
    function slashByChallenge(Challenge calldata challenge) external;

    /*
     * @notice Solve a challenge of a guardian and sends the bond (lockedAmountStartChallenge) to the DAO.
     *
     * @param challenge
     *
     */
    function solveChallengeGuardian(Challenge calldata challenge, bytes32[] calldata proof) external;

    /*
     * @notice Solve a challenge of a sentinel and sends the bond (lockedAmountStartChallenge) to the DAO.
     *
     * @param challenge
     *
     */
    function solveChallengeSentinel(Challenge calldata challenge, bytes32[] calldata proof) external;

    /*
     * @notice Start a challenge for a guardian.
     *
     * @param guardian
     * @param proof
     *
     */
    function startChallengeGuardian(address guardian, bytes32[] memory proof) external payable;

    /*
     * @notice Start a challenge for a sentinel.
     *
     * @param sentinel
     * @param proof
     *
     */
    function startChallengeSentinel(address sentinel, bytes32[] memory proof) external payable;

    /*
     * @notice Generate an user operation which will be used by the relayers to be able
     *         to queue this operation on the destination network through the StateNetwork of that chain
     *
     * @param destinationAccount
     * @param destinationNetworkId
     * @param underlyingAssetName
     * @param underlyingAssetSymbol
     * @param underlyingAssetDecimals
     * @param underlyingAssetTokenAddress
     * @param underlyingAssetNetworkId
     * @param assetTokenAddress
     * @param assetAmount
     * @param protocolFeeAssetTokenAddress
     * @param protocolFeeAssetAmount
     * @param networkFeeAssetAmount
     * @param forwardNetworkFeeAssetAmount
     * @param userData
     * @param optionsMask
     */
    function userSend(
        string calldata destinationAccount,
        bytes4 destinationNetworkId,
        string calldata underlyingAssetName,
        string calldata underlyingAssetSymbol,
        uint256 underlyingAssetDecimals,
        address underlyingAssetTokenAddress,
        bytes4 underlyingAssetNetworkId,
        address assetTokenAddress,
        uint256 assetAmount,
        address protocolFeeAssetTokenAddress,
        uint256 protocolFeeAssetAmount,
        uint256 networkFeeAssetAmount,
        uint256 forwardNetworkFeeAssetAmount,
        bytes calldata userData,
        bytes32 optionsMask
    ) external;
}
