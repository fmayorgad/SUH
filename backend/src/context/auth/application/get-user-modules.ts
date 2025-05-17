import { Inject, Injectable } from '@nestjs/common';
import { AuthRepository } from '@context/auth/domain/auth-repository';

@Injectable()
export class GetModulesUSer {
  constructor(@Inject('AuthRepository') private readonly repository: AuthRepository) {}

  async execute(idUser: string) {
    const userModulesData = await this.repository.searchUserModules(idUser);
    return userModulesData;
  }
}
