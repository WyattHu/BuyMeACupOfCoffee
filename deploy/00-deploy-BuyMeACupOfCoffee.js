const { network, ethers } = require("hardhat");
const { verify } = require("../utility/verify");
require("dotenv").config();
const {
  networkconfig,
  developmentChains,
} = require("../hardhat-config-helper");

const owner = "0x294e0bCC654D249eA6EF17f9f83d20B58999C921";

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;
  let contract;

  if (chainId == 11155111) {
    log("Deploying BuyMeACupOfCoffee ...");
    contract = await deploy("BuyMeACupOfCoffee", {
      contract: "BuyMeACupOfCoffee",
      from: deployer,
      log: true,
      args: [owner],
      waitConfirmations: network.config.blockConfirmations || 1,
    });
    log("Deployed!");
    log("------------------------------------------------");
    log(`BuyMeACupOfCoffee deployed at ${contract.address}`);

    if (
      !developmentChains.includes(network.name) &&
      process.env.ETHERSCAN_API_KEY
    ) {
      await verify(contract.address, [owner]);
    }
  }
};
