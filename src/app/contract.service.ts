import { Injectable } from '@angular/core';
import * as W3 from 'web3';
const Web3 = require('web3'); // tslint:disable-line

@Injectable({
  providedIn: 'root'
})
export class ContractService {
  web3: W3.default;
  //This is just a POC, we are gonna put the ABI right HERE
  private abi = JSON.parse("[{\"constant\":true,\"inputs\":[],\"name\":\"getflamingosLength\",\"outputs\":[{\"name\":\"\",\"type\":\"uint256\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[],\"name\":\"manager\",\"outputs\":[{\"name\":\"\",\"type\":\"address\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[{\"name\":\"\",\"type\":\"uint256\"}],\"name\":\"flamingos\",\"outputs\":[{\"name\":\"name\",\"type\":\"string\"},{\"name\":\"imageUrl\",\"type\":\"string\"},{\"name\":\"source\",\"type\":\"address\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[],\"name\":\"getflamingos\",\"outputs\":[{\"components\":[{\"name\":\"name\",\"type\":\"string\"},{\"name\":\"imageUrl\",\"type\":\"string\"},{\"name\":\"source\",\"type\":\"address\"}],\"name\":\"\",\"type\":\"tuple[]\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[],\"name\":\"factory\",\"outputs\":[{\"name\":\"\",\"type\":\"address\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"name\":\"name\",\"type\":\"string\"},{\"name\":\"imageUrl\",\"type\":\"string\"}],\"name\":\"addFlamingo\",\"outputs\":[],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"name\":\"creator\",\"type\":\"address\"},{\"name\":\"contractAddress\",\"type\":\"address\"}],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"constructor\"}]");
  private factoryAddress:string = '0x81eA90212bD31A58F24749F3025CA49272788b80';
  private factoryAbi = JSON.parse("[{\"constant\":false,\"inputs\":[],\"name\":\"createContract\",\"outputs\":[{\"name\":\"\",\"type\":\"address\"}],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[],\"name\":\"manager\",\"outputs\":[{\"name\":\"\",\"type\":\"address\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[{\"name\":\"source\",\"type\":\"address\"}],\"name\":\"checkSource\",\"outputs\":[{\"name\":\"\",\"type\":\"bool\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"name\":\"source\",\"type\":\"address\"},{\"name\":\"enabled\",\"type\":\"bool\"}],\"name\":\"alterSources\",\"outputs\":[],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[{\"name\":\"\",\"type\":\"address\"}],\"name\":\"sources\",\"outputs\":[{\"name\":\"\",\"type\":\"bool\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[{\"name\":\"\",\"type\":\"address\"}],\"name\":\"deployedContracts\",\"outputs\":[{\"name\":\"\",\"type\":\"bool\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[{\"name\":\"contractAddress\",\"type\":\"address\"}],\"name\":\"checkCertContract\",\"outputs\":[{\"name\":\"\",\"type\":\"bool\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"constructor\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"name\":\"contractAddress\",\"type\":\"address\"}],\"name\":\"ContractCreated\",\"type\":\"event\"}]");
  constructor() { 
    if (typeof window['web3'] !== 'undefined') {
      // Use Mist/MetaMask's provider
      this.web3 = new Web3(window['web3'].currentProvider);
    } else {
      console.warn(
        'Please install Metamask plugin for Google Chrome or use Mist Browser'
      );
    }
  }

  getContractFromAddress(address:string){
    return new this.web3.eth.Contract(this.abi, address);
  }

  getFactoryContract(){
    return new this.web3.eth.Contract(this.factoryAbi, this.factoryAddress);
  }

  getAccount(){
    return new Promise((resolve, reject) => {
      this.web3.eth.getAccounts()
        .then((accounts) => {
          resolve(accounts);
        })
        .catch((err) => {
          reject(err);
        });
    });    
  }
}
