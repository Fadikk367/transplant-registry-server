export enum OrganType {
  Kidney = 'KIDNEY',
  Lung = 'LUNG',
  Heart = 'HEART',
  Liver = 'LIVER',
}

export enum HLA {
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D',
}

export enum PatientPriority {
  Critical = 3,
  Normal = 2,
  Low = 1,
}

export enum OrganMatchStatus {
  Accepted = 'ACCEPTED',
  Pending = 'PENDING',
  Rejected = 'REJECTED',
}

export enum OrganStatus {
  Available = 'AVAILABLE',
  Matched = 'MATCHED',
  Taken = 'TAKEN',
}

export enum OrganRequestStatus {
  Fulfilled = 'FULFILLED',
  Matched = 'MATCHED',
  Waiting = 'WAITING',
}