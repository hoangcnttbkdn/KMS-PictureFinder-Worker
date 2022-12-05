import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm'
import { Image } from '.'
import { SessionTypeEnum } from '../../shared/constants'

@Entity({ name: 'sessions' })
export class Session extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'text' })
  url: string

  @Column({ name: 'target_image_url', type: 'text' })
  targetImageUrl: string

  @Column({ type: 'text', nullable: true })
  email: string

  @Column({ name: 'total_images' })
  totalImages: number

  @Column({ type: 'enum', enum: SessionTypeEnum })
  type: SessionTypeEnum

  @Column({ name: 'is_finished' })
  isFinished: boolean

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date

  @OneToMany(() => Image, (image) => image.session)
  images: Image[]
}
