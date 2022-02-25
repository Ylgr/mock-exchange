import { Table, Column, Model } from 'sequelize-typescript';

export enum ConfigType {
  syncedDeposit = 'SyncedDeposit',
}

@Table
export class Config extends Model {
  @Column({ primaryKey: true })
  type: ConfigType;

  @Column
  value: string;
}
