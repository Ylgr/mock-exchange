export class CreateTransactionToAddressDto {
  fromUid: number;
  toAddress: string;
  amount: string;
}

export class CreateTransactionToUidDto {
  fromUid: number;
  toUid: number;
  amount: string;
}
