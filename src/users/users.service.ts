import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { AuthService } from 'src/auth/auth.service';
import { TokenDto } from 'src/auth/dto/token.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly authService: AuthService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.usersRepository.findOneBy({
      email: createUserDto.email,
      isDeleted: false,
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(createUserDto.password, salt);

    const user = this.usersRepository.create();
    user.name = createUserDto.name;
    user.email = createUserDto.email;
    user.password = hashedPassword;
    user.isDeleted = false;
    user.createdAt = new Date();

    const savedUser = await this.usersRepository.save(user);
    return {
      name: savedUser.name,
      email: savedUser.email,
    };
  }

  async login(loginDto: LoginDto): Promise<TokenDto> {
    const user = await this.usersRepository.findOneBy({
      email: loginDto.email,
      isDeleted: false,
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = bcrypt.compareSync(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.authService.generateToken(user);
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }
}
