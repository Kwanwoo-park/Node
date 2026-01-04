import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ItemsController } from './items/items.controller';
import { ItemsService } from './items/items.service';
import { UsersController } from './users/users.controller';

@Module({
  imports: [],
  controllers: [AppController, ItemsController, UsersController],
  providers: [AppService, ItemsService],
})
export class AppModule {}
