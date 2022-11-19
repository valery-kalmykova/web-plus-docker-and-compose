import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsNumber, IsDate } from 'class-validator';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn()
  @IsNumber()
  id: number;

  @Column()
  @CreateDateColumn()
  @IsDate()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  @IsDate()
  updatedAt: Date;
}
