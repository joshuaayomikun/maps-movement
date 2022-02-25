import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  console.log({PORT:process.env.BACKEND_PORT})
  await app.listen(process.env.BACKEND_PORT);
}
bootstrap();
