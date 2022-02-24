import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BicBalanceService } from './bic-balance.service';

@Controller('bic-balance')
export class BicBalanceController {
  constructor(private readonly bicBalanceService: BicBalanceService) {}

  @Get()
  findAll() {
    return this.bicBalanceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bicBalanceService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bicBalanceService.remove(+id);
  }
}
