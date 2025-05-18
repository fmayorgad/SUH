import { ProfileModulePermission } from '@models/index';
import { GetAssociationsInput } from '@context/associate-roles-module/application/get-associations-input';

export interface AssociateRolesRepository {
  save(profileId: string, associations: ProfileModulePermission[]): Promise<void>;

  findById(id: string): Promise<ProfileModulePermission[] | null>;

  findForFilters(filtros: GetAssociationsInput): Promise<ProfileModulePermission[]>;
}
