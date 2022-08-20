//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Tasks is Ownable{
    using Counters for Counters.Counter;
    using SafeMath for uint256;

    // Counter for campaign index
    Counters.Counter public campaignIndex;

    // plat tokens for using services
    IERC20 public platTokens;

    // Campaign storages 
    struct CampaignStorage {
        address creator;
        uint256 balance;
        bool isEnd;
    }
    mapping(uint256 => CampaignStorage) public campaigns;

    mapping(address => uint256[]) public clientCampaigns;

    // events 

    event CreateCampaign(
        address indexed creator,
        uint256 indexed balance
    );

    constructor(IERC20 platTokens_) {
        platTokens = platTokens_;
    }


    function createCampaign(uint256 value) public {
        uint256 newCampaignIndex = campaignIndex.current();
        campaignIndex.increment();
        require(platTokens.balanceOf(msg.sender) >= value, "Tasks: Not enough balance");

        // transfer plat to Tasks contract
        platTokens.transferFrom(msg.sender, address(this), value);

        campaigns[newCampaignIndex] = CampaignStorage({
            creator: msg.sender,
            balance: value,
            isEnd: false
        });
        clientCampaigns[msg.sender].push(newCampaignIndex);

        emit CreateCampaign(msg.sender, value);
    }

    function payment(uint256 index, address[] memory users, uint256 amount) public {
        CampaignStorage memory campaignInfo = campaigns[index];
        require(msg.sender == campaignInfo.creator, "Tasks: Permission Deny!! Only creator can call");
        uint256 totalAmount = amount.mul(users.length);
        require(campaignInfo.balance >= totalAmount, "Tasks: Not enough balance");
        // risk here
        for (uint8 i=0; i < users.length; i++ ) {
            platTokens.transfer(users[i], amount);
        }
    }

    // helper function


}
