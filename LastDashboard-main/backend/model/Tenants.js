import mongoose from 'mongoose';

const tenantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  address: {
    type: String,
    trim: true,
  },
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true,
  },
  lease: {
    startDate: { type: Date, required: false },
    endDate: { type: Date, required: false },
    terms: { type: String, trim: true },
  },
  leaseStatus: {
    type: String,
    enum: ['Active', 'Declined', 'Ended'],
    default: 'Active',
  },
  paymentStatus: {
    type: String,
    enum: ['Paid', 'Due', 'Overdue'],
    default: 'Due',
  },
  declined: { type: Boolean, default: false } ,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware to set endDate if lease is declined
tenantSchema.pre('save', function (next) {
  if (this.leaseStatus === 'Declined') {
    this.lease.endDate = new Date();
  }
  next();
});

const Tenant = mongoose.model('Tenant', tenantSchema);
export default Tenant;
