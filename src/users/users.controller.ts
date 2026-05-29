import {
  Controller,
  Get,
  Post,
  Body,
  // Patch,
  Param,
  Version,
  HttpCode,
  HttpStatus,
  // Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { TokenDto } from 'src/auth/dto/token.dto';
import { SkipAuthGuard } from 'src/core/decorators/skip-auth.decorator';
// import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Version('1')
  @SkipAuthGuard()
  @Post('/register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Version('1')
  @SkipAuthGuard()
  @Post('/login')
  @HttpCode(HttpStatus.OK)
  login(@Body() loginDto: LoginDto): Promise<TokenDto> {
    return this.usersService.login(loginDto);
  }

  @Version('1')
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.usersService.findOne(id);
  }
}
