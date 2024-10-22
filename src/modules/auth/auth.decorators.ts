import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import * as passport from 'passport';

export const RedirectUrl = createParamDecorator(
  async (strategy: string, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();

    return new Promise((resolve, reject) => {
      const res = {
        setHeader: (name: string, url: string) =>
          name === 'Location' && resolve({ url }),
        end: () => {},
      };

      passport.authenticate(strategy)(
        req,
        res,
        (err: Error) => err && reject(err),
      );
    });
  },
);

export const Authenticate = createParamDecorator(
  async (strategy: string, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    const res = { setHeader: () => {}, end: () => {} };
    const { req } = ctx.getContext();
    req.query = ctx.getArgs();

    return new Promise((resolve, reject) => {
      const f = passport.authenticate(strategy, { session: false });
      f(req, res, (err: Error) => (err ? reject(err) : resolve(req.user)));
    });
  },
);
