const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const compiledFactory = require('./build/FlamingoFactory.json');

const provider = new HDWalletProvider(
    'family capable hedgehog stamp lucky scorpion frost punch predict mansion moment hint',
    'https://rinkeby.infura.io/ZBZdCCZhUfqy4EBK9gIo'
);

const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();
    console.log('Attempting deployment using account', accounts[0]);
    try{
        const result = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
            .deploy({ data: '0x' + compiledFactory.bytecode })
            .send({ gas: '5000000', from: accounts[0], gasPrice: web3.utils.toWei('2', 'gwei') });

        console.log('Contract deployed to address:', result.options.address);
    }
    catch(err){
        console.error(err);
    }

};

deploy();