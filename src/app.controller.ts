import { Controller, Get, Param, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { UrlService } from './url/url.service';
import { CachingService } from './cache/caching.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly urlService: UrlService,
    private readonly cachingService: CachingService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get(':code')
  async redirect(
    @Res() res,
    @Param('code')
    code: string,
  ) {
    let url = await this.cachingService.getFromCache(`url-code-${code}`);
    if (!url) {
      url = await this.urlService.redirect(code);
      await this.cachingService.addToCache(`url-code-${code}`, url);
    }

    await this.urlService.recordHit(code);
    return res.redirect(url.longUrl);
  }
}
