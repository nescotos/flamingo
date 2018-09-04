import { Injectable } from '@angular/core';
import * as Ipfs from 'ipfs-mini';

@Injectable({
  providedIn: 'root'
})
export class IpfsService {

  ipfs:any;
  constructor() {
      this.ipfs = new Ipfs({
        host: 'ipfs.infura.io',
        port: 5001,
        protocol: 'https'
      });
   }

   uploadData(data:string) : Promise<string>{
     return new Promise((resolve, reject) => {
      this.ipfs.add(data, (err, hash) => {
        if(err){
          reject(err);
        }else{
          resolve(hash);
        }
      });
     });
   }
}
