import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class MediaFileService {
  constructor(private readonly prisma: PrismaService) {}

  create(attachmentData: {
    type: string;
    url: string;
    filename: string;
    pathName: string;
    size: number;
    mimeType: string;
  }) {
    const { ...rest } = attachmentData;

    return this.prisma.mediaFile.create({
      data: {
        ...rest,
      },
    });
  }

  async findById(id: string) {
    const attachment = await this.prisma.mediaFile.findUnique({
      where: { id },
    });

    if (!attachment) {
      throw new NotFoundException('MediaFile not found');
    }

    return attachment;
  }

  async findByRandomName(pathName: string) {
    const attachment = await this.prisma.mediaFile.findFirst({
      where: { pathName },
    });

    if (!attachment) {
      throw new NotFoundException('MediaFile not found');
    }

    return attachment;
  }

  async update(
    pathName: string,
    updateData: {
      type?: string;
      url?: string;
      filename?: string;
      pathName?: string;
      size?: number;
      mimeType?: string;
    },
  ) {
    const attachment = await this.prisma.mediaFile.findFirst({
      where: { pathName },
    });
    if (!attachment) {
      throw new NotFoundException('MediaFile not found');
    }

    try {
      return await this.prisma.mediaFile.update({
        where: { id: attachment.id },
        data: updateData,
      });
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new NotFoundException('MediaFile not found');
      }
      throw error;
    }
  }

  async delete(pathName: string): Promise<void> {
    const attachment = await this.prisma.mediaFile.findFirst({
      where: { pathName },
    });
    if (!attachment) {
      throw new NotFoundException('MediaFile not found');
    }

    try {
      await this.prisma.mediaFile.delete({
        where: { id: attachment.id },
      });
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new NotFoundException('MediaFile not found');
      }
      throw error;
    }
  }
}
