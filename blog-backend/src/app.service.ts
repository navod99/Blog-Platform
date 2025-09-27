import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class AppService {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  getHello(): string {
    return 'Welcome to the Blog Platform API!';
  }

  getDatabaseStatus(): { status: string; database: string } {
    const dbStatus =
      Number(this.connection.readyState) === 1 ? 'connected' : 'disconnected';
    return {
      status: 'API is running',
      database: `MongoDB ${dbStatus}`,
    };
  }
}
