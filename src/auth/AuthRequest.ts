import { Request } from 'express';

import Hospital from 'hospitals/hospital.entity';

interface AuthRequest extends Request {
  hospital: Hospital;
}
 
export default AuthRequest;
