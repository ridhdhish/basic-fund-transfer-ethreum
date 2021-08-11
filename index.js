const CoinABI = require("./build/contracts/Coin.json");
const Web3 = require("web3");
const { Transaction } = require("@ethereumjs/tx");
const Common = require("@ethereumjs/common");

const web3 = new Web3("http://127.0.0.1:8545");

const common = new Common({ chain: "mainnet" });

const contract = new web3.eth.Contract(
  CoinABI.abi,
  CoinABI.networks[5777].address
);
console.log(contract.methods);

const address1 = "0x08B36F3C2fDad892310f47c30Fca4FF0eff57791";
const address2 = "0xfAaDd3d580888E1980967E1b723ba83E62C50F7C";
const address3 = "0x69DED00c4dDBd0784771F687c31d0e41A97805fA";

const privateKey =
  "1d8153d03edc5b657efc71bff8dac515aef1426d8688c2e8b8b4e91bf499b9d4";

const main = async () => {
  await contract.methods.mint(address1, 1000).send({ from: address1 });

  const result = await contract.methods.balances(address1).call();
  console.log(result);

  await contract.methods
    .transfer(address1, address2, 359)
    .send({ from: address1 });

  const data = await contract.methods
    .transfer(address1, address2, 359)
    .encodeABI();

  const balance = await contract.methods.balances(address2).call();
  console.log(balance);
  const remainingBalance = await contract.methods.balances(address1).call();
  console.log(remainingBalance);

  const transferFund = async () => {
    const tx = Transaction.fromTxData(txParams, { common });

    const txObject = {
      gasLimit: web3.utils.toHex(800000),
      gasProcce: web3.utils.toHex(100000),
      nounce: 100,
      to: address2,
      data: data,
    };

    const tx = new Tx(txObject);
    tx.sign(privateKey);

    const serializeTx = tx.serialize();
    const raw = "0x" + serializeTx.toString("hex");

    web3.eth.sendSignedTransaction(raw, (err, data) => {
      console.log("Err: ", err, " Data: ", data);
    });
  };

  transferFund();
};

main();
