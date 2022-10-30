import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as passport from 'passport';
import { TypeormStore } from 'connect-typeorm';
import { SessionEntity } from './typeorm/Session';
import { DataSource } from 'typeorm';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const sessionRepository = app.get(DataSource).getRepository(SessionEntity);
  app.use(
    session({
      secret: 'knsolvro',
      resave: false,
      saveUninitialized: false,
      cookie : {
        maxAge: 60000,
      },
      store: new TypeormStore().connect(sessionRepository),
    }),
  );
  await app.listen(3000);
}
bootstrap();
