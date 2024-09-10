const { network, ethers } = require("hardhat");
const { verify } = require("../utility/verify");
require("dotenv").config();
const {
  networkconfig,
  developmentChains,
} = require("../hardhat-config-helper");

const router = "0x0bf3de8c5d3e8a2b34d2beeb17abfcebaf363a59";
const link = "0x779877a7b0d9e8603169ddbd7836e478b4624789";
module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;
  let sender;

  if (chainId == 11155111) {
    log("Deploying sender ...");
    sender = await deploy("DataSender", {
      contract: "DataSender",
      from: deployer,
      log: true,
      args: [router, link],
      waitConfirmations: network.config.blockConfirmations || 1,
    });
    log("Deployed!");
    log("------------------------------------------------");
    log(`DataSender deployed at ${sender.address}`);

    // if (
    //   !developmentChains.includes(network.name) &&
    //   process.env.ETHERSCAN_API_KEY
    // ) {
    //   await verify(sender.address, [router, link]);
    // }
  }
};
