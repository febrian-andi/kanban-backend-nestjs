import { Injectable } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { TokenDto } from './dto/token.dto';
import { JwtService, JwtVerifyOptions } from '@nestjs/jwt';
import { randomUUID } from 'crypto';
import { UserLoggedDto } from 'src/users/dto/user-logged.dto';
import { ConfigService } from '@nestjs/config';
import { JwtPayloadDto } from './dto/jwt-payload.dto';
import { JwtConfig } from 'src/config/config';

@Injectable()
export class AuthService {
  private jwtVerifyOptions: JwtVerifyOptions;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    const jwtConfig = this.configService.getOrThrow<JwtConfig>('jwt');

    this.jwtVerifyOptions = {
      secret: jwtConfig.secret,
      algorithms: [jwtConfig.algorithm],
      audience: jwtConfig.audience,
      issuer: jwtConfig.issuer,
    };
  }

  async generateToken(user: User): Promise<TokenDto> {
    const payload: JwtPayloadDto = {
      jwtId: randomUUID(),
      userId: user.id,
      name: user.name,
      email: user.email,
    };

    return {
      kind: 'Bearer',
      token: await this.jwtService.signAsync(payload),
    };
  }

  async verifyToken(token: string): Promise<UserLoggedDto> {
    const payload = await this.jwtService.verifyAsync<JwtPayloadDto>(
      token,
      this.jwtVerifyOptions,
    );

    return {
      userId: payload.userId,
      name: payload.name,
      email: payload.email,
    };
  }
}
