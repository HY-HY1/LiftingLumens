import { IAddress } from '@/types/schema/IAddress';
import mongoose, { Schema } from 'mongoose';

// Define the Mongoose schema for the Address model
const addressSchema: Schema = new mongoose.Schema({
    email: { type: String, required: true },
    postcode: { type: String, required: true },
    city: { type: String, required: true },
    street: { type: String, required: true }  // Keep "street" here
});

// Create and export the Address model
const Address = mongoose.models.Address || mongoose.model<IAddress>('Address', addressSchema);

export default Address;
