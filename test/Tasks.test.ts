import { utils } from 'ethers';
import { ContractFactory } from 'ethers';
import { Contract } from 'ethers';
import { expect } from "chai";
import { ethers } from "hardhat";
import { assert } from 'console';

describe("Tasks", function () {
    let tasks: Contract;
    let token: Contract;
    let deployer: any;
    let client: any;
    let alice: any;
    let bob: any;

    beforeEach(async () => {
        [deployer, client, alice, bob] = await ethers.getSigners();

        token = await (await ethers.getContractFactory("PlatToken")).deploy();
        await token.deployed();
        tasks = await (await ethers.getContractFactory("Tasks")).deploy(token.address);
        await tasks.deployed();

        // mint 1000 tokens for client
        await token.connect(deployer).mint(client.address, utils.parseEther("100000"));

    })
    it("Create campaign",async () => {
        // approve for tasks contract
        var depositValue = utils.parseEther("10");
        var batchId = "hello";
        await token.connect(client).approve(tasks.address, depositValue);

        // create campaign 
        await tasks.connect(client).createCampaign(batchId, depositValue);

        // get campaign info
        let currentCampaignInfo = await tasks.campaigns(batchId);
        expect(currentCampaignInfo['creator']).to.be.eq(client.address);
    })

    it("payment should work",async () => {
        // approve for tasks contract
        var depositValue = utils.parseEther("100");
        var batchId = "hello";
        await token.connect(client).approve(tasks.address, depositValue);

        // create campaign 
        await tasks.connect(client).createCampaign(batchId, depositValue);

        var balanceOfAliceBeforePayment = await token.balanceOf(alice.address);
        await tasks.connect(deployer).payment(batchId, [alice.address, bob.address], utils.parseEther("10"));
        var balanceOfAliceAfterPayment = await token.balanceOf(alice.address);
        expect(balanceOfAliceAfterPayment).to.be.eq(balanceOfAliceBeforePayment.add(utils.parseEther("10")));

    })

});
