import { Injectable } from '@nestjs/common';

@Injectable()
export class BicBalanceService {
  findAll() {
    return `This action returns all bicBalance`;
  }

  findOne(id: number) {
    return `This action returns a #${id} bicBalance`;
  }

  remove(id: number) {
    return `This action removes a #${id} bicBalance`;
  }
}
