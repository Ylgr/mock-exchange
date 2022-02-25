import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table
export class Deposit extends Model {
  @Column
  uid: number;

  @Column
  txHash: string;

  @Column({ type: DataType.DECIMAL(30,0), allowNull: false })
  amount: string;

  @Column
  fromAddress: string;

  @Column
  toAddress: string;

  @Column
  blockNumber: number;
}
