import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { appRouter } from './trpc/trpc.router';
import { createContext } from './trpc/trpc.context';
import { PrismaService } from './prisma/prisma.service';
import { AuthService } from './auth/auth.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const prisma = app.get(PrismaService);
  const authService = app.get(AuthService);

  app.use(
    '/trpc',
    createExpressMiddleware({
      router: appRouter,
      createContext: (opts) => createContext({ ...opts, prisma, authService }),
    }),
  );
  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
