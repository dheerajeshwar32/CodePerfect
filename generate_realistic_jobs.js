import { pipeline } from '@huggingface/transformers';
import fs from 'fs';

const rawJobs = [
  // AI & ML
  { title: "Principal AI Architect", company: "OpenAI", location: "San Francisco, CA", level: "Principal", salary: "$350k - $600k", skills: ["PyTorch", "LLMs", "Transformers", "Distributed Training", "CUDA", "Python"] },
  { title: "Senior Machine Learning Engineer", company: "Anthropic", location: "Remote", level: "Senior Level", salary: "$250k - $400k", skills: ["Python", "TensorFlow", "NLP", "Reinforcement Learning", "GCP", "Docker"] },
  { title: "AI Research Scientist", company: "Google DeepMind", location: "London, UK", level: "Mid Level", salary: "$200k - $350k", skills: ["Mathematics", "Deep Learning", "PyTorch", "C++", "Research", "Algorithms"] },
  { title: "Machine Learning Infrastructure Engineer", company: "Meta", location: "Menlo Park, CA", level: "Mid Level", salary: "$220k - $350k", skills: ["Kubernetes", "C++", "Python", "GPU Optimization", "Distributed Systems", "Go"] },
  
  // Software Engineering - Backend & Distributed Systems
  { title: "Senior Distributed Systems Engineer", company: "Stripe", location: "Seattle, WA", level: "Senior Level", salary: "$250k - $450k", skills: ["Go", "Java", "Distributed Systems", "Kafka", "Cassandra", "AWS"] },
  { title: "Backend Software Engineer", company: "Netflix", location: "Los Gatos, CA", level: "Mid Level", salary: "$200k - $350k", skills: ["Java", "Spring Boot", "Microservices", "gRPC", "AWS", "NoSQL"] },
  { title: "Staff Software Engineer, Core Systems", company: "Uber", location: "San Francisco, CA", level: "Lead", salary: "$300k - $500k", skills: ["Go", "C++", "PostgreSQL", "Redis", "High Availability", "Architecture"] },
  { title: "Software Engineer, Infrastructure", company: "Airbnb", location: "Remote", level: "Mid Level", salary: "$180k - $280k", skills: ["Ruby", "AWS", "Terraform", "Kubernetes", "MySQL", "CI/CD"] },
  
  // Software Engineering - Frontend & Full Stack
  { title: "Senior Frontend Engineer", company: "Apple", location: "Cupertino, CA", level: "Senior Level", salary: "$220k - $380k", skills: ["React", "TypeScript", "Performance Tuning", "WebGL", "CSS", "UI/UX"] },
  { title: "Full Stack Developer", company: "Vercel", location: "Remote", level: "Mid Level", salary: "$150k - $250k", skills: ["Next.js", "React", "TypeScript", "Node.js", "Serverless", "Tailwind CSS"] },
  { title: "Lead Web Developer", company: "Figma", location: "San Francisco, CA", level: "Lead", salary: "$250k - $400k", skills: ["TypeScript", "React", "WebAssembly", "C++", "Canvas API", "Graphics"] },
  { title: "Frontend Infrastructure Engineer", company: "Discord", location: "San Francisco, CA", level: "Mid Level", salary: "$180k - $300k", skills: ["React", "Redux", "WebSockets", "Rust", "Performance", "Webpack"] },
  
  // Data Science & Engineering
  { title: "Senior Data Scientist", company: "Spotify", location: "New York, NY", level: "Senior Level", salary: "$200k - $320k", skills: ["Python", "SQL", "A/B Testing", "Machine Learning", "Spark", "Data Visualization"] },
  { title: "Data Engineering Manager", company: "Airbnb", location: "Remote", level: "Lead", salary: "$250k - $380k", skills: ["Leadership", "Data Pipelines", "Airflow", "Snowflake", "Python", "Team Building"] },
  { title: "Staff Data Engineer", company: "Databricks", location: "San Francisco, CA", level: "Lead", salary: "$280k - $450k", skills: ["Scala", "Spark", "Kafka", "Cloud Architecture", "Python", "SQL"] },
  { title: "Analytics Engineer", company: "Notion", location: "New York, NY", level: "Mid Level", salary: "$150k - $220k", skills: ["dbt", "SQL", "Snowflake", "Python", "Data Modeling", "Fivetran"] },
  
  // Cloud, DevOps & Security
  { title: "Senior Site Reliability Engineer (SRE)", company: "Google", location: "Mountain View, CA", level: "Senior Level", salary: "$250k - $400k", skills: ["Go", "Python", "Kubernetes", "Linux", "System Design", "Incident Response"] },
  { title: "Cloud Security Architect", company: "AWS", location: "Seattle, WA", level: "Principal", salary: "$300k - $500k", skills: ["AWS IAM", "Cryptography", "Network Security", "Compliance", "Python", "Threat Modeling"] },
  { title: "DevOps Engineer", company: "Lyft", location: "Remote", level: "Mid Level", salary: "$160k - $240k", skills: ["Terraform", "AWS", "CI/CD", "Docker", "Jenkins", "Bash"] },
  { title: "Platform Engineer", company: "Plaid", location: "San Francisco, CA", level: "Mid Level", salary: "$180k - $280k", skills: ["Kubernetes", "Go", "AWS", "Prometheus", "Grafana", "Service Mesh"] },
  
  // Product & Design
  { title: "Senior Product Manager, AI/ML", company: "Microsoft", location: "Seattle, WA", level: "Senior Level", salary: "$200k - $350k", skills: ["Product Strategy", "AI", "Agile", "Data Analysis", "Cross-functional Leadership", "User Research"] },
  { title: "Staff Product Designer", company: "Stripe", location: "Remote", level: "Lead", salary: "$220k - $380k", skills: ["UI/UX", "Figma", "Interaction Design", "Prototyping", "Design Systems", "User Testing"] },
  { title: "UX Researcher", company: "Apple", location: "Cupertino, CA", level: "Mid Level", salary: "$150k - $250k", skills: ["User Research", "Usability Testing", "Interviews", "Data Analysis", "HCI", "Qualitative Research"] },
  { title: "Director of Product Management", company: "Coinbase", location: "New York, NY", level: "Principal", salary: "$350k - $600k", skills: ["Leadership", "Product Strategy", "Crypto", "Go-to-Market", "Roadmapping", "Management"] }
];

// Add 100 more permutations dynamically to make it massive
const titles = ["Software Engineer", "Data Scientist", "Machine Learning Engineer", "Frontend Engineer", "Backend Engineer", "DevOps Engineer", "Product Manager", "SRE", "Cloud Architect"];
const companiesList = ["Google", "Apple", "Amazon", "Netflix", "Meta", "Tesla", "Microsoft", "Stripe", "Airbnb", "Uber", "Lyft", "Spotify", "Snap", "ByteDance", "OpenAI", "Anthropic", "Palantir"];
const locationsList = ["San Francisco, CA", "New York, NY", "Austin, TX", "Seattle, WA", "Remote", "London, UK", "Berlin, Germany", "Toronto, Canada", "Singapore"];
const levelsList = ["Entry Level", "Mid Level", "Senior Level", "Lead", "Principal"];

for (let i = 0; i < 150; i++) {
  const baseTitle = titles[Math.floor(Math.random() * titles.length)];
  const level = levelsList[Math.floor(Math.random() * levelsList.length)];
  let title = baseTitle;
  let salary = "$150k - $250k";
  if (level === "Senior Level") { title = "Senior " + baseTitle; salary = "$220k - $380k"; }
  if (level === "Lead") { title = "Lead " + baseTitle; salary = "$280k - $450k"; }
  if (level === "Principal") { title = "Principal " + baseTitle; salary = "$350k - $600k"; }
  if (level === "Entry Level") { salary = "$100k - $160k"; }
  
  let skills = [];
  if (baseTitle.includes("Software") || baseTitle.includes("Backend")) skills = ["Java", "Python", "Go", "Distributed Systems", "AWS", "SQL"];
  if (baseTitle.includes("Frontend")) skills = ["React", "TypeScript", "JavaScript", "CSS", "HTML", "UI/UX"];
  if (baseTitle.includes("Data")) skills = ["Python", "SQL", "Machine Learning", "Spark", "Airflow", "Tableau"];
  if (baseTitle.includes("Machine Learning")) skills = ["Python", "PyTorch", "TensorFlow", "CUDA", "NLP", "C++"];
  if (baseTitle.includes("DevOps") || baseTitle.includes("SRE")) skills = ["Kubernetes", "AWS", "Terraform", "CI/CD", "Linux", "Go"];
  if (baseTitle.includes("Product")) skills = ["Agile", "Strategy", "Data Analysis", "Leadership", "Jira", "User Research"];
  if (baseTitle.includes("Architect")) skills = ["System Design", "Cloud", "AWS", "Microservices", "Architecture", "Security"];

  rawJobs.push({
    title,
    company: companiesList[Math.floor(Math.random() * companiesList.length)],
    location: locationsList[Math.floor(Math.random() * locationsList.length)],
    level,
    salary,
    skills
  });
}

async function run() {
  console.log("Loading model...");
  const extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  
  console.log(`Generating embeddings for ${rawJobs.length} jobs...`);
  const finalJobs = [];
  
  for (let i = 0; i < rawJobs.length; i++) {
    const job = rawJobs[i];
    const text = job.skills.join(', ');
    const output = await extractor(text, { pooling: 'mean', normalize: true });
    job.embedding = Array.from(output.data);
    finalJobs.push(job);
    if (i % 20 === 0) console.log(`Processed ${i} / ${rawJobs.length}`);
  }
  
  fs.writeFileSync('api/jobsData.js', `export const jobsData = ${JSON.stringify(finalJobs, null, 2)};\n`);
  console.log("Done! Written to api/jobsData.js");
}

run();

