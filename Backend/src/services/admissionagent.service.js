import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import { College } from "../models/college.model.js";

dotenv.config();

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

const predict_admission_probability = {
    name: "predict_admission_probability",
    description: "Calculates admission probability using current database cutoffs.",
    parameters: {
        type: Type.OBJECT,
        properties: {
            studentPercentile: { type: Type.NUMBER, description: "Student's percentile score." },
            collegeName: { type: Type.STRING, description: "Target college name." },
            departmentName: { type: Type.STRING, description: "Target branch/department name. Convert abbreviations to full names (e.g., 'CSE' to 'Computer Science', 'IT' to 'Information Technology')." }
        },
        required: ["studentPercentile", "collegeName", "departmentName"]
    }
};

const systemInstruction = `You are an AI Admission Agent. 
You do NOT calculate chances manually.
Instead, use the 'predict_admission_probability' tool to analyze the student's profile against the current database.
Translate the tool's raw JSON output into a natural, conversational response that sounds like an expert human counselor analyzing their profile based on current data.
Never show the raw JSON or mention the word "tool" to the user.`;

export const getAgentResponse = async (userMessage) => {
    const chat = ai.chats.create({
        model: "gemini-2.5-flash",
        config: {
            systemInstruction,
            tools: [{ functionDeclarations: [predict_admission_probability] }],
            temperature: 0.3,
        }
    });

    let response = await chat.sendMessage({ message: userMessage });

    if (response.functionCalls && response.functionCalls.length > 0) {
        const call = response.functionCalls[0];
        
        if (call.name === "predict_admission_probability") {
            const { studentPercentile, collegeName, departmentName } = call.args;
            
            let searchBranch = departmentName;
            const branchMap = {
                "cse": "Computer Science",
                "cs": "Computer Science",
                "it": "Information Technology",
                "ece": "Electronics",
                "ee": "Electrical",
                "me": "Mechanical",
                "ce": "Civil"
            };
            
            const lowerBranch = departmentName.toLowerCase().trim();
            if (branchMap[lowerBranch]) {
                searchBranch = branchMap[lowerBranch];
            } else if (lowerBranch.includes("cse") || lowerBranch.includes("cs")) {
                searchBranch = "Computer Science";
            }

            const data = await College.findOne({ 
                collegeName: { $regex: collegeName, $options: 'i' }, 
                departmentName: { $regex: searchBranch, $options: 'i' } 
            });


            let aiContext = {};

            if (!data) {
                aiContext = { status: "Error", message: `Data not available for ${collegeName} - ${departmentName} in the database.` };
            } else if (!data.jeeCutoff) {
                aiContext = { status: "Error", message: `College found, but jeeCutoff is missing in database for ${collegeName}.` };
            } else {
                const margin = studentPercentile - data.jeeCutoff;
                let probabilityPercentage;
                let categorization;

                if (margin >= 5) { probabilityPercentage = 95; categorization = "Highly Likely"; }
                else if (margin >= 0) { probabilityPercentage = 80; categorization = "Likely"; }
                else if (margin >= -3) { probabilityPercentage = 50; categorization = "Borderline / Waitlist"; }
                else { probabilityPercentage = 15; categorization = "Unlikely"; }

                aiContext = {
                    calculatedChance: `${probabilityPercentage}%`,
                    category: categorization,
                    currentCutoff: data.jeeCutoff,
                    studentScore: studentPercentile,
                    aiRecommendation: probabilityPercentage < 50 ? "Suggest alternative colleges with lower cutoffs." : "Encourage applying."
                };
            }

            response = await chat.sendMessage({
                message: [{
                    functionResponse: {
                        name: "predict_admission_probability",
                        response: aiContext
                    }
                }]
            });
        }
    }

    return response.text;
};