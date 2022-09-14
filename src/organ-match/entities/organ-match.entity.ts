import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

import OrganRequest from "organ-requests/entities/organ-request.entity";
import Organ from "organs/entities/organ.entity";
import { OrganMatchStatus } from "constants/enums";


@Entity()
class OrganMatch {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({type: 'timestamptz', default: new Date()})
  donationDate: Date;

  @Column({
    enum: OrganMatchStatus,
    default: OrganMatchStatus.Pending
  })
  status: OrganMatchStatus;

  @OneToOne(() => Organ)
  @JoinColumn()
  organ: Organ;

  @OneToOne(() => OrganRequest)
  @JoinColumn()
  request: OrganRequest;
}

export default OrganMatch;
