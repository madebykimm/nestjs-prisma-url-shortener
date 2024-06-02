import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

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

  it('/POST auth/login (Unauthorized)', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'test@example.com', password: 'wrongpassword' })
      .expect(404);
  });

  it('/POST auth/login (Authorized)', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'test@test.com', password: 'Password123!' })
      .expect(201)
      .then((response) => {
        expect(response.body).toHaveProperty('accessToken');
      });
  });
});
