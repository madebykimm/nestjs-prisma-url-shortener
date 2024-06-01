import { Controller, Get, Param, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { UrlService } from './url/url.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly urlService: UrlService,
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
    const url = await this.urlService.redirect(code);

    return res.redirect(url.longUrl);
  }
}
