import { ApiProperty } from "@nestjs/swagger";

export class GetListVo {
    @ApiProperty()
    id: number

    @ApiProperty()
    createdAt: string

    @ApiProperty()
    updatedAt: string

    @ApiProperty()
    title: string

    @ApiProperty()
    description?: string

    @ApiProperty()
    startDate?: string

    @ApiProperty()
    endDate?: string

    @ApiProperty()
    userId: number
}

export class AddListVo {
    @ApiProperty()
    id: number
}