import fetch from 'node-fetch';

async function testResumeFetch() {
  try {
    // 1. Create a session by logging in
    const loginRes = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'shillshady96', password: 'Kidcudi690!+=' }),
      credentials: 'include'
    });
    
    if (!loginRes.ok) {
      console.error(`Login failed with status: ${loginRes.status}`);
      return;
    }
    
    const userData = await loginRes.json();
    console.log("Login successful:", userData);
    
    // Store the cookies for subsequent requests
    const cookies = loginRes.headers.get('set-cookie');
    
    // 2. Fetch the user's resumes
    const resumesRes = await fetch('http://localhost:5000/api/resumes', {
      headers: { 'Cookie': cookies }
    });
    
    if (!resumesRes.ok) {
      console.error(`Fetch resumes failed with status: ${resumesRes.status}`);
      return;
    }
    
    const resumes = await resumesRes.json();
    console.log("User resumes:", resumes);
    
    // 3. Fetch a specific resume
    if (resumes.length > 0) {
      const resumeId = resumes[0].id;
      const resumeRes = await fetch(`http://localhost:5000/api/resumes/${resumeId}`, {
        headers: { 'Cookie': cookies }
      });
      
      if (!resumeRes.ok) {
        console.error(`Fetch resume ${resumeId} failed with status: ${resumeRes.status}`);
        return;
      }
      
      const resumeData = await resumeRes.json();
      console.log(`Resume ${resumeId} data:`, JSON.stringify(resumeData, null, 2));
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

testResumeFetch();
