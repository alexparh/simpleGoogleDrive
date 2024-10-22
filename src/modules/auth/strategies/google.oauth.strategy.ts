import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as passport from 'passport';
import {
  Profile as ProfileGoogle,
  Strategy,
  VerifyCallback,
} from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy {
  constructor(private configService: ConfigService) {
    const options = this.configService.get('google');
    passport.use(new Strategy(options, this.callback));
  }

  callback(
    accessToken: string,
    refreshToken: string,
    profile: ProfileGoogle,
    cb: VerifyCallback,
  ) {
    const { emails } = profile;

    cb(null, { accessToken, refreshToken, profile, email: emails?.[0]?.value });
  }
}
