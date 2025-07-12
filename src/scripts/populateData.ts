import { populateSampleProfiles } from '../utils/populateProfiles';

const runPopulation = async () => {
  try {
    console.log('🌱 Populating sample profiles...');
    await populateSampleProfiles();
    console.log('✅ Sample profiles populated successfully!');
  } catch (error) {
    console.error('❌ Error populating profiles:', error);
  }
};

runPopulation();
