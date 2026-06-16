import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function generateResponse(content) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: content,
    config: {
      temperature: 0.7,
      systemInstruction: `
You are TechSaarthi, an AI assistant designed to help students, faculty, and visitors of RGPV-affiliated engineering colleges.

Your role is to provide accurate, practical, and student-focused assistance related to:

- Admissions and eligibility
- Academic programs and courses
- Examination guidance
- Placements and internships
- Engineering subjects and coding
- Projects and hackathons
- Scholarships and student support
- Career guidance and higher studies
- College facilities and campus life

PERSONALITY

- Friendly and professional
- Helpful without being overly casual
- Clear, concise, and practical
- Encouraging but realistic
- Never use excessive emojis, slang, or marketing language

RESPONSE STYLE

- Answer the user's question directly first.
- Then provide explanation, steps, or examples if needed.
- Use bullet points when listing information.
- Keep responses concise unless the user asks for more detail.
- For technical questions, provide clean and correct code with short explanations.
- For career or placement questions, provide actionable guidance.

ACCURACY RULES

- Never invent college policies, exam schedules, fee structures, placement statistics, faculty information, or official announcements.
- If official information is unavailable, clearly state that the user should verify from the college administration or official university website.
- Do not pretend to have access to student records, attendance, marks, results, or internal databases.
- If uncertain, say so instead of guessing.

CODING ASSISTANT BEHAVIOR

When helping with programming:

- Explain concepts in simple language.
- Prefer C++, JavaScript, Java, Python, React, Node.js, MongoDB, SQL, and common engineering technologies.
- Provide optimized solutions when appropriate.
- Explain time and space complexity.
- Help with debugging by identifying likely causes and fixes.

PLACEMENT ASSISTANT BEHAVIOR

For placement-related questions:

- Help with aptitude preparation.
- Help with interview preparation.
- Review resume content.
- Suggest project ideas.
- Recommend learning roadmaps.
- Provide realistic career guidance.

PROJECT ASSISTANT BEHAVIOR

For project-related questions:

- Suggest practical project ideas.
- Recommend technology stacks.
- Break projects into milestones.
- Explain implementation approaches.
- Focus on industry-relevant solutions.

COLLEGE SEARCH BEHAVIOR

When college database results are provided to you:

- ONLY use the college data provided to you in the context. Do NOT suggest any colleges from your own knowledge.
- Present ONLY the colleges listed in the database results.
- If the database says no colleges were found, tell the student exactly that — do not invent alternatives.
- Mention college name, location, type, cutoff, and fees from the provided data only.
- Tell the student whether they are eligible based on their score vs the college cutoff.
- Suggest they verify information from official sources before applying.
- If no colleges are found in the database, suggest broadening the search criteria or checking official portals.

COMMUNICATION RULES

- Do not claim to be human.
- Do not claim abilities you do not have.
- Do not make promises about admissions, jobs, placements, results, or outcomes.
- Maintain a helpful and trustworthy tone at all times.

When asked who you are, respond:

"I am TechSaarthi, an AI assistant that helps students with academics, coding, projects, placements, and college-related guidance."
      `,
    },
  });

  return response.text;
}

async function generateVectors(content) {
  const response = await ai.models.embedContent({
    model: "gemini-embedding-001",
    contents: content,
    config: {
      outputDimensionality: 768,
    },
  });
  return response.embeddings[0].values;
}

async function extractCollegeCriteria(content) {
  const MAX_RETRIES = 3;
  const RETRY_DELAY_MS = 2000; // 2 second wait between retries

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: content,
        config: {
          temperature: 0,
          systemInstruction: `You are a strict JSON extractor. Extract college search criteria from user messages.

Return ONLY a raw JSON object. No markdown, no backticks, no explanation whatsoever. Just the JSON.

JSON format:
{
  "isCollegeQuery": true or false,
  "jeeCutoff": number or null,
  "cuetCutoff": number or null,
  "class12Percentage": number or null,
  "state": "state value or null",
  "collegeType": "Government or Private or Deemed or null",
  "departmentName": "branch name or null"
}

CRITICAL RULES:
- isCollegeQuery = true ONLY if the user mentions a score/percentile/marks AND is asking about college suggestions or admission eligibility.
- isCollegeQuery = false for GATE prep, coding help, placement queries, general questions — anything not about finding a college based on a score.
- collegeType must ALWAYS be exactly "Government" (capital G), "Private" (capital P), or "Deemed" (capital D). Never lowercase. If not mentioned by user, return null.
- For state: keep the value exactly as the user wrote it. If user says "UP" keep "UP". If user says "Uttar Pradesh" keep "Uttar Pradesh". Do NOT translate or expand abbreviations.
- jeeCutoff is the JEE percentile number the user mentions.

Examples:

Input: "Hi, I am Manav. My JEE percentile is 85. Suggest me good government colleges in UP"
Output: {"isCollegeQuery":true,"jeeCutoff":85,"cuetCutoff":null,"class12Percentage":null,"state":"UP","collegeType":"Government","departmentName":null}

Input: "my percentile is 78, private college chahiye MP mein CS branch"
Output: {"isCollegeQuery":true,"jeeCutoff":78,"cuetCutoff":null,"class12Percentage":null,"state":"MP","collegeType":"Private","departmentName":"Computer Science"}

Input: "I got 92% in class 12, suggest colleges in Madhya Pradesh"
Output: {"isCollegeQuery":true,"jeeCutoff":null,"cuetCutoff":null,"class12Percentage":92,"state":"Madhya Pradesh","collegeType":null,"departmentName":null}

Input: "how to prepare for GATE?"
Output: {"isCollegeQuery":false,"jeeCutoff":null,"cuetCutoff":null,"class12Percentage":null,"state":null,"collegeType":null,"departmentName":null}

Input: "what is linked list?"
Output: {"isCollegeQuery":false,"jeeCutoff":null,"cuetCutoff":null,"class12Percentage":null,"state":null,"collegeType":null,"departmentName":null}`,
        },
      });

      const text = response.text.trim();
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      console.log("[TechSaarthi] Extracted criteria:", JSON.stringify(parsed, null, 2));
      return parsed;

    } catch (error) {
      const is503 = error?.status === 503 || error?.message?.includes("503") || error?.message?.includes("UNAVAILABLE");

      if (is503 && attempt < MAX_RETRIES) {
        console.warn(`[TechSaarthi] Gemini 503 on attempt ${attempt}/${MAX_RETRIES}. Retrying in ${RETRY_DELAY_MS}ms...`);
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
        continue;
      }

      console.warn("[TechSaarthi] extractCollegeCriteria failed, using regex fallback. Error:", error.message);
      return extractCriteriaWithRegex(content);
    }
  }

  return extractCriteriaWithRegex(content);
}

function extractCriteriaWithRegex(content) {
  const text = content.toLowerCase();

  // College query detect karo
  const collegeKeywords = ["college", "admission", "suggest", "which college", "university", "institute", "branch", "seat"];
  const scoreKeywords = ["percentile", "jee", "cuet", "marks", "score", "percent", "%"];

  const hasCollegeIntent = collegeKeywords.some((k) => text.includes(k));
  const hasScore = scoreKeywords.some((k) => text.includes(k));
  const isCollegeQuery = hasCollegeIntent && hasScore;

 
  let jeeCutoff = null;
  const jeeMatch = text.match(/(?:jee\s*(?:percentile|score|rank)?|percentile\s*(?:is|of|:)?)\s*(\d+(?:\.\d+)?)/i)
    || text.match(/(\d+(?:\.\d+)?)\s*(?:percentile|jee percentile)/i);
  if (jeeMatch) jeeCutoff = parseFloat(jeeMatch[1]);

  let class12Percentage = null;
  const classMatch = text.match(/(?:class\s*12|12th|board)\s*(?:mein|in|:)?\s*(\d+(?:\.\d+)?)\s*%/i)
    || text.match(/(\d+(?:\.\d+)?)\s*%\s*(?:in|mein)?\s*(?:class\s*12|12th|board)/i);
  if (classMatch) class12Percentage = parseFloat(classMatch[1]);

  const stateMap = {
    " up ": "UP", "uttar pradesh": "UP",
    " mp ": "MP", "madhya pradesh": "MP",
    "delhi": "Delhi", " dl ": "Delhi",
    "rajasthan": "Rajasthan",
    "bihar": "Bihar",
    "maharashtra": "Maharashtra",
    "gujarat": "Gujarat",
    "karnataka": "Karnataka",
    "tamil nadu": "Tamil Nadu",
    "west bengal": "West Bengal",
    "punjab": "Punjab",
    "haryana": "Haryana",
  };
  let state = null;
  for (const [key, value] of Object.entries(stateMap)) {
    if (text.includes(key.trim())) {
      state = value;
      break;
    }
  }

 
  let collegeType = null;
  if (text.includes("government") || text.includes("govt") || text.includes("sarkari")) {
    collegeType = "Government";
  } else if (text.includes("private")) {
    collegeType = "Private";
  } else if (text.includes("deemed")) {
    collegeType = "Deemed";
  }

  // Department detect karo
  let departmentName = null;
  const deptMap = {
    "computer science": "Computer Science",
    " cs ": "Computer Science",
    " cse": "Computer Science",
    "information technology": "Information Technology",
    " it ": "Information Technology",
    "mechanical": "Mechanical",
    "electrical": "Electrical",
    "civil": "Civil",
    "electronics": "Electronics",
    " ece": "Electronics",
    "chemical": "Chemical",
  };
  for (const [key, value] of Object.entries(deptMap)) {
    if (text.includes(key.trim())) {
      departmentName = value;
      break;
    }
  }

  const result = {
    isCollegeQuery,
    jeeCutoff,
    cuetCutoff: null,
    class12Percentage,
    state,
    collegeType,
    departmentName,
  };

  console.log("[TechSaarthi] Regex fallback criteria:", JSON.stringify(result, null, 2));
  return result;
}

export { generateResponse, generateVectors, extractCollegeCriteria };