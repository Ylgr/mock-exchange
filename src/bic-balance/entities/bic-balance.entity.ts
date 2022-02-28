import { Column, Model, Table, DataType } from 'sequelize-typescript';

@Table
export class BicBalance extends Model {
  @Column({unique: true})
  uid: number;

  @Column
  address: string;

  @Column({ type: DataType.DECIMAL(30,0), allowNull: false })
  amount: string;
}
