import { SetMetadata } from '@nestjs/common';

export const Metadata = (key: string, value: string) => SetMetadata(key, value); 