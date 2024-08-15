import { ApiProperty } from "@nestjs/swagger";
import { List } from "@prisma/client"
import { AddListDto } from "../dto/list.dto";
export class GetListVo extends AddListDto {
    
}

export class AddListVo  {
    @ApiProperty()
    id: number
}
