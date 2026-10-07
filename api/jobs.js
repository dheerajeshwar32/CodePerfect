import { jobsData } from './jobsData.js';

export default function handler(req, res) {
  res.status(200).json(jobsData);
}

