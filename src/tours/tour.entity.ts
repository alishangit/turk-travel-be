import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { TourCategory } from './tour-category.enum';

@Entity()
export class Tour {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ default: '' })
  price: string;

  @Column({ default: '' })
  location: string;

  @Column({ default: '' })
  date: string;

  @Column({ default: '' })
  time: string;

  @Column({ default: '' })
  image: string;

  @Column({ type: 'text', array: true, default: [] })
  images: string[];

  @Column({
    type: 'varchar',
    default: TourCategory.Historical,
  })
  category: TourCategory;

  @Column({ type: 'text', array: true, nullable: true })
  whatToBring: string[] | null;
}
