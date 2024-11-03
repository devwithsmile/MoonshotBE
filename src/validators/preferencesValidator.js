import Joi from 'joi';

const preferenceSchema = Joi.object({
  filters: Joi.object({
    ageGroup: Joi.string(),
    gender: Joi.string().valid('male', 'female'),
    dateRange: Joi.object({
      start: Joi.date(),
      end: Joi.date()
    })
  })
});

export const validatePreferences = (preferences) => preferenceSchema.validate(preferences);