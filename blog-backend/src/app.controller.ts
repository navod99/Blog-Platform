import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Check if the API is running' })
  @ApiResponse({ status: 200, description: 'API is running' })
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('status')
  @ApiOperation({ summary: 'Get database status' })
  @ApiResponse({ status: 200, description: 'Database is connected' })
  getStatus(): { status: string; database: string } {
    return this.appService.getDatabaseStatus();
  }
}
