import fs from 'fs';
import { pipeline, env } from '@huggingface/transformers';

// 1. Point to the models in the root public folder
env.allowLocalModels = true;
env.allowRemoteModels = false;
env.localModelPath = './public/models/';

async function runPrecomputation() {
    console.log("Loading offline jobs database...");
    
    // 2. Point to the data in the src folder
    const rawData = fs.readFileSync('./src/cleaned_jobs.json', 'utf-8');
    const jobs = JSON.parse(rawData);

    console.log("Waking up the AI model (this might take a few seconds)...");
    const extractor = await pipeline('feature-extraction', 'multilingual-e5-small', { 
        quantized: true 
    });

    console.log(`Calculating math vectors for ${jobs.length} jobs...`);
    
    for (let i = 0; i < jobs.length; i++) {
        const job = jobs[i];
        
        // 3. Removed job.description to match the new dataset format
        const textToEmbed = `${job.title}. Skills: ${job.skills.join(', ')}`;
        
        const output = await extractor(textToEmbed, { pooling: 'mean', normalize: true });
        job.embedding = Array.from(output.data);
        
        console.log(`[${i + 1}/${jobs.length}] Processed: ${job.title}`);
    }

    // 4. Save the finalized file back into the src folder
    fs.writeFileSync('./src/vectorized_jobs.json', JSON.stringify(jobs, null, 2));
    console.log("\nSuccess! Created vectorized_jobs.json.");
}

runPrecomputation();