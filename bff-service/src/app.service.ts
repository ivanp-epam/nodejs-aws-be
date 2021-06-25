import {HttpService, Injectable} from '@nestjs/common';
import {Request} from 'express';
import {AxiosError, AxiosResponse, Method} from 'axios';
import {CannotProcessException} from "./cannot-process.exception";
import {of} from "rxjs";
import {catchError, map} from 'rxjs/operators';

@Injectable()
export class AppService {
  constructor(private httpService: HttpService) {
  }

  async proxy(req: Request): Promise<AxiosResponse> {
    let axiosRequest = {
      method: <Method>req.method,
      body: req.body,
      baseURL: this.resolveBaseUrl(req)
    }

    if (req.headers['Authorization']) {
      axiosRequest['headers'] = {'Authorization': req.headers['Authorization']}
    }

    console.log(`Performing request ${JSON.stringify(axiosRequest)}`);

    return this.httpService.request(axiosRequest).pipe(
      map((response: AxiosResponse) => {
        return response;
      }),
      catchError((error: AxiosError) => {
        console.log(`Request ${JSON.stringify(axiosRequest)} has been resulted with error status code: ${error.response.status}`);
        return of(error.response);
      }),
    ).toPromise();
  }

  private resolveBaseUrl(req: Request): string {
    const urls = {
      '/profile/cart': "CART_URL",
      '/products': "PRODUCT_URL"
    };
    const url = req.baseUrl;
    const envVar = urls[url];

    if (!envVar || !process.env[envVar]) {
      throw new CannotProcessException();
    }

    return `${process.env[envVar]}${url}`;
  }
}
