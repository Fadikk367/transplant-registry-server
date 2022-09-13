import { HLA, OrganType } from "constants/enums";
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

  @ManyToOne(() => Hospital, hospital => hospital.organs)
  hospital: Hospital;
}

export default Organ;
