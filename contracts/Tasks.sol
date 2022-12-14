//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Tasks is Ownable{
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
    mapping(string => CampaignStorage) public campaigns;

    mapping(address => string[]) public clientCampaigns;

    // events 

    event CreateCampaign(
        address indexed creator,
        string indexed batchId,
        uint256 indexed balance
    );

    constructor(IERC20 platTokens_) {
        platTokens = platTokens_;
    }

    function setPlatToken(IERC20 platToken_) public onlyOwner{
        platTokens = platToken_;
    }

    function createCampaign(string memory batchId, uint256 value) public {
        require(campaigns[batchId].creator == address(0), "Tasks: BatchId exited");
        require(platTokens.balanceOf(msg.sender) >= value, "Tasks: Not enough balance");

        // transfer plat to Tasks contract
        platTokens.transferFrom(msg.sender, address(this), value);

        campaigns[batchId] = CampaignStorage({
            creator: msg.sender,
            balance: value,
            isEnd: false
        });
        clientCampaigns[msg.sender].push(batchId);

        emit CreateCampaign(msg.sender, batchId,  value);
    }

    function payment(string memory batchId, address[] memory users, uint256 amount) public onlyOwner{
        CampaignStorage memory campaignInfo = campaigns[batchId];
        uint256 totalAmount = amount.mul(users.length);
        require(campaignInfo.balance >= totalAmount, "Tasks: Not enough balance");
        // risk here
        for (uint8 i=0; i < users.length; i++ ) {
            platTokens.transfer(users[i], amount);
        }
    }

    // helper function


}
