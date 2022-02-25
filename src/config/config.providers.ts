import { Config } from './entities/config.entity';

export const configProviders = [
  {
    provide: 'CONFIG_REPOSITORY',
    useValue: Config,
  },
];
