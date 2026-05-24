import { IsIn, IsOptional, IsString, MinLength } from 'class-validator';
import { TOUR_CATEGORIES, TourCategory } from './tour-category.enum';

export class CreateTourDto {
  @IsString({ message: 'Поле имя должно быть строкой' })
  @MinLength(3, { message: 'Поле имя должно быть от 3 символов' })
  name: string;

  @IsString({ message: 'Поле описание должно быть строкой' })
  @MinLength(5, { message: 'Поле описание должно быть от 5 символов' })
  description: string;

  @IsString({ message: 'Поле цена должно быть строкой' })
  @MinLength(1, { message: 'Поле цена не должно быть пустым' })
  price: string;

  @IsString({ message: 'Поле локация должно быть строкой' })
  @MinLength(2, { message: 'Поле локация должно быть от 2 символов' })
  location: string;

  @IsString({ message: 'Поле дата должно быть строкой' })
  @MinLength(1, { message: 'Поле дата не должно быть пустым' })
  date: string;

  @IsString({ message: 'Пolе время должно быть строкой' })
  @MinLength(1, { message: 'Поле время не должно быть пустым' })
  time: string;

  @IsOptional()
  @IsIn(TOUR_CATEGORIES, { message: 'Некорректная категория тура' })
  category?: TourCategory;

  @IsOptional()
  @IsString()
  existingImages?: string;

  @IsOptional()
  @IsString()
  whatToBring?: string;
}
