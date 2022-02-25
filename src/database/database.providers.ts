import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });
import { Sequelize } from 'sequelize-typescript';
import { BicBalance } from '../bic-balance/entities/bic-balance.entity';
import { Config } from '../config/entities/config.entity';
import { Deposit } from '../deposit/entities/deposite.entity';


export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: 'postgres',
        host: process.env.POSTGRES_HOST,
        port: parseInt(process.env.POSTGRES_PORT, 10),
        username: process.env.POSTGRES_USERNAME,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DATABASE,
        native: true,
      });
      sequelize.addModels([
        Config,
        BicBalance,
        Deposit
      ]);
      await sequelize.sync({ force: false, alter: true });
      return sequelize;
    },
  },
];
