import { Injectable } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { TokenDto } from './dto/token.dto';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';
import { UserLoggedDto } from 'src/users/dto/user-logged.dto';
import { ConfigService } from '@nestjs/config';
import { JwtPayloadDto } from './dto/jwt-payload.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

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
    const payload = await this.jwtService.verifyAsync<JwtPayloadDto>(token, {
      secret: this.configService.getOrThrow<string>('JWT_SECRET'),
      algorithms: ['HS256'],
      audience: 'kanban-be',
      issuer: 'kanban-be',
    });

    return {
      userId: payload.userId,
      name: payload.name,
      email: payload.email,
    };
  }
}
