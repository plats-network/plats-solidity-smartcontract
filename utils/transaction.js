
const ethers = require('ethers');
const platContractABI = require('../artifacts/contracts/Tasks.sol/Tasks.json')['abi'];
const platContractAddress = "0x6E440d515E0ddE78de24245d57dF1790fA41eFc4";
const tokenContractABI = require('../artifacts/contracts/PlatToken.sol/PlatToken.json')['abi'];
const tokenContractAddress = "0x0AE40ea79F109E7D78dDfaA366e1372c3A214ef0";

const dotenv = require('dotenv');

dotenv.config()

async function main() {
    const url = "https://eth.bd.evmos.dev:8545";
    const provider = new ethers.providers.JsonRpcProvider(url);

    let wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    console.log(wallet.address)

    let platContract = new ethers.Contract(platContractAddress, platContractABI, provider);

    let tokenContract = new ethers.Contract(tokenContractAddress, tokenContractABI, provider);

    await tokenContract.connect(wallet).mint(wallet.address, ethers.utils.parseEther("10000"));

    let depositValue = ethers.utils.parseEther("10");
    await tokenContract.connect(wallet).approve(platContract.address, depositValue);

    // create campaign
    const batchId = "1"
    await platContract.connect(wallet).createCampaign(batchId,depositValue);

    // get campaign info
    let currentCampaignInfo = await platContract.campaigns(batchId);
    console.log(currentCampaignInfo);

    let balanceOfOwner = await tokenContract.balanceOf(wallet.address);
    console.log(balanceOfOwner.toString());
}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
