import { NestFactory } from '@nestjs/core';
import { AppModule } from '@app/app.module';
import { DatabaseExceptionFilter } from '@app/common/filters/database-exception.filter';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalFilters(new DatabaseExceptionFilter());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch((err) => {
  console.error('Application failed to start:', err);
});
