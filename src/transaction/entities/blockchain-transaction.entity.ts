import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table
export class BlockchainTransaction extends Model {
  @Column
  fromUid: number

  @Column
  toAddress: number

  @Column({ type: DataType.DECIMAL(30,0), allowNull: false })
  amount: string;
}
