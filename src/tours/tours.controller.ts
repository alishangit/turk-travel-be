import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  ParseIntPipe,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ToursService } from './tours.service';
import { CreateTourDto } from './create-tours.dto';
import { AdminGuard } from './admin.guard';
import { AuthGuard } from './auth.guard';
import { imageFileFilter, imageStorage } from './multer.config';
import { MAX_TOUR_IMAGES } from './tour.constants';

@Controller('tours')
export class ToursController {
  constructor(private readonly tourService: ToursService) {}

  @Get()
  getAllTours() {
    return this.tourService.getAllTours();
  }

  @Get(':id')
  getTourById(@Param('id', ParseIntPipe) id: number) {
    return this.tourService.getTourById(id);
  }

  @Post()
  @UseGuards(AuthGuard, AdminGuard)
  @UseInterceptors(
    FilesInterceptor('images', MAX_TOUR_IMAGES, {
      storage: imageStorage,
      fileFilter: imageFileFilter,
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  create(
    @Body() body: CreateTourDto,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    return this.tourService.createTour(
      body,
      files?.map((file) => file.filename) ?? [],
    );
  }

  @Put(':id')
  @UseGuards(AuthGuard, AdminGuard)
  @UseInterceptors(
    FilesInterceptor('images', MAX_TOUR_IMAGES, {
      storage: imageStorage,
      fileFilter: imageFileFilter,
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: CreateTourDto,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    return this.tourService.updateTour(
      id,
      body,
      files?.map((file) => file.filename) ?? [],
    );
  }

  @Delete(':id')
  @UseGuards(AuthGuard, AdminGuard)
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.tourService.deleteTour(id);
  }
}
