import dotenv from 'dotenv';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import { AnalyticsData } from '../models/AnalyticsData.js';
import { google } from 'googleapis';

// Get __filename and __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from the .env file located outside of src
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

console.log('MongoDB URI:', process.env.MONGODB_URI);

async function getSheetData() {
  const auth = new google.auth.GoogleAuth({
    keyFile: path.resolve(__dirname, '../../credentials.json'),
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });

  const client = await auth.getClient();
  google.options({ auth: client });

  const sheets = google.sheets({ version: 'v4', auth: client });

  const spreadsheetId = '1l7GstWHc69HPV0irSdvoMIyHgtufUPKsbtCiNw7IKR0';
  const range = 'Sheet3!A:F';

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  });

  return response.data.values;
}

async function importData() {
  try {
    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI is not defined in .env file');
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGODB_URI);

    const rows = await getSheetData();

    const headers = rows[0];

    for (let i = 1; i < rows.length; i++) {
      const record = rows[i];
      const [day, month, year] = record[0].split('/');
      const dateObj = new Date(`${year}-${month}-${day}`);
      const userAge = record[1];
      const gender = record[2].toLowerCase();
      
      const features = ['A', 'B', 'C', 'D', 'E', 'F'];
      const promises = [];
    
      features.forEach((feature, index) => {
        const timeSpent = parseInt(record[3 + index]) || 0;
    
        if (timeSpent > 0) {
          const analyticsData = new AnalyticsData({
            day: dateObj, // Use dateObj here
            userAge,
            gender,
            feature,
            timeSpent,
          });
          console.log(analyticsData);
    
          promises.push(analyticsData.save());
        }
      });
    
      // Await saving all records in parallel for the current row
      await Promise.all(promises);
    }

    console.log('Data import completed');
  } catch (error) {
    console.error('Import error:', error);
    process.exit(1);
  } finally {
    mongoose.disconnect();
  }
}

importData();