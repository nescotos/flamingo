import { Component, OnInit, ViewChild } from '@angular/core';
import { ContractService } from '../contract.service';

@Component({
  selector: 'app-creator',
  templateUrl: './creator.component.html',
  styleUrls: ['./creator.component.css']
})
export class CreatorComponent implements OnInit {

  public isLoading:boolean = false;
  public contractAddress = '';
  

  constructor(private contract:ContractService) { }

  ngOnInit() {
  }

  async createContract(){
    this.contractAddress = '';
    this.isLoading = true;
    const factory = this.contract.getFactoryContract();
    const accounts = await this.contract.getAccount();
    const result = await factory.methods.createContract().send({
      from: accounts[0]
    });
    this.contractAddress = result.events.ContractCreated.returnValues.contractAddress;
    this.isLoading = false;
  }

}
