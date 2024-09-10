// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract BuyMeACupOfCoffee is Ownable {
    // State variables
    uint256 public constant MINIMUM_USD = 10 ** 16;
    address[] private s_bosses;
    mapping(address => bool) private s_isBoss;
    mapping(address => uint256) private s_addressToAmountFunded;

    // Events
    event Funded(address indexed boss, uint256 indexed amount);

    constructor(address owner) Ownable(owner) {}

    receive() external payable {}

    /// @notice Funds our contract based on the ETH/USD price
    function fund() public payable {
        require(msg.value >= MINIMUM_USD, "You need to spend more ETH!");
        s_addressToAmountFunded[msg.sender] += msg.value;
        if (!s_isBoss[msg.sender]) {
            s_bosses.push(msg.sender);
            s_isBoss[msg.sender] = true;
        }
        emit Funded(msg.sender, msg.value);
    }

    function withdraw() public onlyOwner {
        address[] memory bosses = s_bosses;
        for (uint256 bossIndex = 0; bossIndex < bosses.length; bossIndex++) {
            address boss = bosses[bossIndex];
            s_addressToAmountFunded[boss] = 0;
            s_isBoss[msg.sender] = false;
        }
        s_bosses = new address[](0);

        address owner = owner();
        (bool success, ) = owner.call{value: address(this).balance}("");
        require(success);
    }

    function getAddressToAmountFunded(
        address bossAddress
    ) public view returns (uint256) {
        return s_addressToAmountFunded[bossAddress];
    }

    function getBoss(uint256 index) public view returns (address) {
        return s_bosses[index];
    }
    function getFundedLength() public view returns (uint256) {
        return s_bosses.length;
    }

    function getOwner() public view returns (address) {
        return owner();
    }
}
