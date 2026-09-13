/**
 * AI Placement & Career Assistant Service (PulseAI)
 * 
 * NOTE FOR PHASE 2 API INTEGRATION:
 * When your backend API or LLM endpoint (FastAPI / Express / OpenAI / Gemini)
 * is ready, simply replace `generateMockAiResponse` with a call to:
 * 
 * export async function sendChatMessageToApi({ message, role, profile, drives }) {
 *   const res = await fetch('/api/chat', {
 *     method: 'POST',
 *     headers: { 'Content-Type': 'application/json' },
 *     body: JSON.stringify({ message, role, profile, drives }),
 *   });
 *   return await res.json();
 * }
 */

export async function generateAiResponse({ message, role, profile, drives = [], tpoStats = {} }) {
  // Simulate natural AI thinking delay (600ms)
  await new Promise((resolve) => setTimeout(resolve, 600));

  const lower = message.toLowerCase().trim();
  const studentSkills = profile?.skills || ['React', 'JavaScript', 'Node.js', 'Python', 'SQL'];
  const studentCgpa = profile?.cgpa || 8.8;
  const studentBranch = profile?.branch || 'CSE';

  // 1. Resume Analysis Request
  if (
    lower.includes('resume') ||
    lower.includes('analyze') ||
    lower.includes('cv') ||
    lower.includes('profile review')
  ) {
    return {
      text: `### 📄 Comprehensive Resume & Profile Audit for ${profile?.name || 'Student'}

**Current Profile Stats:**
• **Branch & CGPA:** ${studentBranch} | ${studentCgpa} / 10.0 (High academic eligibility)
• **Key Skills Detected:** ${studentSkills.join(', ')}

---

#### 🌟 Key Strengths:
1. **Strong Core Foundation:** Your proficiency in **${studentSkills.slice(0, 3).join(', ')}** provides immediate fit for Full-Stack and SDE-1 roles.
2. **Competitive CGPA:** With an **${studentCgpa} CGPA**, you pass screening cutoffs for top recruiters like Google, Microsoft, and Amazon.

#### ⚠️ Identified Skill Gaps & Recommendations:
• **Cloud & DevOps:** Recruiters (e.g. AWS, Microsoft) are heavily asking for **Docker, Kubernetes, and Cloud basics**. Consider building one small containerized service.
• **System Design:** For high-CTC drives (₹ 20+ LPA), practice distributed caching (Redis) and database indexing concepts.

#### 💡 Actionable Resume Tips:
1. Use the **Google X-Y-Z formula**: *"Accomplished [X], as measured by [Y], by doing [Z]."*
2. Ensure your master resume link is up-to-date in your [Profile Settings](/profile).`,
      suggestedPrompts: [
        'Which companies am I best suited for right now?',
        'Generate technical interview questions for my skills',
        'Help me write a cover letter for Zomato',
      ],
    };
  }

  // 2. Interviewer / Recruiter Questions Request
  if (
    lower.includes('interview') ||
    lower.includes('question') ||
    lower.includes('interviewer') ||
    lower.includes('mock interview') ||
    lower.includes('rubric')
  ) {
    return {
      text: `### 🎯 Technical & Behavioral Interview Kit

Here is a curated evaluation kit tailored to **${studentSkills.slice(0, 4).join(', ')}** and current placement standards:

---

#### 💻 Technical Deep-Dive Questions (For Candidate & Interviewer):
1. **React Architecture:** *"How does React 19's Server Components model differ from traditional client-side rendering? When would you reach for useMemo vs. pure component memoization?"*
2. **Concurrency & Execution:** *"Explain the JavaScript event loop, microtask queue vs macrotask queue with async/await."*
3. **Database Performance:** *"How does a B-Tree index accelerate SQL queries? What are the tradeoffs during write-heavy workloads?"*
4. **DSA Challenge:** *"Implement an LRU Cache with O(1) get and put operations using a HashMap and Doubly Linked List."*

---

#### 🤝 Behavioral Questions (STAR Method Evaluation):
• *"Tell me about a time when an unexpected production bug occurred right before a deadline. How did you diagnose and remediate it?"*
• *"Describe a project where you had to work with an unfamiliar technology on short notice."*

#### 📋 Interviewer Evaluation Rubric:
• **Problem Solving (40%):** Clarifies constraints, discusses time/space complexity before coding.
• **Code Hygiene (30%):** Clean naming, modular functions, handles edge cases (null/empty inputs).
• **Communication & Culture (30%):** Explains thought process out loud, receptive to feedback.`,
      suggestedPrompts: [
        'Explain the interview rounds for Google',
        'Analyze my resume & suggest improvements',
        'What skills should I learn next?',
      ],
    };
  }

  // 3. Company Matching & Eligibility
  if (
    lower.includes('company') ||
    lower.includes('companies') ||
    lower.includes('match') ||
    lower.includes('eligible') ||
    lower.includes('recommend')
  ) {
    const eligibleDrives = drives.filter(
      (d) => studentCgpa >= d.minCgpa && d.eligibleBranches.includes(studentBranch)
    );

    return {
      text: `### 🏢 Tailored Company Recommendations

Based on your **${studentBranch}** discipline, **${studentCgpa} CGPA**, and resume skills, here is your personalized roadmap:

---

#### 🟢 High-Fit Campus Drives (Ready to Apply):
${eligibleDrives
  .slice(0, 3)
  .map(
    (d) =>
      `• **${d.company} (${d.role})** — Package: **${d.ctc}** | Min CGPA: ${d.minCgpa} | Status: *${d.status}*`
  )
  .join('\n')}

#### ⚡ Upskill Opportunities (Minor Skill Gaps):
• **Amazon (Cloud & DevOps):** You meet the 7.0 CGPA requirement! Adding basic **Linux & Docker** will make you an irresistible candidate.
• **Microsoft (Azure SDE-1):** Review **C# / Cloud Fundamentals** to stand out in the technical round.

> You can view all active opportunities on your [Placement Dashboard](/student/dashboard).`,
      suggestedPrompts: [
        'Analyze my resume & suggest improvements',
        'Help me draft a cover letter for Google',
        'What are the most in-demand skills this season?',
      ],
    };
  }

  // 4. Cover Letter Help
  if (lower.includes('cover letter') || lower.includes('sop') || lower.includes('statement')) {
    return {
      text: `### ✍️ Draft Cover Letter Template

Here is a high-converting campus placement cover letter tailored to your profile:

---

*Dear Hiring Team,*

*I am writing to express my enthusiastic interest in the Software Engineering position. As a pre-final year ${studentBranch} undergraduate with an ${studentCgpa} CGPA, I have built a strong foundation in modern software engineering, data structures, and distributed architectures.*

*Through hands-on projects utilizing **${studentSkills.slice(0, 4).join(', ')}**, I have designed scalable web services and optimized database queries for production-grade reliability. I pride myself on rapid learning, high code standards, and clear technical communication.*

*I am eager to contribute my problem-solving rigor to your engineering team. Thank you for your consideration.*

*Warm regards,*  
*${profile?.name || 'Omkar Sharma'}*

---
💡 *You can paste and adjust this directly in the [Apply Page](/student/dashboard)!*`,
      suggestedPrompts: [
        'Which companies am I best suited for?',
        'Practice technical interview questions',
        'Analyze my resume',
      ],
    };
  }

  // 5. TPO / Placement Officer Inquiries
  if (
    role === 'tpo' ||
    lower.includes('tpo') ||
    lower.includes('analytics') ||
    lower.includes('funnel') ||
    lower.includes('batch') ||
    lower.includes('drive management')
  ) {
    return {
      text: `### 🏛️ TPO Placement Analytics Briefing

**Current Academic Season Key Performance Indicators:**
• **Total Active Drives:** ${drives.length} active corporate recruitments
• **Placed Students:** ${tpoStats?.placedStudents || 618} / ${tpoStats?.totalStudents || 850} (**${tpoStats?.placementRate || 72.7}%**)
• **Average Package:** **${tpoStats?.averagePackage || '₹ 14.8 LPA'}** (Highest: ${tpoStats?.highestPackage || '₹ 54.0 LPA'})

---

#### 🔍 Strategic Recommendations for Placement Cell:
1. **Branch Gap Attention:** While CSE (90%) and IT (85%) are excelling, **Electrical (55%)** and **Mechanical (37.2%)** need targeted tech-conversion bootcamps.
2. **Interview Conversion:** 540 students reached technical interviews, but only 218 offers were sealed. Organizing **mock technical panels** will increase conversion by an estimated 15-20%.
3. **Upcoming Drives:** Ensure upcoming tests have verified lab infrastructures booked 48 hours in advance.

> You can publish new opportunities via the [Post Drive Tool](/tpo/dashboard).`,
      suggestedPrompts: [
        'Draft job requirements for a new SDE drive',
        'Generate interview screening rubric for campus recruits',
        'How to improve Core Engineering branch placement rates?',
      ],
    };
  }

  // 6. Specific Company Rounds
  if (
    lower.includes('google') ||
    lower.includes('microsoft') ||
    lower.includes('amazon') ||
    lower.includes('zomato')
  ) {
    const target = drives.find((d) => lower.includes(d.company.toLowerCase())) || drives[0];

    if (!target) {
      return {
        text: `I don't have any active drives to show details for right now. Please check back once new drives are posted!`,
        suggestions: ['Show my resume analysis', 'How to prepare for interviews?'],
      };
    }

    return {
      text: `### 🏢 Hiring Process Breakdown: ${target.company}

• **Target Role:** ${target.role}
• **Offered Package:** ${target.ctc}
• **Minimum Cutoff:** CGPA ${target.minCgpa} | Disciplines: ${target.eligibleBranches.join(', ')}

---

#### 🗓️ Recruitment Rounds:
${target.recruitmentRounds
  .map(
    (r) =>
      `• **Round ${r.round} (${r.title}):** ${r.mode} (${r.duration || '45-60 mins'})`
  )
  .join('\n')}

#### 💡 Winning Strategy:
1. **Round 1 (Aptitude/DSA):** Practice medium difficulty LeetCode problems (Array, Trees, Dynamic Programming).
2. **Round 2 & 3 (Core Tech):** Be prepared to explain code complexity and defend architectural choices in your resume projects.`,
      suggestedPrompts: [
        'Generate technical questions for this company',
        'Check my skill compatibility for this drive',
        'Help me write an application cover letter',
      ],
    };
  }

  // 7. General Fallback
  return {
    text: `### 👋 Hi, I'm PulseAI!

I am your intelligent campus placement and recruitment co-pilot. I can help students land top offers and help placement officers streamline corporate drives.

**What I can do for you right now:**
• **Resume Analysis:** Scan your skills, detect skill gaps, and provide actionable tips.
• **Company Compatibility:** Match your profile with active campus drives.
• **Interview Prep:** Generate technical questions, DSA challenges, and STAR behavioral rubrics for interviewers.
• **TPO Analytics:** Provide recruitment funnel insights and batch bottlenecks.

How can I help you today?`,
    suggestedPrompts: [
      '📄 Analyze my resume & suggest improvements',
      '🎯 Which companies am I best suited for?',
      '💡 Technical interview questions for React & Python',
      '📊 Placement analytics overview (TPO)',
    ],
  };
}
