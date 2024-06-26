import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UserFollowService {
  constructor(private prismaService: PrismaService) {}

  async follower(userId: string) {
    return await this.prismaService.userFollow.findMany({
      where: {
        followingId: userId,
      },
      include: {
        follower: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            _count: {
              select: {
                followers: true,
                placeReviews: true,
                menuReviews: true,
              },
            },
          },
        },
      },
    });
  }
  async following(userId: string) {
    return await this.prismaService.userFollow.findMany({
      where: {
        followerId: userId,
      },
      include: {
        following: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            _count: {
              select: {
                followers: true,
                placeReviews: true,
                menuReviews: true,
              },
            },
          },
        },
      },
    });
  }

  async checkFollow({
    user,
    currentUser,
  }: {
    user: string;
    currentUser: string;
  }) {
    const result = await this.prismaService.userFollow.findUnique({
      where: {
        followerId_followingId: {
          followerId: currentUser,
          followingId: user,
        },
      },
    });

    return !!result;
  }

  async create(userId: string, currentUserId: string) {
    return await this.prismaService.userFollow.create({
      data: {
        follower: {
          connect: {
            id: currentUserId,
          },
        },
        following: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  async delete(userId: string, currentUserId: string) {
    return await this.prismaService.userFollow.delete({
      where: {
        followerId_followingId: {
          followerId: currentUserId,
          followingId: userId,
        },
      },
    });
  }
}
