import { ForbiddenException, Injectable } from '@nestjs/common';
import { RegisterDto } from 'src/auth/auth.dto';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcrypt';
import { UserDto } from './user.dto';
import { Prisma, Role } from '@prisma/client';
@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async create(payload: RegisterDto) {
    const { email, name, password } = payload;
    return await this.prismaService.user.create({
      data: {
        email,
        name,
        password: await bcrypt.hash(password, 10),
      },
    });
  }

  async update(
    id: string,
    payload: UserDto,
    { image, backgroundImage }: { image?: string; backgroundImage?: string },
  ) {
    return await this.prismaService.user.update({
      where: {
        id,
      },
      data: {
        ...payload,
        image: image || undefined,
        backgroundImage: backgroundImage || undefined,
      },
    });
  }

  async all({
    q,
    isActive,
    role,
    page,
    perPage,
  }: {
    q: string;
    isActive: number;
    role?: Role;
    page: number;
    perPage: number;
  }) {
    const skip = (page - 1) * perPage;
    const filterOptions = {};
    if (isActive) {
      filterOptions['isActive'] = isActive === 1;
    }

    if (!!role) {
      filterOptions['role'] = role;
    }
    const whereClause: Prisma.UserWhereInput = { ...filterOptions };
    if (!!q) {
      whereClause.OR = [
        {
          email: {
            startsWith: q,
          },
        },
        {
          name: {
            contains: q,
            mode: 'insensitive',
          },
        },
      ];
    }

    return await this.prismaService.user.findMany({
      where: whereClause,
      take: perPage,
      skip,
    });
  }
  async find(userId: string) {
    const result = await this.prismaService.user.findUnique({
      where: {
        id: userId,
        NOT: {
          role: 'admin',
        },
      },
      select: {
        id: true,
        name: true,
        backgroundImage: true,
        email: true,
        gender: true,
        description: true,
        image: true,
        role: true,
        isPrivate: true,
        subdistrictId: true,
        subdistrict: true,
        _count: {
          select: {
            placeReviews: true,
            menuReviews: true,
            ownerPlaces: true,
            followers: true,
            following: true,
          },
        },
      },
    });
    return result;
  }

  async findByEmail(email: string) {
    return await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });
  }
  //create service to change password
  async changePassword({
    oldPassword,
    newPassword,
    userId,
  }: {
    oldPassword: string;
    newPassword: string;
    userId: string;
  }) {
    //user must provide old password newPassword change password
    const checkOldPassword = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });
    const check = await bcrypt.compare(oldPassword, checkOldPassword.password);
    if (!check) {
      throw new ForbiddenException('Password lama salah');
    }
    return await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        password: await bcrypt.hash(newPassword, 10),
      },
      select: {
        id: true,
        image: true,
        name: true,
        email: true,
      },
    });
  }
}
