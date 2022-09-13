import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { HLA, OrganType, PatientPriority } from "constants/enums";
import Hospital from "hospitals/hospital.entity";


@Entity()
class OrganRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({enum: OrganType})
  organ: OrganType;

  @Column({enum: HLA})
  hla: HLA;

  @Column({enum: PatientPriority})
  priority: PatientPriority;

  @Column({type: 'timestamptz', default: new Date()})
  date: Date;

  @ManyToOne(() => Hospital, hospital => hospital.organRequests)
  hospital: Hospital;
}

export default OrganRequest;
