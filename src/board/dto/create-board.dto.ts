import { IsNotEmpty, IsString } from "class-validator";

export class CreateBoardDto {
    @IsString()
    @IsNotEmpty()
    description: string;

    @IsString()
    @IsNotEmpty()
    imgSrc: string;

    @IsString()
    @IsNotEmpty()
    url: string;
}