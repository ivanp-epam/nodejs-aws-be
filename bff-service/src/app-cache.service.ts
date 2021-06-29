import {CACHE_MANAGER, Inject, Injectable} from '@nestjs/common';
import {Request} from 'express';
import {AxiosResponse} from 'axios';
import {Cache} from "cache-manager";
import {AppService} from "./app.service";

@Injectable()
export class AppCacheService {

  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    @Inject(AppService) private readonly appService: AppService
  ) {
  }

  async proxy(req: Request): Promise<AxiosResponse> {
    const key = req.baseUrl;
    const shouldCache = this.shouldCache(req);
    console.log(`${key} should be cached: ${shouldCache}`);

    if (!shouldCache) {
      return this.appService.proxy(req);
    }
    const cachedResult = await this.cacheManager.get(key) as AxiosResponse;

    if (cachedResult) {
      console.log(`Cache HIT for key: ${key}`);
      return Promise.resolve(cachedResult);
    }

    console.log(`Cache miss for key: ${key}`);

    const response = await this.appService.proxy(req);

    console.log(`Saving data into cache with key: ${key}`);
    await this.cacheManager.set(key, response, {ttl: +process.env['CACHE_TTL']});

    return Promise.resolve(response);
  }

  private shouldCache(req: Request): boolean {
    if (req.method.toUpperCase() !== 'GET') {
      return false;
    }
    return req.baseUrl === '/products';
  }
}
