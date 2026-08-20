/**
 * Compares user skills against job requirements to identify missing skills.
 * 
 * @param {string[]} userSkills - Array of skills from the user (e.g., ['React', 'JavaScript'])
 * @param {string[]} jobSkills - Array of skills required for the job (e.g., ['React', 'Node.js', 'AWS'])
 * @returns {Object} An object containing the match percentage, matched skills, and missing skills.
 */
export function analyzeSkillGap(userSkills, jobSkills) {
    // 1. Normalize user skills (lowercase and trim) for accurate matching
    const normalizedUserSkills = new Set(
        userSkills.map(skill => skill.toLowerCase().trim())
    );
    
    const matched = [];
    const missing = [];
    
    // 2. Check each job skill against the user's Set
    jobSkills.forEach(jobSkill => {
        const normalizedJobSkill = jobSkill.toLowerCase().trim();
        
        if (normalizedUserSkills.has(normalizedJobSkill)) {
            matched.push(jobSkill); // Keep original casing for UI display
        } else {
            missing.push(jobSkill);
        }
    });
    
    // 3. Calculate the hard metric
    const matchPercentage = jobSkills.length === 0 ? 0 : Math.round((matched.length / jobSkills.length) * 100);
    
    return {
        matchPercentage,
        matchedSkills: matched,
        missingSkills: missing,
        summary: `You have ${matchPercentage}% of the required skills. To reach 100%, consider learning: ${missing.join(', ')}`
    };
}