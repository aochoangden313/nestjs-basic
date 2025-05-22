import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Permission, PermissionDocument } from 'src/permissions/schemas/permission.schemas';
import { Role, RoleDocument } from 'src/roles/schemas/role.schemas';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import { UsersService } from 'src/users/users.service';
import { ADMIN_ROLE, INIT_PERMISSIONS, USER_ROLE } from './sample';
import { count } from 'console';

@Injectable()
export class DatabasesService implements OnModuleInit {
    private readonly logger: any= new Logger(DatabasesService.name);

    constructor(
        @InjectModel(User.name)
        private userModel: SoftDeleteModel<UserDocument>,

        @InjectModel(Permission.name)
        private permissionsModel: SoftDeleteModel<PermissionDocument>,

        @InjectModel(Role.name)
        private roleModel: SoftDeleteModel<RoleDocument>,

        private configService: ConfigService,
        private userService: UsersService,

    ) { }

    async onModuleInit() {
        const isInit = this.configService.get<string>('SHOULD_INIT');
        if (Boolean(isInit) === true) {
            const countUser = await this.userModel.count({});
            const countPermission = await this.permissionsModel.count({});
            const countRole = await this.roleModel.count({});

            // create permissions
            if (countPermission === 0) {
                await this.permissionsModel.insertMany(INIT_PERMISSIONS)
            }

            // create role
            if (countRole === 0) {
                const permissions = await this.permissionsModel.find({}).select('_id');
                await this.roleModel.insertMany([
                    {
                        name: ADMIN_ROLE,
                        description: 'Admin role',
                        isActive: true,
                        permissions: permissions
                    },
                    {
                        name: USER_ROLE,
                        description: 'User role',
                        isActive: true,
                        permissions: []
                    },
                ])
            }

            if (countUser === 0) {
                const adminRole = await this.roleModel.findOne({ name: ADMIN_ROLE });
                const userRole = await this.roleModel.findOne({ name: USER_ROLE });
                await this.userModel.insertMany([
                    {
                        name: 'Admin',
                        email: 'admin@gmail.com',
                        password: this.userService.getHashPassword(this.configService.get<string>('INIT_PASSWORD')),
                        age: 69,
                        gender: "MALE",
                        address: "Hà Nội",
                        role: adminRole?._id,
                    },
                    {
                        name: 'quanlv',
                        email: 'quanlv@gmail.com',
                        password: this.userService.getHashPassword(this.configService.get<string>('INIT_PASSWORD')),
                        age: 69,
                        gender: "MALE",
                        address: "Hà Nội",
                        role: adminRole?._id,
                    },
                    {
                        name: 'Normal user',
                        email: 'normal_user@gmail.com',
                        password: this.userService.getHashPassword(this.configService.get<string>('INIT_PASSWORD')),
                        age: 69,
                        gender: "MALE",
                        address: "Hà Nội",
                        role: userRole?._id,
                    },
                ]);
            }
            if (countUser > 0 && countRole > 0 && countPermission > 0) {
                this.logger.log('Database already initialized');
            }
        }


    };

}
