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
