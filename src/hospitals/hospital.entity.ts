import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
class Hospital {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  login: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column()
  city: string;
}

export default Hospital;