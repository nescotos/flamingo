import { Component, OnInit, ViewChild , ElementRef} from '@angular/core';
import { ContractService } from '../contract.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Config } from 'protractor';
import { Result } from '@zxing/library';
import { ZXingScannerComponent } from '@zxing/ngx-scanner';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public query:string = ''; 
  public message;
  public enableQR:boolean = false;
  public scannerStatus:string = 'none';
  public flamingos:any = [];
  public device:MediaDeviceInfo;
  public qrButtonMessage:string = 'Read QR Code';
  @ViewChild('scanner') scanner:ZXingScannerComponent;
  @ViewChild('queryInput') queryInput:ElementRef;
  constructor(private contract:ContractService, private http:HttpClient) {
   }

  ngOnInit() {
    this.scanner.camerasFound.subscribe((devices: MediaDeviceInfo[]) => {
      if(devices && devices.length > 0){
        this.device = devices[0];
      }
    });
  }

  getBase64Image(url:string){
    return this.http.get(url, {responseType: 'text'});
  }

  async searchResults(){
    this.flamingos = [];
    const flamingo = this.contract.getContractFromAddress(this.query);
    const flamingosLength = await flamingo.methods.getflamingosLength().call();
    if(flamingosLength < 1){
      this.message = `No Flamingos Found for the Contract ${this.query}`;
    }else{
      for(let i = 0; i < flamingosLength; i++){
        const flamingoes = await flamingo.methods.flamingos(i).call();
        this.getBase64Image(flamingoes.imageUrl).subscribe((data) => {
          flamingoes.base64Image = data;
        });
        this.flamingos.push(flamingoes);
      }
    }
  }



  enableQRReader() {
    if(this.enableQR){
      this.qrButtonMessage = 'Read from QR';
      this.scannerStatus = 'none';
    }else{
      this.qrButtonMessage = 'Stop Reading from QR';
      this.scannerStatus = '';
    }
    this.enableQR = !this.enableQR;

  }

  getCodeQR(qrCode: string) {
    this.query = qrCode;
    this.enableQRReader();
    this.queryInput.nativeElement.focus();
  }

}
