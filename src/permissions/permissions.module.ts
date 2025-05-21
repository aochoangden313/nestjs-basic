import { Module } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { PermissionsController } from './permissions.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PermissionSchema } from './schemas/permission.schemas';

@Module({
  controllers: [PermissionsController],
  providers: [PermissionsService],
  imports: [MongooseModule.forFeature([{ name: 'Permission', schema: PermissionSchema }])],
})
export class PermissionsModule {}
