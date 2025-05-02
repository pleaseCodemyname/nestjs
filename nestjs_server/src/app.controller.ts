import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get() // @Get('/')
  getHome() {
    return '<h1>Home Page</h1>';
  }

  @Get('post')
  getPost() {
    return '<h1>Post Page</h1>';
  }

  @Get('user')
  getUser() {
    return '<h1>User Page</h1>';
  }
}
