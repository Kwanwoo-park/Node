import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ItemsService } from './items.service';
import type { Item } from './item.interface';
import { CreateItemDto } from './dto/create-item.dto';

@Controller('items')
export class ItemsController {
    constructor(private readonly itemService: ItemsService) {}

    @Get()
    findAll(): Item[] {
        return this.itemService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number): Item {
        return this.itemService.findOne(+id);
    }

    @Post()
    create(@Body() item: CreateItemDto): CreateItemDto {
        return this.itemService.create(item);
    }

    @Delete(':id')
    delete(@Param('id', ParseIntPipe) id: number): void {
        return this.itemService.delete(+id);
    }
}
