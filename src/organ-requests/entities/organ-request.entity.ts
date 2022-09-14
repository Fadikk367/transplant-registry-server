import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { HLA, OrganRequestStatus, OrganType, PatientPriority } from "constants/enums";
import Hospital from "hospitals/hospital.entity";


@Entity()
class OrganRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({enum: OrganType})
  organ: OrganType;

  @Column({enum: HLA})
  hla: HLA;

  @Column({enum: PatientPriority, default: PatientPriority.Low})
  priority: PatientPriority;

  @Column({type: 'timestamptz', default: new Date()})
  date: Date;

  @Column({enum: OrganRequestStatus, default: OrganRequestStatus.Waiting})
  status: OrganRequestStatus;

  @ManyToOne(() => Hospital, hospital => hospital.organRequests)
  hospital: Hospital;
}

export default OrganRequest;
