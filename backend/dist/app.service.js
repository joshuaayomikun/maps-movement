"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const fs_1 = require("fs");
const path_1 = require("path");
const app_gateway_1 = require("./app.gateway");
let AppService = class AppService {
    constructor(messageGateway) {
        this.messageGateway = messageGateway;
    }
    getRouteToOffice() {
        const filePath = (0, path_1.join)(process.cwd(), './public/popeye-village-balluta.geojson.json');
        return new Promise((resolve, reject) => {
            (0, fs_1.readFile)(filePath.toString(), 'utf-8', (err, data) => {
                if (err) {
                    reject(err);
                }
                else {
                    this.messageGateway.server.emit('routeToOffice', data);
                }
            });
        });
    }
    getRouteTOLunch() {
        const filePath = (0, path_1.join)(process.cwd(), './public/lunch.geojson.json');
        return new Promise((resolve, reject) => {
            (0, fs_1.readFile)(filePath.toString(), 'utf-8', (err, data) => {
                if (err) {
                    reject(err);
                }
                else {
                    console.log({ data });
                    this.messageGateway.server.emit('routeToLunch', data);
                }
            });
        });
    }
};
AppService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [app_gateway_1.AppGateway])
], AppService);
exports.AppService = AppService;
//# sourceMappingURL=app.service.js.map