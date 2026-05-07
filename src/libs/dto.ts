import { IsString, IsOptional, IsDate, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class PayloadDto {}

export class RabbitEventDto {
  @IsString()
  id: string;

  @IsOptional()
  @IsString()
  type?: string;

  @ValidateNested()
  @Type(() => PayloadDto)
  payload: PayloadDto;

  @IsDate()
  @Type(() => Date)
  createdAt: Date;
}
