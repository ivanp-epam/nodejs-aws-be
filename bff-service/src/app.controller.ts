import {All, Controller, Req, Res} from '@nestjs/common';
import {Request, Response} from 'express';
import {AppCacheService} from "./app-cache.service";

@Controller('*')
export class AppController {
  constructor(private readonly appService: AppCacheService) {
  }

  @All()
  async proxy(@Req() request: Request, @Res() res: Response) {
    const result = await this.appService.proxy(request);
    return res.status(result.status).send(result.data);
  }
}
