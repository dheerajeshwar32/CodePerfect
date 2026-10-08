import json
import random
import copy

with open('api/jobsData.js', 'r', encoding='utf-8') as f:
    content = f.read()

json_str = content[content.find('['):content.rfind(']')+1]
jobs = json.loads(json_str)

companies = ["Google", "Apple", "Amazon", "Netflix", "Meta", "Tesla", "Microsoft", "Stripe", "Airbnb", "Uber", "Lyft", "Spotify", "Snap", "ByteDance", "OpenAI", "Anthropic", "Palantir", "Discord", "Twitch", "Reddit", "LinkedIn", "Salesforce", "Adobe", "Intel", "NVIDIA", "AMD", "Sony", "Samsung", "Bloomberg", "Goldman Sachs", "JPMorgan", "Morgan Stanley"]
locations = ["San Francisco, CA", "New York, NY", "Austin, TX", "Seattle, WA", "Remote", "London, UK", "Berlin, Germany", "Toronto, Canada", "Singapore", "Chicago, IL", "Boston, MA", "Denver, CO", "Los Angeles, CA", "Miami, FL", "Amsterdam, Netherlands"]

general_tech_skills = ["Git", "Docker", "AWS", "Agile", "CI/CD", "Kubernetes", "Linux", "Jira", "GraphQL", "REST APIs", "Microservices"]
general_soft_skills = ["Communication", "Teamwork", "Problem Solving", "Leadership", "Project Management", "Critical Thinking"]

def vary_title(base_title, level):
    title = base_title
    
    # If level is Senior or Lead, prepend it
    if level in ["Senior Level", "Lead", "Principal"]:
        prefix = level.replace(" Level", "")
        # Remove any existing "Senior", etc to avoid "Senior Senior"
        if not title.startswith(prefix):
            title = f"{prefix} {title}"
            
    # Synonym replacements
    if "Engineer" in title and random.random() > 0.5:
        title = title.replace("Engineer", "Developer")
    elif "Developer" in title and random.random() > 0.5:
        title = title.replace("Developer", "Engineer")
        
    if "Frontend" in title and random.random() > 0.5:
        title = title.replace("Frontend", "UI")
    if "Backend Node.js" in title:
        title = random.choice([title, title.replace("Backend Node.js", "Node.js Backend"), title.replace("Backend Node.js", "Server-side Node")])
    
    if "Data Analyst" in title and random.random() > 0.5:
        title = title.replace("Data Analyst", "Data Scientist")
        
    if "Specialist" in title and random.random() > 0.5:
        title = title.replace("Specialist", "Consultant")
        
    # Sometimes append the company specific flavor
    if random.random() > 0.8:
        title = f"{title} II" if level == "Mid Level" else title
        title = f"{title} III" if level == "Senior Level" else title
        
    return title

new_jobs = []

for job in jobs:
    # We will make 12 variations per base job
    for _ in range(12):
        variation = copy.deepcopy(job)
        
        level_choices = ["Entry Level", "Mid Level", "Mid Level", "Senior Level", "Senior Level", "Lead", "Principal"]
        level = random.choice(level_choices)
        
        company = random.choice(companies)
        location = random.choice(locations)
        
        base_title = variation['title']
        variation['title'] = vary_title(base_title, level)
        
        if "Engineer" in base_title or "Developer" in base_title or "Architect" in base_title:
            if level == "Entry Level": salary = f"${random.randint(90, 120)}k - ${random.randint(120, 140)}k"
            elif level == "Mid Level": salary = f"${random.randint(130, 160)}k - ${random.randint(160, 200)}k"
            elif level == "Senior Level": salary = f"${random.randint(180, 220)}k - ${random.randint(220, 280)}k"
            else: salary = f"${random.randint(240, 300)}k - ${random.randint(300, 450)}k"
        elif "Manager" in base_title:
            salary = f"${random.randint(120, 160)}k - ${random.randint(160, 250)}k"
        elif "Driver" in base_title or "Handler" in base_title:
            salary = f"${random.randint(40, 50)}k - ${random.randint(50, 75)}k"
        elif "Designer" in base_title:
            if level == "Entry Level": salary = f"${random.randint(70, 90)}k - ${random.randint(90, 120)}k"
            else: salary = f"${random.randint(110, 150)}k - ${random.randint(150, 210)}k"
        else:
            salary = f"${random.randint(60, 90)}k - ${random.randint(90, 140)}k"
            
        variation['company'] = company
        variation['location'] = location
        variation['level'] = level
        variation['salary'] = salary
        
        # Vary skills
        skills = variation['skills']
        # Shuffle existing skills
        random.shuffle(skills)
        # Drop 1 randomly sometimes
        if len(skills) > 4 and random.random() > 0.5:
            skills = skills[:-1]
            
        # Add 1-2 random related skills
        pool = general_tech_skills if ("Engineer" in base_title or "Developer" in base_title or "Architect" in base_title) else general_soft_skills
        extra = random.sample(pool, random.randint(1, 2))
        for s in extra:
            if s not in skills:
                skills.append(s)
                
        random.shuffle(skills)
        variation['skills'] = skills
        
        # Add random noise to embedding
        variation['embedding'] = [e + random.uniform(-0.003, 0.003) for e in variation['embedding']]
        
        new_jobs.append(variation)

random.shuffle(new_jobs)

with open('api/jobsData.js', 'w', encoding='utf-8') as f:
    f.write(f"export const jobsData = {json.dumps(new_jobs, indent=2)};\n")
print(f"Expanded database to {len(new_jobs)} ultra-realistic jobs!")
