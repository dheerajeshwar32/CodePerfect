const fs = require('fs');

function cleanData() {
    // Read the mock CSV file
    const rawData = fs.readFileSync('raw_jobs_data.csv', 'utf-8');
    const lines = rawData.trim().split('\n');
    
    const cleaned = [];
    
    // Skip the header row (index 0) and process the rest
    for (let i = 1; i < lines.length; i++) {
        const row = lines[i].split(',');
        
        if (row.length >= 3) {
            cleaned.push({
                title: row[0].trim(),
                description: row[1].trim(),
                // Split the skills by the pipe '|' character
                skills: row[2].split('|').map(skill => skill.trim()).filter(Boolean)
            });
        }
    }
    
    // Write the formatted data to a JSON file
    fs.writeFileSync('cleaned_jobs.json', JSON.stringify(cleaned, null, 2));
    console.log("Success! Created cleaned_jobs.json via Node.js");
}

cleanData();