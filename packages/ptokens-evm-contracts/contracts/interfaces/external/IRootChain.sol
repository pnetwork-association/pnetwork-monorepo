pragma solidity 0.8.17;

interface IRootChain {
    function headerBlocks(uint256 headerBlock) external view returns (bytes32, uint256, uint256, uint256, address);
}
