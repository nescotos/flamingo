const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');

const buildPath = path.resolve(__dirname, 'build');
console.info(`- Removing Build Path`);
fs.removeSync(buildPath);
const flamingoPath = path.resolve(__dirname, 'contracts', 'Flamingo.sol');
console.info(`- Retrieving Source Code for Flamingo.sol`);
const source = fs.readFileSync(flamingoPath, 'utf-8');
console.info(`- Compiling Solidity Code from ${flamingoPath}`);
const output = solc.compile(source, 1).contracts;
console.info(`- Creating Build Path in ${buildPath}`)
fs.ensureDirSync(buildPath);
for(let contract in output){
    fs.outputJsonSync(
        path.resolve(buildPath, `${contract.replace(':', '')}.json`),
        output[contract]
    );
    console.info(`- Creating ${contract.replace(':', '')}.json`);
}
console.info(`- Building Done`);