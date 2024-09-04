import { Injectable } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class NoteService {
  constructor(private readonly prisma: PrismaService) {}
  create(createNoteDto: CreateNoteDto) {
    // Get today's date
    return 'rt';
  }
  findAll() {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 40);

    return this.prisma.fileName.findMany({
      where: {
        createdAt: {
          gte: startDate,
        },
      },
      select: {
        name: true,
        createdAt: true,
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} note`;
  }

  update(id: number, updateNoteDto: UpdateNoteDto) {
    return `This action updates a #${id} note`;
  }

  remove(id: number) {
    return `This action removes a #${id} note`;
  }
}
