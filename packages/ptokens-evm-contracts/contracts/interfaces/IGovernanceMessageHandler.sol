// SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

import {ITelepathyHandler} from "../interfaces/external/ITelepathyHandler.sol";

/**
 * @title IGovernanceMessageHandler
 * @author pNetwork
 *
 * @notice
 */

interface IGovernanceMessageHandler is ITelepathyHandler {
    function enableGovernanceMessageVerifierForSourceChain(
        uint32 sourceChainId,
        address governanceMessageVerifier
    ) external;

    function disableGovernanceMessageVerifierForSourceChain(
        uint32 sourceChainId,
        address governanceMessageVerifier
    ) external;
}
