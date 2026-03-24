import { IsAscii, IsNotEmpty, Length } from 'class-validator';

export class CreateTaskDto {
  @IsAscii()
  @Length(3, 30)
  @IsNotEmpty()
  readonly title: string;

  @Length(3, 100)
  @IsNotEmpty()
  readonly description: string;
}
