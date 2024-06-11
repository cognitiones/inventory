import { ApiProperty } from "@nestjs/swagger";

export class RegisterUserVo {
    id: number
}

export class getAllVo {
    id: number

    createdAt: string

    updatedAt: string

    email: string

    name: string
}