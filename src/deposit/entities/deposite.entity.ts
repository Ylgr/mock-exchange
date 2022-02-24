import { AfterBulkCreate, Column, Model, Table } from 'sequelize-typescript';

@Table
export class Deposit extends Model {
  @Column
  uid: number;

  @Column
  txHash: string;

  @Column
  amount: number;

  @Column
  confirm: number;

  @Column
  status: number;
}
