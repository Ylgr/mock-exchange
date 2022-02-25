import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BicBalanceService } from './bic-balance.service';

@Controller('bic-balance')
export class BicBalanceController {
  constructor(private readonly bicBalanceService: BicBalanceService) {}

  // @Get()
  // findAll() {
  //   return this.bicBalanceService.findAll();
  // }

  @Get(':uid')
  getOrCreate(@Param('uid') uid: string) {
    return this.bicBalanceService.getOrCreate(+uid);
  }

}
