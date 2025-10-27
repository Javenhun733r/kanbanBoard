import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super();
  }

  async onModuleInit() {
    await this.$connect();
    console.log('PrismaService: Підключено до бази даних.');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    console.log('PrismaService: Відключено від бази даних.');
  }
}
