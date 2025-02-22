import { Schema, model, models } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const orderSchema = new Schema<IOrder>({
    email: { type: String, required: true },
    clientSecret: { type: String, required: true },
    uuid: { type: String, default: uuidv4, unique: true }
});

const Order = models.Order || model<IOrder>('Order', orderSchema);

export default Order;
