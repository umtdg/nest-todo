import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('jwt_blacklist')
export class TokenBlacklistEntity {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column({ unique: true })
  token!: string;

  @Column({ type: 'timestamp' })
  expiresAt!: Date;
}
