import { IsNotEmpty, IsString } from "class-validator";


export class CreateGroupchatDto {
    @IsNotEmpty()
    @IsString()
    namegb : string;

    @IsNotEmpty()
    @IsString()
    grouptype: string;

    @IsNotEmpty()
    @IsString()
    password? : string;
}

