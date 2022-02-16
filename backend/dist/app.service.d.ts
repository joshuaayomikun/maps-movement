import { AppGateway } from './app.gateway';
export declare class AppService {
    private readonly messageGateway;
    constructor(messageGateway: AppGateway);
    getRouteToOffice(): Promise<any>;
    getRouteTOLunch(): Promise<any>;
}
