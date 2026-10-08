import re

with open('src/components/ProfileInput.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace handleFileUpload
old_handle_file = """  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadedFileName(file.name);
    setIsExtracting(true);
    setSkills('');

    try {
      const text = await extractTextFromPDF(file);
      if (text.trim().length < 50) {
        throw new Error("No readable text found in this PDF (might be a scanned image).");
      }
      setSkills(text); 
    } catch (error) {
      alert("Could not read enough text from the PDF. Please try copying and pasting your skills manually.");
      setUploadedFileName(''); 
    }
    setIsExtracting(false);
  };"""

new_handle_file = """  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadedFileName(file.name);
    setIsExtracting(true);
    setSkills('');

    try {
      // 1. Extract raw text via browser PDF.js
      const text = await extractTextFromPDF(file);
      if (text.trim().length < 50) {
        throw new Error("No readable text found in this PDF (might be a scanned image).");
      }
      
      // 2. Pass raw text to Vercel Gemini Parser
      const res = await fetch('/api/parse-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText: text })
      });
      
      if (!res.ok) {
         // Fallback to raw text matching if backend limits hit
         setSkills(text);
         setIsExtracting(false);
         return;
      }
      
      const parsedData = await res.json();
      
      // parsedData has { skills: [], experienceYears: num, summary: str }
      if (parsedData.skills && parsedData.skills.length > 0) {
         setSkills(parsedData.skills.join(', '));
      } else {
         setSkills(text); // Fallback
      }
      
      // Wait for user to click "Analyze My Profile" but we can store this profile info 
      // by passing it to onNext when clicked. For now we just keep it in a state.
      // Wait, we need to pass it to App.jsx. Let's add local state.
      setParsedProfile(parsedData);
      
    } catch (error) {
      console.error(error);
      alert("Could not read or parse the PDF perfectly. Please paste your skills manually.");
      setUploadedFileName(''); 
    }
    setIsExtracting(false);
  };"""

content = content.replace(old_handle_file, new_handle_file)

# Add parsedProfile state
content = content.replace("  const [uploadedFileName, setUploadedFileName] = useState('');", "  const [uploadedFileName, setUploadedFileName] = useState('');\n  const [parsedProfile, setParsedProfile] = useState(null);")

# Update onNext call
content = content.replace("onClick={() => onNext(skills)}", "onClick={() => onNext(skills, parsedProfile)}")

with open('src/components/ProfileInput.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated ProfileInput.jsx")

