import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { PgsqlUsersRepository } from './persistence/plsql-users.repository';

//controllers
import { UsersGetController } from './controllers/get.users.controller';
import { PostUsersController } from './controllers/post.users.controller';
import { PutUsersController } from './controllers/put.users.controller';
import { PatchUsersController } from './controllers/patch.users.controller';

//schemas 
import { UserSchema } from '@schemas/user.schema'
import { DepartamentoSchema } from '@schemas/departamento.schema';
import { VisitVerificadoresSchema } from '@schemas/visit_verificadores.schema';

//application
import { GetAllUsers } from '@context/users/application/getAll';
import { CreateUser } from '@context/users/application/create/create.user';
import { UpdateUser } from '@context/users/application/update/update.user';
import { ChangeStateUser } from '@context/users/application/change-state/change-state.user';

const UserRepositoryProvider = {
  provide: 'userRepository',
  useClass: PgsqlUsersRepository,
};

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DepartamentoSchema,
      UserSchema,
      VisitVerificadoresSchema,
    ]),
    HttpModule,
  ],
  controllers: [UsersGetController, PostUsersController, PutUsersController, PatchUsersController],
  providers: [UserRepositoryProvider, GetAllUsers, CreateUser, UpdateUser, ChangeStateUser],
  exports: [],
})
export class UsersModule { }
