import mongoose from 'mongoose';

const issueSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      enum: ['Roads', 'Water', 'Electricity', 'Sanitation', 'Other'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    severity: {
      type: Number,
      required: [true, 'Please add a severity level'],
      min: 1,
      max: 5,
    },
    status: {
      type: String,
      enum: ['open', 'in progress', 'resolved'],
      default: 'open',
    },
    location: {
      lat: {
        type: Number,
        required: true,
      },
      lng: {
        type: Number,
        required: true,
      },
    },
    zone: {
      type: String,
      required: [true, 'Please select a zone'],
      enum: ['North Zone', 'South Zone', 'East Zone', 'West Zone'],
    },
    reporterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    image: {
      type: String, // Base64 string or URL
    },
  },
  {
    timestamps: true,
  }
);

const Issue = mongoose.model('Issue', issueSchema);
export default Issue;
