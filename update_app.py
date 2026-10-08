import re

with open('src/App.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add userProfile state
content = content.replace("const [userSkillsText, setUserSkillsText] = useState('');\n  const [isDarkMode, setIsDarkMode] = useState(true);", "const [userSkillsText, setUserSkillsText] = useState('');\n  const [userProfile, setUserProfile] = useState(null);\n  const [isDarkMode, setIsDarkMode] = useState(true);")

# Update ProfileInput props
content = content.replace("<ProfileInput onNext={handleStartMatching} isModelReady={isModelReady} />", "<ProfileInput onNext={handleStartMatching} isModelReady={isModelReady} setUserProfile={setUserProfile} />")

# Update handleStartMatching signature and implementation
old_func = """  const handleStartMatching = (userSkills) => {
    if (!isModelReady) {
      alert("Please wait for the AI model to finish loading.");
      return;
    }
    setUserSkillsText(userSkills); 
    setCurrentScreen('processing');
    
    aiWorker.current.postMessage({ 
      type: 'EMBED', 
      text: userSkills 
    });
  };"""

new_func = """  const handleStartMatching = (userSkills, profileData = null) => {
    if (!isModelReady) {
      alert("Please wait for the AI model to finish loading.");
      return;
    }
    setUserSkillsText(userSkills);
    if (profileData) {
       setUserProfile(profileData);
    }
    setCurrentScreen('processing');
    
    aiWorker.current.postMessage({ 
      type: 'EMBED', 
      text: userSkills 
    });
  };"""

content = content.replace(old_func, new_func)

# Add Navigation Tabs
nav_tabs = """
        <div className="flex items-center gap-4 group cursor-pointer">
"""

nav_tabs_new = """
        <div className="flex items-center gap-4 group cursor-pointer">
"""
# actually let's skip nav tabs for now and just replace the above
with open('src/App.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated App.jsx successfully.")

