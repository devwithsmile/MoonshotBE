import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema({
  day: { type: Date, required: true },
  feature: {
    type: String,
    required: true,
    enum: ['A', 'B', 'C', 'D', 'E', 'F'], // define each feature
    index: true
  },
  userAge: {
    type: String,
    enum: ['15-25', '>25'], // age ranges as given
    required: true,
    index: true
  },
  gender: {
    type: String,
    enum: ['male', 'female'],
    required: true,
    index: true
  },
  timeSpent: {
    type: Number,
    required: true,
    min: 0
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function (doc, ret) {
      delete ret.__v;
      return ret;
    }
  }
});

// Compound indexes for efficient queries
analyticsSchema.index({ userId: 1, feature: 1, createdAt: 1 });
analyticsSchema.index({ feature: 1, userAge: 1, gender: 1 });

// Static method for aggregated statistics by feature
analyticsSchema.statics.getFeatureStats = async function (query) {
  return this.aggregate([
    { $match: query },
    {
      $group: {
        _id: '$feature',
        totalUsage: { $sum: 1 },
        totalTimeSpent: { $sum: '$timeSpent' }, // total time spent on each feature
        avgTimeSpent: { $avg: '$timeSpent' },
        minTimeSpent: { $min: '$timeSpent' },
        maxTimeSpent: { $max: '$timeSpent' }
      }
    },
    { $sort: { totalTimeSpent: -1 } } // sorts by total time spent
  ]);
};

export const AnalyticsData = mongoose.model('AnalyticsData', analyticsSchema);