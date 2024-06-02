import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/POST auth/login (Authorized)', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'test@test.com', password: 'Password123!' })
      .expect(201)
      .then((response) => {
        expect(response.body).toHaveProperty('accessToken');
        accessToken = response.body.accessToken;
      });
  });

  it('/GET admin/urls route (Authorized)', () => {
    return request(app.getHttpServer())
      .get('/admin/urls?page=1&limit=2') // Adjust the path to your protected route
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);
  });
});
