import mongoose from 'mongoose';

const hatcherySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  caaNumber: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

const Hatchery = mongoose.model('Hatchery', hatcherySchema);
export default Hatchery;