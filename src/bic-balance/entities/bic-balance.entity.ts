import { AfterBulkCreate, Column, Model, Table } from 'sequelize-typescript';

@Table
export class BicBalance extends Model {
  @Column
  uid: number;

  @Column
  address: number;

  @Column
  amount: number;
}
