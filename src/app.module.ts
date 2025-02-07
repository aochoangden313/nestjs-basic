import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './user/user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports:[ 
    // MongooseModule.forRoot('mongodb+srv://quanlv56:u5gpqc5vVJ6hmk7z@cluster0.lgiw0.mongodb.net/'),
  MongooseModule.forRootAsync({
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => ({
      uri: configService.get<string>('MONGODB_URL'),
    }),
    inject: [ConfigService],
  }),
    ConfigModule.forRoot({
      isGlobal: true,
    })
  ],
  controllers: [AppController, UserController],
  providers: [AppService],
})
export class AppModule {}
