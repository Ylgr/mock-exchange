import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table
export class InternalTransaction extends Model {
  @Column
  fromUid: number

  @Column
  toUid: number

  @Column({unique: true})
  txHash: string;

  @Column({ type: DataType.DECIMAL(30,0), allowNull: false })
  amount: string;
}
