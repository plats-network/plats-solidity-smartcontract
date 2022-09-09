
const ethers = require('ethers');
const platContractABI = require('../artifacts/contracts/Tasks.sol/Tasks.json')['abi'];
const platContractAddress = "0x8CfcfA91EA0Ebe464AAcfaAC39578a29D2a0A767";
const tokenContractABI = require('../artifacts/contracts/PlatToken.sol/PlatToken.json')['abi'];
const tokenContractAddress = "0xA33938565A1bFA52190f895E37FADb5725a677Bb";

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
    await platContract.connect(wallet).createCampaign(depositValue);

    // get campaign info
    let currentCampaignInfo = await platContract.campaigns(0);
    console.log(currentCampaignInfo);

    let balanceOfOwner = await tokenContract.balanceOf(wallet.address);
    console.log(balanceOfOwner.toString());
}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
