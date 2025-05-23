import { Module } from '@nestjs/common';
import { SubscribersService } from './subscribers.service';
import { SubscribersController } from './subscribers.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Subscriber, SubscriberSchema } from './schemas/subscriber.schemas';

@Module({
  controllers: [SubscribersController],
  providers: [SubscribersService],
  exports: [SubscribersService],
  imports: [MongooseModule.forFeature([{ name: Subscriber.name, schema: SubscriberSchema }])],
})
export class SubscribersModule {}
