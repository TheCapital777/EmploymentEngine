"use server";

import { GoogleGenAI } from "@google/genai";

// Initialize Gemini client (Ensure GEMINI_API_KEY is in .env.local)
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "dummy_key_for_build" });

export async function enhanceObjective(currentObjective: string) {
  if (!currentObjective || currentObjective.trim().length === 0) {
    return { error: "Please provide a basic objective to enhance." };
  }

  try {
    const prompt = `
    You are an expert Tanzanian HR professional and ATS optimization specialist.
    Rewrite the following career objective to be professional, ATS-friendly, and aligned with standard corporate expectations in Tanzania. 
    Make it impactful but truthful. Do not fabricate experience.
    
    Original Objective:
    "${currentObjective}"
    
    Return ONLY the rewritten objective text.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        temperature: 0.7,
        maxOutputTokens: 250,
      }
    });

    const enhancedText = response.text?.trim() || "Failed to generate enhancement.";
    
    return { success: true, text: enhancedText };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return { error: "An error occurred while enhancing the objective. Please check your API key." };
  }
}

export async function calculateAtsScore(resumeText: string, jobIndustry: string) {
  try {
    const prompt = `
    Analyze the following resume text for a candidate targeting the ${jobIndustry} sector in Tanzania.
    Provide an ATS readiness score between 0 and 100 based on keyword relevance, action verbs, and clarity.
    
    Resume Text:
    "${resumeText}"
    
    Return only a JSON object with this exact format:
    {
      "score": 85,
      "feedback": ["Strengths here", "Weaknesses here"],
      "missingKeywords": ["Keyword1", "Keyword2"]
    }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        temperature: 0.2,
        responseMimeType: "application/json",
      }
    });

    const result = JSON.parse(response.text || "{}");
    return { success: true, data: result };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return { error: "Failed to calculate ATS score." };
  }
}

export async function analyzeProfileReadiness(cvData: any) {
  try {
    const prompt = `
    Analyze the following CV data for a candidate in Tanzania.
    Provide a "Profile Readiness" score between 0 and 100 indicating how complete, professional, and impactful this profile is.
    Look for missing contact info, short descriptions, lack of metrics, or missing sections.
    Also provide an array of 1 to 3 actionable suggestions for improvement.
    
    CV Data:
    ${JSON.stringify(cvData)}
    
    Return only a JSON object with this exact format:
    {
      "score": 85,
      "suggestions": ["Add more metrics to your experience", "Include a professional LinkedIn URL"]
    }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        temperature: 0.2,
        responseMimeType: "application/json",
      }
    });

    const result = JSON.parse(response.text || "{}");
    return { success: true, data: result };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return { error: "Failed to analyze profile readiness." };
  }
}

export async function generateCoverLetter(cvData: any, jobDescription: string) {
  try {
    const prompt = `
    You are an expert Tanzanian HR professional and Career Coach.
    Write a highly tailored, professional, and persuasive cover letter for a candidate applying to a job, based on the provided Job Description and the candidate's CV Data.
    The cover letter should highlight the most relevant skills and experiences from the CV that match the Job Description.
    Keep it concise (3-4 paragraphs), engaging, and ATS-friendly.
    
    Job Description:
    "${jobDescription}"
    
    Candidate's CV Data:
    ${JSON.stringify(cvData)}
    
    Return ONLY the text of the cover letter. Do not include placeholders like "[Your Name]" if the data is available in the CV. Use the candidate's actual details. Format the output cleanly with spacing between paragraphs.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        temperature: 0.6,
        maxOutputTokens: 800,
      }
    });

    const letterText = response.text?.trim() || "Failed to generate cover letter.";
    return { success: true, text: letterText };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return { error: "An error occurred while generating the cover letter. Please try again." };
  }
}

export async function generateInterviewPrep(cvData: any) {
  try {
    const prompt = `
    You are an expert HR Manager and Interview Coach in Tanzania.
    Based on the following candidate's CV data, generate 5 highly likely and relevant interview questions that an employer would ask this specific candidate.
    For each question, provide a strategic "Coach's Tip" on how the candidate should answer it based on their experience.
    
    Candidate's CV Data:
    ${JSON.stringify(cvData)}
    
    Return ONLY a JSON array of objects with this exact format:
    [
      {
        "question": "Question 1",
        "tip": "Tip on how to answer"
      },
      ...
    ]
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        temperature: 0.6,
        responseMimeType: "application/json",
      }
    });

    const result = JSON.parse(response.text || "[]");
    return { success: true, data: result };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return { error: "Failed to generate interview prep." };
  }
}

export async function parsePdfDocument(base64Data: string) {
  try {
    const pdfParse = require('pdf-parse');
    const buffer = Buffer.from(base64Data, 'base64');
    const data = await pdfParse(buffer);
    return { success: true, text: data.text };
  } catch (error) {
    console.error("PDF Parse Error:", error);
    return { error: "Failed to parse PDF document." };
  }
}

export async function processInterviewStep(sourceText: string, chatHistory: any[], isComplete: boolean) {
  try {
    const prompt = `
    You are an expert HR Manager and Interview Coach in Tanzania conducting an interview.
    You are interviewing a candidate based on the following source text (which could be a CV or a custom document).
    Source Text:
    "${sourceText}"
    
    Here is the conversation history so far:
    ${JSON.stringify(chatHistory)}
    
    Instructions:
    1. If the history contains a recent answer from the user, evaluate it. Give it a score out of 10, and constructive feedback on how to improve.
    2. If the interview is NOT complete (isComplete = false), generate the NEXT interview question. Make it relevant to their source text and previous answers.
    3. If the interview IS complete (isComplete = true), do NOT generate a new question, just give final overall feedback.
    
    Return ONLY a JSON object with this exact format:
    {
      "evaluation": {
        "score": 8,
        "feedback": "Your answer was good but..." // Only include if evaluating an answer. Omit if this is the very first question.
      },
      "nextQuestion": "Tell me about..." // Only include if isComplete is false
    }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        temperature: 0.6,
        responseMimeType: "application/json",
      }
    });

    const result = JSON.parse(response.text || "{}");
    return { success: true, data: result };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return { error: "Failed to process interview step." };
  }
}

export async function generateInterviewSummary(sourceText: string, chatHistory: any[]) {
  try {
    const prompt = `
    You are an expert HR Manager and Interview Coach in Tanzania. The candidate just completed a mock interview.

    Source Text (CV/profile):
    "${sourceText}"

    Full interview transcript (questions, answers, and per-answer scores/feedback where present):
    ${JSON.stringify(chatHistory)}

    Based on the full transcript, write a concise end-of-session performance report.

    Return ONLY a JSON object with this exact format:
    {
      "overallScore": 78,
      "readinessVerdict": "One sentence overall verdict on interview readiness",
      "strengths": ["Strength 1", "Strength 2"],
      "improvements": ["Area to improve 1", "Area to improve 2"],
      "negotiationTip": "One concrete, Tanzania-market-aware salary/benefits negotiation tip tailored to this candidate's apparent seniority and role, to use once they receive an offer"
    }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        temperature: 0.5,
        responseMimeType: "application/json",
      }
    });

    const result = JSON.parse(response.text || "{}");
    return { success: true, data: result };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return { error: "Failed to generate interview summary." };
  }
}

export async function createSnippeSession(userId: string) {
  try {
    const SNIPPE_API_KEY = process.env.SNIPPE_API_KEY;
    if (!SNIPPE_API_KEY) {
      throw new Error("SNIPPE_API_KEY is not configured.");
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const response = await fetch("https://api.snippe.sh/api/v1/sessions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${SNIPPE_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        amount: 10000,
        currency: "TZS",
        allowed_methods: ["mobile_money", "card"],
        redirect_url: `${baseUrl}/dashboard?payment=success`,
        webhook_url: `${baseUrl}/api/webhooks/snippe`,
        description: "Employment Engine Premium (30 Days)",
        metadata: {
          customer_id: userId
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Snippe Session Error:", errorData);
      throw new Error("Failed to create payment session.");
    }

    const data = await response.json();
    return { success: true, url: data.checkout_url || data.url || data.session_url };
  } catch (error: any) {
    console.error("Payment action error:", error);
    return { error: error.message || "An unexpected error occurred." };
  }
}


