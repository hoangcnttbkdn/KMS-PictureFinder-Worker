import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity({ name: 'token' })
export class Token extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'text' })
  type: string

  @Column({ name: 'client_id', type: 'text' })
  clientId: string

  @Column({ name: 'client_secret', type: 'text' })
  clientSecret: string

  @Column({ name: 'refresh_token', type: 'text' })
  refreshToken: string

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date
}
