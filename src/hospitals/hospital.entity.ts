import Organ from "organs/entities/organ.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

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

  @OneToMany(() => Organ, organ => organ.hospital)
  organs: Organ[];
}

export default Hospital;