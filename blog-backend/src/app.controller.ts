import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from './common/decorators/public.decorator';

@ApiTags('Root')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Check if the API is running' })
  @ApiResponse({ status: 200, description: 'API is running' })
  getHello(): string {
    return this.appService.getHello();
  }

  @Public()
  @Get('status')
  @ApiOperation({ summary: 'Get database status' })
  @ApiResponse({ status: 200, description: 'Database is connected' })
  getStatus(): { status: string; database: string } {
    return this.appService.getDatabaseStatus();
  }
}
