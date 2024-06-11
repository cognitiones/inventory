import { IsNumber, IsString, IsOptional, IsDateString, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from "@nestjs/swagger";

export class GetTasksDto {
    @ApiProperty()
    @IsNotEmpty({
        message: "tagId 不能为空"
    })
    @Type(() => Number)
    @IsNumber()
    tagId: number
}