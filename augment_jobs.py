import json
import random
import re

with open('api/jobsData.js', 'r', encoding='utf-8') as f:
    content = f.read()

companies = ["Google", "Apple", "Amazon", "Netflix", "Meta", "Tesla", "Microsoft", "Stripe", "Airbnb", "Uber", "Lyft", "Spotify", "Snap", "ByteDance", "OpenAI", "Anthropic", "Palantir"]
locations = ["San Francisco, CA", "New York, NY", "Austin, TX", "Seattle, WA", "Remote", "London, UK", "Berlin, Germany", "Toronto, Canada", "Singapore"]
levels = ["Entry Level", "Mid Level", "Senior Level", "Lead", "Principal"]

def replacer(match):
    title = match.group(1)
    
    company = random.choice(companies)
    location = random.choice(locations)
    
    if "Senior" in title:
        level = "Senior Level"
    elif "Lead" in title:
        level = "Lead"
    else:
        level = random.choice(levels)
    
    if "Engineer" in title or "Developer" in title or "Architect" in title:
        salary = f"${random.randint(120, 250)}k - ${random.randint(250, 400)}k"
    elif "Manager" in title:
        salary = f"${random.randint(100, 180)}k - ${random.randint(180, 250)}k"
    elif "Driver" in title or "Handler" in title:
        salary = f"${random.randint(40, 60)}k - ${random.randint(60, 80)}k"
    elif "Designer" in title:
        salary = f"${random.randint(90, 140)}k - ${random.randint(140, 200)}k"
    else:
        salary = f"${random.randint(60, 100)}k - ${random.randint(100, 150)}k"
        
    return f'"title": "{title}",\n    "company": "{company}",\n    "location": "{location}",\n    "level": "{level}",\n    "salary": "{salary}"'

new_content = re.sub(r'"title":\s*"([^"]+)"', replacer, content)

with open('api/jobsData.js', 'w', encoding='utf-8') as f:
    f.write(new_content)
print("Updated jobsData.js successfully!")
