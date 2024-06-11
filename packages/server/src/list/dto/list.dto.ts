import { IsNumber, IsString, IsOptional, IsDateString, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class AddListDto {
    @IsNotEmpty({
        message: "userId 不能为空"
    })
    @IsNumber()
    userId: number

    @IsNotEmpty({
        message: "标题不能为空"
    })
    @IsString()
    title: string;


    @IsString()
    @IsOptional()
    description?: string;

    @IsDateString()
    @IsOptional()
    startDate?: string;

    @IsDateString()
    @IsOptional()
    endDate?: string;

    // The user relation is handled separately, so it's not part of the DTO
}

export class GetListDto {
    @IsNotEmpty({
        message: "userId 不能为空"
    })
    @Type(() => Number)
    @IsNumber()
    userId: number

    @IsNotEmpty({
        message: "listId 不能为空"
    })
    @Type(() => Number)
    @IsNumber()
    listId: number
}

export class GetAllListDto {
    @IsNotEmpty({
        message: "page 不能为空"
    })
    @Type(() => Number)
    page: number

    @IsNotEmpty({
        message: "pageSize 不能为空"
    })
    @Type(() => Number)
    pageSize: number

    @IsNotEmpty({
        message: "userId 不能为空"
    })
    @Type(() => Number)
    @IsNumber()
    userId: number
}