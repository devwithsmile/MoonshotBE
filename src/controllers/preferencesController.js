import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { validatePreferences } from '../validators/preferencesValidator.js';

export const updatePreferences = async (req, res) => {
  try {
    const { error } = validatePreferences(req.body);
    if (error) {
      console.log('Validation error:', error.details[0].message);
      return res.status(400).json({ error: error.details[0].message });
    }

    console.log('User ID:', req.user._id); // Verify that userId is available

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { preferences: req.body },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user.preferences);
  } catch (error) {
    console.error('Database or server error:', error); // Log detailed error
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

export const createShareableUrl = async (req, res) => {
  try {
    const token = jwt.sign(
      { filters: req.body.filters },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Ensure API_URL is correct and avoid double slashes in URL
    const shareUrl = `${process.env.API_URL.replace(/\/+$/, '')}/shared-view/${token}`;
    res.json({ shareUrl });
  } catch (error) {
    console.error('Error creating shareable URL:', error); // Log error for debugging
    res.status(500).json({ error: 'Server error' });
  }
};