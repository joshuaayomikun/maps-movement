import { Injectable } from '@nestjs/common';
import { readFile } from 'fs';
import { join } from 'path';
import { AppGateway } from './app.gateway';

@Injectable()
export class AppService {

  constructor(private readonly messageGateway: AppGateway) {
  }

  getRouteToOffice(): Promise<any> {
    const filePath = join(process.cwd(), './public/popeye-village-balluta.geojson.json');
    // const messageGateway = this.messageGateway
    return new Promise((resolve, reject) => {
      readFile(filePath.toString(), 'utf-8', (err, data) => {
        if (err) {
          reject(err);
        } else {
          // console.log({ data })
          // const httpResponseObjectArray = JSON.parse(data).HttpTestResponse;

          this.messageGateway.server.emit('routeToOffice', data)
          // resolve(httpResponseObjectArray);
        }
      });
    });
    // this.messageGateway.server.emit('msgToClient', )
  }

  getRouteTOLunch(): Promise<any> {
    const filePath = join(process.cwd(), './public/lunch.geojson.json');
    // const messageGateway = this.messageGateway
    return new Promise((resolve, reject) => {
      readFile(filePath.toString(), 'utf-8', (err, data) => {
        if (err) {
          reject(err);
        } else {
          console.log({ data })
          // const httpResponseObjectArray = JSON.parse(data).HttpTestResponse;

          this.messageGateway.server.emit('routeToLunch', data)
          // resolve(httpResponseObjectArray);
        }
      });
    });
  }


}
