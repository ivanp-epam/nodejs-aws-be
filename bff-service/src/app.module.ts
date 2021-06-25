import {CacheModule, HttpModule, Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {ConfigModule} from '@nestjs/config';
import {AppCacheService} from "./app-cache.service";

@Module({
  imports: [HttpModule, ConfigModule.forRoot(), CacheModule.register()],
  controllers: [AppController],
  providers: [AppService, AppCacheService],
})
export class AppModule {
}
