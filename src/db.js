import Dexie from 'dexie';

// 1. Create the offline database
export const db = new Dexie('HackathonJobsDB');

// 2. Build the tables
db.version(1).stores({
  jobs: '++id, title, skills'
});

// 3. Create the function to load your JSON data
export async function populateDatabase(jobsJson) {
    const count = await db.jobs.count();
    if (count === 0) {
        console.log("Database empty. Loading jobs...");
        await db.jobs.bulkAdd(jobsJson);
        console.log("Offline database is ready!");
    }
}