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
      console.log(`send data for ${key} from cache`);
      return Promise.resolve(cachedResult);
    }

    const response = await this.appService.proxy(req);

    console.log(`set data for ${key} to cache`);
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
