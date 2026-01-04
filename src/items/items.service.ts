import { Injectable, NotFoundException } from '@nestjs/common';
import { Item } from './item.interface';
import { CreateItemDto } from './dto/create-item.dto';

@Injectable()
export class ItemsService {
    private readonly items: Item[] = [];

    findAll(): Item[] {
        return this.items;
    }

    findOne(id: number): Item {
        const item =  this.items.find(item => item.id === id);

        if (!item) {
            throw new NotFoundException("Item not found")
        }

        return item
    }

    create(item: CreateItemDto) {
        this.items.push(item);
        return item;
    }

    delete(id: number): void {
        const index = this.items.findIndex(item => item.id === id);
        if (index !== -1) {
            this.items.splice(index, 1);
        }
    }
}
