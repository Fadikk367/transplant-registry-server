import { HLA, OrganStatus, OrganType } from "constants/enums";
import Hospital from "hospitals/hospital.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
class Organ {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({enum: OrganType})
  type: OrganType;

  @Column({enum: HLA})
  hla: HLA;

  @Column({type: 'timestamptz', default: new Date()})
  donationDate: Date;

  @Column({enum: OrganStatus, default: OrganStatus.Available})
  status: OrganStatus;

  @ManyToOne(() => Hospital, hospital => hospital.organs)
  hospital: Hospital;
}

export default Organ;
