import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTourDto } from './create-tours.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Tour } from './tour.entity';
import { TourCategory } from './tour-category.enum';
import { MAX_TOUR_IMAGES } from './tour.constants';
import { Repository } from 'typeorm';
import { unlink } from 'fs/promises';
import { join } from 'path';

const normalizeWhatToBring = (raw?: string): string[] | null => {
  if (raw === undefined) return null;

  const items = raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  return items.length > 0 ? items : null;
};

@Injectable()
export class ToursService {
  constructor(
    @InjectRepository(Tour)
    private tourRepository: Repository<Tour>,
  ) {}

  getAllTours() {
    return this.tourRepository.find();
  }

  async getTourById(id: number) {
    const tour = await this.tourRepository.findOneBy({ id });

    if (!tour) throw new NotFoundException('Tour c id не найден');

    return tour;
  }

  createTour(body: CreateTourDto, imageFilenames: string[] = []) {
    const { name, description, price, location, date, time, category, whatToBring } =
      body;
    const images = this.toImagePaths(imageFilenames);
    const tour = this.tourRepository.create({
      name,
      description,
      price,
      location,
      date,
      time,
      category: category ?? TourCategory.Historical,
      whatToBring: normalizeWhatToBring(whatToBring),
      images,
      image: images[0] ?? '',
    });

    return this.tourRepository.save(tour);
  }

  async updateTour(
    id: number,
    body: CreateTourDto,
    imageFilenames: string[] = [],
  ) {
    const tour = await this.tourRepository.findOneBy({ id });

    if (!tour) throw new NotFoundException('Tour c id не найден');

    const { name, description, price, location, date, time, category, whatToBring } =
      body;
    tour.name = name;
    tour.description = description;
    tour.price = price;
    tour.location = location;
    tour.date = date;
    tour.time = time;

    if (category !== undefined) {
      tour.category = category;
    }

    if (whatToBring !== undefined) {
      tour.whatToBring = normalizeWhatToBring(whatToBring);
    }

    if (body.existingImages !== undefined || imageFilenames.length > 0) {
      const keptImages = this.parseExistingImages(body.existingImages);
      const uploadedImages = this.toImagePaths(imageFilenames);
      const nextImages = [...keptImages, ...uploadedImages].slice(
        0,
        MAX_TOUR_IMAGES,
      );
      const previousImages = this.getTourImages(tour);

      await this.removeUnusedImages(previousImages, nextImages);

      tour.images = nextImages;
      tour.image = nextImages[0] ?? '';
    }

    return this.tourRepository.save(tour);
  }

  async deleteTour(id: number) {
    const tour = await this.tourRepository.findOneBy({ id });

    if (!tour) throw new NotFoundException('Tour c id не найден');

    const images = this.getTourImages(tour);
    await Promise.all(images.map((imagePath) => this.removeImageFile(imagePath)));
    await this.tourRepository.remove(tour);

    return tour;
  }

  private getTourImages(tour: Tour): string[] {
    if (tour.images?.length) return tour.images;
    return tour.image ? [tour.image] : [];
  }

  private toImagePaths(filenames: string[]): string[] {
    return filenames
      .filter(Boolean)
      .slice(0, MAX_TOUR_IMAGES)
      .map((filename) => `/public/tours/${filename}`);
  }

  private parseExistingImages(raw?: string): string[] {
    if (!raw) return [];

    try {
      const parsed: unknown = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];

      return parsed
        .filter((item): item is string => typeof item === 'string')
        .slice(0, MAX_TOUR_IMAGES);
    } catch {
      return [];
    }
  }

  private async removeUnusedImages(
    previousImages: string[],
    nextImages: string[],
  ) {
    const toRemove = previousImages.filter(
      (imagePath) => !nextImages.includes(imagePath),
    );

    await Promise.all(toRemove.map((imagePath) => this.removeImageFile(imagePath)));
  }

  private async removeImageFile(imagePath: string) {
    if (!imagePath) return;

    const filename = imagePath.replace(/^\/public\/tours\//, '');

    try {
      await unlink(join(process.cwd(), 'public', 'tours', filename));
    } catch {
      // файл уже удалён или отсутствует
    }
  }
}
