const CoinABI = require("./build/contracts/Coin.json");
const Web3 = require("web3");
const { Transaction } = require("@ethereumjs/tx");
const Common = require("@ethereumjs/common").default;

const web3 = new Web3("http://127.0.0.1:8545");

const common = new Common({ chain: "mainnet" });

const contract = new web3.eth.Contract(
  CoinABI.abi,
  CoinABI.networks[5777].address
);

const address1 = "0x08B36F3C2fDad892310f47c30Fca4FF0eff57791";
const address2 = "0xfAaDd3d580888E1980967E1b723ba83E62C50F7C";
const address3 = "0x69DED00c4dDBd0784771F687c31d0e41A97805fA";

const privateKey = Buffer.from(
  "1d8153d03edc5b657efc71bff8dac515aef1426d8688c2e8b8b4e91bf499b9d4",
  "hex"
);
const main = async () => {
  // Used to call contract methods
  const callContractMethods = async () => {
    await contract.methods.mint(address1, 1000).send({ from: address1 });

    let result = await contract.methods.balances(address1).call();
    console.log("Initial Balance of Address1: ", result);
    result = await contract.methods.balances(address2).call();
    console.log("Initial Balance of Address2: ", result);

    await contract.methods
      .transfer(address1, address2, 359)
      .send({ from: address1 });

    const balance = await contract.methods.balances(address2).call();
    console.log("Balance of Address2 after tansaction: ", balance);
    const remainingBalance = await contract.methods.balances(address1).call();
    console.log("Balance of Address1 after tansaction: ", remainingBalance);
  };

  // Explicitly creates new transaction and send it to ethereum's mainet.
  const transferFund = async () => {
    // Returns 32-bit hex string of contract-method with
    // its parameters tightly formatted.
    const data = await contract.methods
      .transfer(address1, address2, 359)
      .encodeABI();

    const txObject = {
      gasLimit: web3.utils.toHex(800000),
      gasProcce: web3.utils.toHex(100000),
      nonce: web3.utils.toHex(215),
      to: CoinABI.networks[5777].address,
      data: data,
      value: web3.utils.toHex(100),
    };

    // Creates new transaction object.
    const tx = Transaction.fromTxData(txObject, { common });
    const signedTx = tx.sign(privateKey);

    // Serialize the transaction object
    const serializeTx = signedTx.serialize();
    const raw = "0x" + serializeTx.toString("hex");

    // Send it to the ethereum mainet.
    web3.eth.sendSignedTransaction(raw, (err, data) => {
      console.log("Err: ", err, " Data: ", data);
    });

    // Checking balance after making the transaction.
    const balance = await contract.methods.balances(address2).call();
    console.log("Balance of Address2 after tansaction: ", balance);
    const remainingBalance = await contract.methods.balances(address1).call();
    console.log("Balance of Address1 after tansaction: ", remainingBalance);
  };

  await transferFund();
};

main();
