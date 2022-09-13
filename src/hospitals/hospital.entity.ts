import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import OrganRequest from "organ-requests/entities/organ-request.entity";
import Organ from "organs/entities/organ.entity";


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

  @OneToMany(() => Organ, organRequest => organRequest.hospital)
  organRequests: OrganRequest[];
}

export default Hospital;