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
          const parsedData = JSON.parse(data)

          const newData = {...parsedData}
          const {coordinates} = parsedData['features'][0]['geometry']
          newData['features'][0]['geometry']['coordinates'] = []
          let currentCoord;
          for(let i = 0; i < coordinates.length; i++) {
            setInterval(() => {
              currentCoord = coordinates[i]
              newData['features'][0]['geometry']['coordinates'].push(currentCoord)
              this.messageGateway.server.emit('routeToOffice', JSON.stringify(newData))
            }, 300)
          }
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
