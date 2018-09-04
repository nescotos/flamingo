import { Component, OnInit, ViewChild } from '@angular/core';
import { IpfsService } from '../ipfs.service';
import { Helpers } from '../utils/helpers';
import { ContractService } from '../contract.service';
import { Result } from '@zxing/library';
import { ZXingScannerComponent } from '@zxing/ngx-scanner';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {

  data = {
    address: '',
    name: ''
  };
  message:string = '';
  isLoading:boolean = false;
  filename:string = '';
  @ViewChild('fileInput') fileInput;
  @ViewChild('scanner') scanner: ZXingScannerComponent;
  public device: MediaDeviceInfo;
  public qrButtonMessage: string = 'Read QR Code';
  public enableQR: boolean = false;
  public scannerStatus: string = 'none';

  constructor(private ipfs:IpfsService, private contract:ContractService) { }

  ngOnInit() {
    this.scanner.camerasFound.subscribe((devices: MediaDeviceInfo[]) => {
      if (devices && devices.length > 0) {
        this.device = devices[0];
      }
    });
  }

  fileChange(){
    const file = this.fileInput.nativeElement; 
    if(file.files && file.files.length > 0){
      this.filename = file.files[0].name;
    }
  }

  enableQRReader() {
    if (this.enableQR) {
      this.qrButtonMessage = 'Read from QR';
      this.scannerStatus = 'none';
    } else {
      this.qrButtonMessage = 'Stop Reading from QR';
      this.scannerStatus = '';
    }
    this.enableQR = !this.enableQR;

  }

  getCodeQR(qrCode: string) {
    this.data.address = qrCode;
    this.enableQRReader();
  }

  clearInputs(){
    this.fileInput.nativeElement.value = '';
    this.filename = '';
    this.data.address = '';
    this.data.name = '';
  }
  
  async showContractInformation(){
    const factoryContract = this.contract.getFactoryContract();
    const manager = await factoryContract.methods.manager().call();
    console.log(manager);
  }
  sendFlamingo(){
    this.message = 'This might take a while please wait!';
    this.isLoading = true;
    const reader:FileReader = new FileReader();
    const file = this.fileInput.nativeElement;
    if (file.files && file.files.length > 0) {
      reader.onload = (e) => {
        const prefix = `data:${file.files[0].type};base64,`;
        const dataToUpload = `${prefix}${Helpers.base64ArrayBuffer(reader.result)}`;
        this.ipfs.uploadData(dataToUpload)
        .then((hash) => {
          const imageUrl = `https://ipfs.io/ipfs/${hash}`;
          const flamingo = this.contract.getContractFromAddress(this.data.address);
          this.contract.getAccount()
          .then((accounts) => {
            flamingo.methods.addFlamingo(this.data.name, imageUrl)
            .send({
              from: accounts[0]
            })
            .then((methodResponse) => {
              this.isLoading = false;
              this.message = 'Done! Flamingo uploaded to contract!'
              this.clearInputs();
              console.info(methodResponse);
            })
            .catch(console.error);
          })
          .catch(console.error);
        })
        .catch((err) => {
          console.error(err);
        });
      }
      reader.readAsArrayBuffer(file.files[0]);      
    }
  }

}
