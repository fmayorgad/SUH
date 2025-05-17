export interface AuthRepository {
    searchUser(login: string): Promise<any | null>; 
    searchUserModules(idUser: string): Promise<any | null>;
    searchUserMenu(moduleId: string, profileId: string, permissionId: string): Promise<boolean | null>;
  }
  