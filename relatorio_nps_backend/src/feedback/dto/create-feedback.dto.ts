/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateFeedbackDto {
  @ApiProperty({
    example: 'Radix Eng',
    description: 'Nome da empresa avaliada',
  })
  @IsString()
  companyName!: string;

  @ApiProperty({ example: 5, description: 'Avaliação de 0 a 5' })
  @IsInt()
  @Min(0)
  @Max(5)
  rating!: number;

  @ApiProperty({ example: 'Ótimo atendimento!', required: false })
  @IsOptional()
  @IsString()
  comment?: string;

  @ApiProperty({ example: 'Caio Moraes', required: false })
  @IsString()
  @IsOptional()
  userName?: string;
}
