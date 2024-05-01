import { IsString } from 'class-validator'

export class GenerateAnswerDto {
  @IsString()
  question!: string
}
