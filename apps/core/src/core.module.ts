import { Module, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameSystem, Land, Member, User } from './entities';
import { APP_PIPE } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LandController, UserController } from './controllers';
import { GameSystemController } from './controllers/game-system/game-system.controller';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get('DB_PORT', 5432),
        username: configService.get('DB_USERNAME', 'postgres'),
        password: configService.get('DB_PASSWORD', 'sanitar203'),
        database: configService.get('DB_NAME', 'mrijebot'),
        autoLoadEntities: true,
        synchronize: configService.get('DB_SYNC', 'true') === 'true',
        logging: true
      }),
    }),
    TypeOrmModule.forFeature([GameSystem, Land, User, Member]),
  ],
  controllers: [UserController, LandController, GameSystemController],
  providers: [
    {
      provide: APP_PIPE,
      useFactory: () => new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
        validateCustomDecorators: true,
      }),
    },
  ],
})
export class CoreModule {}