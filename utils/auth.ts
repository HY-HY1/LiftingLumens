import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Customer from '@/lib/models/Customer';
import { ICustomer } from '@/types/schema/ICustomer';

//Hashing
export async function hashPassword(password: string) {
  return await bcrypt.hash(password, 12);
}

//Compare
export async function comparePassword(password: string, hashedPassword: string) {
  return await bcrypt.compare(password, hashedPassword);
}

//JWT
export async function generateToken(customer: ICustomer) {
  return jwt.sign({ id: customer._id }, process.env.JWT_SECRET || '', {
    expiresIn: '1d',
  });
}