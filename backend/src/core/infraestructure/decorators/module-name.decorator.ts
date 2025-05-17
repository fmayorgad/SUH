import { SetMetadata } from '@nestjs/common';

import { ModulesEnum } from '@enums/modules';

export const ModuleName = (name: ModulesEnum) => SetMetadata('module', name);
