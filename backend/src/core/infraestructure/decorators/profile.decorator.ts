import { SetMetadata } from '@nestjs/common';

export const Profiles = (...profiles: string[]) => SetMetadata('profiles', profiles);
