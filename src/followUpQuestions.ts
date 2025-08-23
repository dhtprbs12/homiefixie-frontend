// AI-powered follow-up questions system for precise home improvement recommendations

export interface FollowUpQuestion {
  id: string;
  question: string;
  type: 'multiple_choice' | 'yes_no' | 'text';
  options?: string[];
  required?: boolean;
}

export interface QuestionSet {
  questions: FollowUpQuestion[];
  category: string;
}

// Function to generate dynamic follow-up questions using OpenAI
export async function generateFollowUpQuestions(description: string): Promise<QuestionSet | null> {
  try {
    const API_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:4000';
    const response = await fetch(`${API_URL}/api/generate-questions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ description }),
    });

    if (!response.ok) {
      console.warn('Failed to generate questions:', response.status);
      return null;
    }

    const data = await response.json();
    return data.questionSet || null;
  } catch (error) {
    console.warn('Error generating questions:', error);
    return null;
  }
}

// Function to format follow-up answers for AI analysis
export function formatFollowUpAnswers(answers: Record<string, string>): string {
  const formatted = Object.entries(answers)
    .map(([questionId, answer]) => {
      // Convert question ID to more readable format
      const readableQuestion = questionId
        .replace(/_/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());
      return `${readableQuestion}: ${answer}`;
    })
    .join('\n');
  
  return formatted ? `\n\nAdditional Details:\n${formatted}` : '';
}