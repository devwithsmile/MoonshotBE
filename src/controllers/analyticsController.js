import { AnalyticsData } from '../models/AnalyticsData.js';

export const getStats = async (req, res) => {
  try {
    const { ageGroup, gender, startDate, endDate } = req.query;

    let query = {};

    // Adjust age filtering logic based on `userAge` string format
    if (ageGroup) {
      const [minAge, maxAge] = ageGroup.split('-').map(Number);
      if (minAge && maxAge) {
        query.userAge = { $in: [`${minAge}-${maxAge}`, `>${minAge}`, `>${maxAge}`] };
      } else if (minAge) {
        query.userAge = { $regex: `>${minAge}` };
      }
    }

    if (gender) {
      query.gender = gender.toLowerCase();
    }

    // Filter by date if startDate or endDate is provided
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    // Fetch stats with the adjusted query
    const stats = await AnalyticsData.find(query);

    const enrichedStats = stats.map(stat => ({
      ...stat.toObject(),
    }));

    res.json(enrichedStats);
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

export const getTrends = async (req, res) => {
  try {
    const { feature, interval = 'day', userAge, gender } = req.query;

    // Set up grouping intervals based on day, month, or hour
    const groupByInterval = {
      hour: {
        year: { $year: '$day' },
        month: { $month: '$day' },
        day: { $dayOfMonth: '$day' },
        hour: { $hour: '$day' },
      },
      day: {
        year: { $year: '$day' },
        month: { $month: '$day' },
        day: { $dayOfMonth: '$day' },
      },
      month: {
        year: { $year: '$day' },
        month: { $month: '$day' },
      },
    }[interval] || {
      year: { $year: '$day' },
      month: { $month: '$day' },
      day: { $dayOfMonth: '$day' },
    };

    // Base match filter
    const matchFilter = {};
    if (feature) matchFilter.feature = feature;
    if (userAge) matchFilter.userAge = userAge;
    if (gender) matchFilter.gender = gender;

    // Aggregate trends
    const trends = await AnalyticsData.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: {
            feature: '$feature', // Group by feature
            ...groupByInterval, // Group by time interval
          },
          count: { $sum: 1 }, // Count occurrences
          avgDuration: { $avg: '$timeSpent' }, // Average time spent
        },
      },
      { 
        $sort: { 
          '_id.feature': 1, 
          '_id.year': 1, 
          '_id.month': 1, 
          '_id.day': 1, 
          '_id.hour': 1 
        } 
      },
    ]);

    res.json(trends);
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};