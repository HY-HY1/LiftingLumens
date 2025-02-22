import mongoose, { Document, Schema } from 'mongoose';

// Define a schema for the Customer
const CustomerSchema: Schema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    createdAt: { type: Date, default: Date.now },
});

// Create the Customer model
const Customer = mongoose.models.Customer || mongoose.model<ICustomer>('Customer', CustomerSchema);

export default Customer;
