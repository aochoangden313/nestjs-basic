import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './user/user.controller';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forRoot('mongodb+srv://quanlv56:u5gpqc5vVJ6hmk7z@cluster0.lgiw0.mongodb.net/')],
  controllers: [AppController, UserController],
  providers: [AppService],
})
export class AppModule {}
