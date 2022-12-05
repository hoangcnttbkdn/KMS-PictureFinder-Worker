import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { Session } from '.'

@Entity({ name: 'images' })
export class Image extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  code: string

  @Column()
  url: string

  @Column({ name: 'is_matched' })
  isMatched: boolean

  @Column({ type: 'timestamp', name: 'recognized_at', nullable: true })
  recognizedAt: Date

  @Column({ type: 'text', name: 'extra_data', nullable: true })
  extraData: string

  @Column({ type: 'text', name: 'error_logs', nullable: true })
  errorLogs: string

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date

  @ManyToOne(() => Session, (session) => session.images, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'session_id' })
  session: Session
}
