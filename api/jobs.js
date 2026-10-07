import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  try {
    const jobsPath = path.join(process.cwd(), 'api', 'vectorized_jobs.json');
    const jobsData = JSON.parse(fs.readFileSync(jobsPath, 'utf-8'));
    res.status(200).json(jobsData);
  } catch (error) {
    console.error("Error reading jobs data:", error);
    res.status(500).json({ error: "Failed to load jobs data" });
  }
}
