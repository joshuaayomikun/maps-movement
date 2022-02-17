import { Controller, Get, StreamableFile, Response } from '@nestjs/common';
import { createReadStream } from 'fs';
import { join } from 'path';
import { AppService } from './app.service';

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('to-office')
  getRouteToOffice(): string {
    this.appService.getRouteToOffice();
    return "done"
  }

  @Get('to-lunch')
  getRouteToLunch(): string {
    this.appService.getRouteTOLunch();
    return "Done"
  }
}
