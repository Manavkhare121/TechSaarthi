import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const baseSystemInstruction = `
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
`;



async function detectLanguage(text) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: text,
      config: {
        temperature: 0,
        systemInstruction: `Detect the language of the user's message.
Return ONLY a raw JSON object. No markdown, no backticks, no explanation.

Format:
{
  "language": "hindi" | "english" | "marathi" | "tamil" | "telugu" | "bengali" | "gujarati" | "kannada" | "punjabi" | "other",
  "script": "devanagari" | "latin" | "other",
  "confidence": 0.0 to 1.0
}

Examples:
"mera jee percentile 85 hai" → {"language":"hindi","script":"latin","confidence":0.95}
"मेरा JEE percentile 85 है" → {"language":"hindi","script":"devanagari","confidence":0.99}
"my percentile is 85" → {"language":"english","script":"latin","confidence":0.99}
"मला college सांगा" → {"language":"marathi","script":"devanagari","confidence":0.97}
"en college sollunga" → {"language":"tamil","script":"latin","confidence":0.93}`,
      },
    });

    const clean = response.text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);
    console.log("[TechSaarthi] Detected language:", JSON.stringify(parsed));
    return parsed;
  } catch (error) {
    console.warn("[TechSaarthi] Language detection failed, defaulting to English:", error.message);
    return { language: "english", script: "latin", confidence: 1.0 };
  }
}


async function generateResponse(content, language = "english") {
  const languageInstruction =
    language === "english"
      ? "Always respond in English."
      : `Always respond in ${language}.
         If the user wrote in Roman script (e.g. "mera naam"), reply in Roman script (Hinglish/transliterated) too.
         If the user wrote in native script (e.g. "मेरा नाम"), reply in native script.
         Keep technical terms like JEE, CUET, percentile, fees, hostel, branch in English within your response.`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: content,
    config: {
      temperature: 0.7,
      systemInstruction: `${baseSystemInstruction}\n\nLANGUAGE RULE:\n${languageInstruction}`,
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
  const RETRY_DELAY_MS = 2000;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: content,
        config: {
          temperature: 0,
          systemInstruction: `You are a strict JSON extractor. Extract college search criteria from user messages.
The user may write in English, Hindi (Roman/Devanagari), or any Indian regional language.

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
- isCollegeQuery = false for GATE prep, coding help, placement queries, general questions.
- collegeType must ALWAYS be exactly "Government", "Private", or "Deemed". Never lowercase. If not mentioned, return null.
- For state: normalize to English state name (e.g. "मध्य प्रदेश" → "Madhya Pradesh", "उत्तर प्रदेश" → "UP").
- jeeCutoff is the JEE percentile number the user mentions.
- Understand Hindi/Hinglish terms: "sarkari" = Government, "niji" = Private, "percentile hai mera" = jeeCutoff, "chahiye" = want/need.

Examples:

Input: "mera jee percentile 85 hai, UP mein government college chahiye"
Output: {"isCollegeQuery":true,"jeeCutoff":85,"cuetCutoff":null,"class12Percentage":null,"state":"UP","collegeType":"Government","departmentName":null}

Input: "मेरा percentile 78 है, MP में private college CS branch के लिए"
Output: {"isCollegeQuery":true,"jeeCutoff":78,"cuetCutoff":null,"class12Percentage":null,"state":"MP","collegeType":"Private","departmentName":"Computer Science"}

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
      const is503 =
        error?.status === 503 ||
        error?.message?.includes("503") ||
        error?.message?.includes("UNAVAILABLE");

      if (is503 && attempt < MAX_RETRIES) {
        console.warn(
          `[TechSaarthi] Gemini 503 on attempt ${attempt}/${MAX_RETRIES}. Retrying in ${RETRY_DELAY_MS}ms...`
        );
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
        continue;
      }

      console.warn(
        "[TechSaarthi] extractCollegeCriteria failed, using regex fallback. Error:",
        error.message
      );
      return extractCriteriaWithRegex(content);
    }
  }

  return extractCriteriaWithRegex(content);
}



function extractCriteriaWithRegex(content) {
  const text = content.toLowerCase();

  const collegeKeywords = [
    "college", "admission", "suggest", "which college", "university", "institute", "branch", "seat",
   
    "कॉलेज", "प्रवेश", "विश्वविद्यालय", "संस्थान",

    "college chahiye", "college batao", "mujhe college", "konsa college", "kaun sa college",
  ];

  const scoreKeywords = [
    "percentile", "jee", "cuet", "marks", "score", "percent", "%",
  
    "नंबर", "अंक", "प्रतिशत", "परसेंटाइल",
 
    "mera percentile", "mera score", "mere marks",
  ];

  const hasCollegeIntent = collegeKeywords.some((k) => text.includes(k));
  const hasScore = scoreKeywords.some((k) => text.includes(k));
  const isCollegeQuery = hasCollegeIntent && hasScore;

  
  let jeeCutoff = null;
  const jeeMatch =
    text.match(/(?:jee\s*(?:percentile|score|rank)?|percentile\s*(?:is|of|:)?|percentile\s*hai\s*mera|mera\s*percentile)\s*(\d+(?:\.\d+)?)/i) ||
    text.match(/(\d+(?:\.\d+)?)\s*(?:percentile|jee percentile)/i);
  if (jeeMatch) jeeCutoff = parseFloat(jeeMatch[1]);

  let class12Percentage = null;
  const classMatch =
    text.match(/(?:class\s*12|12th|board)\s*(?:mein|in|:)?\s*(\d+(?:\.\d+)?)\s*%/i) ||
    text.match(/(\d+(?:\.\d+)?)\s*%\s*(?:in|mein)?\s*(?:class\s*12|12th|board)/i);
  if (classMatch) class12Percentage = parseFloat(classMatch[1]);

 
  const stateMap = {
    " up ": "UP", "uttar pradesh": "UP", "उत्तर प्रदेश": "UP",
    " mp ": "MP", "madhya pradesh": "MP", "मध्य प्रदेश": "MP",
    "delhi": "Delhi", " dl ": "Delhi", "दिल्ली": "Delhi",
    "rajasthan": "Rajasthan", "राजस्थान": "Rajasthan",
    "bihar": "Bihar", "बिहार": "Bihar",
    "maharashtra": "Maharashtra", "महाराष्ट्र": "Maharashtra",
    "gujarat": "Gujarat", "गुजरात": "Gujarat",
    "karnataka": "Karnataka", "कर्नाटक": "Karnataka",
    "tamil nadu": "Tamil Nadu", "तमिल नाडु": "Tamil Nadu",
    "west bengal": "West Bengal", "पश्चिम बंगाल": "West Bengal",
    "punjab": "Punjab", "पंजाब": "Punjab",
    "haryana": "Haryana", "हरियाणा": "Haryana",
  };

  let state = null;
  for (const [key, value] of Object.entries(stateMap)) {
    if (text.includes(key.trim())) {
      state = value;
      break;
    }
  }

  let collegeType = null;
  if (text.includes("government") || text.includes("govt") || text.includes("sarkari") || text.includes("सरकारी")) {
    collegeType = "Government";
  } else if (text.includes("private") || text.includes("niji") || text.includes("निजी")) {
    collegeType = "Private";
  } else if (text.includes("deemed") || text.includes("डीम्ड")) {
    collegeType = "Deemed";
  }

  
  const deptMap = {
    "computer science": "Computer Science",
    " cs ": "Computer Science",
    " cse": "Computer Science",
    "कंप्यूटर साइंस": "Computer Science",
    "information technology": "Information Technology",
    " it ": "Information Technology",
    "mechanical": "Mechanical",
    "मैकेनिकल": "Mechanical",
    "electrical": "Electrical",
    "इलेक्ट्रिकल": "Electrical",
    "civil": "Civil",
    "सिविल": "Civil",
    "electronics": "Electronics",
    " ece": "Electronics",
    "इलेक्ट्रॉनिक्स": "Electronics",
    "chemical": "Chemical",
    "केमिकल": "Chemical",
  };

  let departmentName = null;
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

export { generateResponse, generateVectors, extractCollegeCriteria, detectLanguage };