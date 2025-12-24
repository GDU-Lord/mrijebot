import { NestFactory } from '@nestjs/core';
import { CoreModule } from './core.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(CoreModule);
  
  const configService = app.get(ConfigService);

  await app.listen(process.env.port ?? 4444);
}
bootstrap();
