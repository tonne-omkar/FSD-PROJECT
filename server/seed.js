import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Drive from './models/Drive.js';
import { INITIAL_DRIVES } from '../src/mock/mockData.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    console.log('Connecting to MongoDB for seeding...');
    await connectDB();

    console.log(`Found ${INITIAL_DRIVES.length} mock drives to seed.`);
    let createdCount = 0;
    let skippedCount = 0;

    for (const mockDrive of INITIAL_DRIVES) {
      const driveTitle = mockDrive.title || mockDrive.role || 'Software Engineer';
      const driveCompany = mockDrive.company;

      const existingDrive = await Drive.findOne({
        title: driveTitle,
        company: driveCompany,
      });

      if (existingDrive) {
        console.log(`[SKIP] Drive already exists: "${driveTitle}" at "${driveCompany}"`);
        skippedCount++;
        continue;
      }

      const { id, badgeColor, aiInsights, requirements, postedDate, applicantsCount, shortlistedCount, placedCount, ...rest } = mockDrive;

      const newDrive = new Drive({
        title: driveTitle,
        ...rest,
        postedBy: undefined,
      });

      await newDrive.save();
      console.log(`[CREATED] Seeded drive: "${driveTitle}" at "${driveCompany}" (_id: ${newDrive._id})`);
      createdCount++;
    }

    console.log('\n--- SEEDING SUMMARY ---');
    console.log(`Total mock drives processed: ${INITIAL_DRIVES.length}`);
    console.log(`Successfully created: ${createdCount}`);
    console.log(`Skipped (duplicates): ${skippedCount}`);

    process.exit(0);
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
};

seedDatabase();
