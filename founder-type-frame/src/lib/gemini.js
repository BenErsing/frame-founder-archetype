import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

const SYSTEM_PROMPT = `You are an AI model designed to analyze individuals' public social media posts and online discussions to classify their founder archetype. Using data from Farcaster, assess their:

Tone & Sentiment: Are they optimistic, analytical, critical, or people-focused?
Engagement Patterns: Do they share bold ideas, discuss execution strategies, or rally communities?
Content Themes: Do they focus on innovation, scaling, or relationship-building?
Interaction Styles: Do they initiate discussions, respond to others, or amplify conversations?
Favorite Topics: What startup functions or capabilities do they post about most, and which drive the most engagement? Are they focused on engineering, product design, fundraising, team building, or something else? What does this suggest about their expertise, strengths, motivations, and potential gaps where complementary hires would help?

IMPORTANT: Always write the analysis in FIRST PERSON, addressing the user directly as "you". For example: "You are a visionary founder who..." instead of "This user is a visionary founder who..."

Founder Archetype Analysis
Based on these insights, classify the individual into relevant founder archetypes. They may exhibit strong tendencies in one or multiple categories:

The Visionary Builder – You are an ambitious thinker who thrives on big ideas and shaping the future. You focus on long-term impact, industry shifts, and disruptive innovation. You are driven by a desire to create something transformative and are willing to take bold risks to do so.

The Strategic Operator – You are execution-driven, obsessed with efficiency, scaling, and building systems that work. You prioritize structure and process, ensuring ideas don't just remain ideas but become sustainable businesses. You excel at breaking down complexity into achievable steps.

The Community Catalyst – You are highly people-focused, thriving on engagement, connection, and movement-building. You rally support, share knowledge, and foster collaboration. Your ability to align people around a shared vision makes you a powerful force for growth and momentum.

The Contrarian Thinker – You challenge norms, question existing models, and push for radical change. You have a unique perspective that others may initially resist but ultimately recognize as insightful. You are comfortable being an outlier and thrive on solving problems from first principles.

The Relentless Problem-Solver – You are pragmatic, hands-on, and laser-focused on solving real-world problems. Your approach is rooted in iteration, constant learning, and breaking challenges down into actionable steps. You don't just identify problems—you work tirelessly to fix them.

Confidence Score & Refinement
Provide a confidence score (low, medium, high) based on data availability, consistency, and clarity of behavioral patterns. If the analysis has conflicting signals, suggest alternative classifications and invite the user to refine their results.

Remember: Always write in first person, addressing the user as "you" throughout the analysis.`;

const founderTypeSchema = {
  type: SchemaType.OBJECT,
  properties: {
    primaryType: {
      type: SchemaType.STRING,
      description: "The primary founder archetype (one of: 'visionary', 'strategic', 'community', 'contrarian', 'relentless')",
      nullable: false,
    },
    confidence: {
      type: SchemaType.NUMBER,
      description: "Confidence percentage in the primary type classification (0.0-1.0)",
      nullable: false,
    },
    analysis: {
      type: SchemaType.STRING,
      description: "Detailed explanation of why this is their primary type, citing specific patterns and examples from their content",
      nullable: false,
    },
    secondaryTypes: {
      type: SchemaType.OBJECT,
      description: "Percentage likelihood of other founder types",
      properties: {
        visionary: {
          type: SchemaType.NUMBER,
          description: "Percentage match for Visionary Builder type (0.0-1.0)",
          nullable: false,
        },
        strategic: {
          type: SchemaType.NUMBER,
          description: "Percentage match for Strategic Operator type (0.0-1.0)",
          nullable: false,
        },
        community: {
          type: SchemaType.NUMBER,
          description: "Percentage match for Community Catalyst type (0.0-1.0)",
          nullable: false,
        },
        contrarian: {
          type: SchemaType.NUMBER,
          description: "Percentage match for Contrarian Thinker type (0.0-1.0)",
          nullable: false,
        },
        relentless: {
          type: SchemaType.NUMBER,
          description: "Percentage match for Relentless Problem-Solver type (0.0-1.0)",
          nullable: false,
        }
      },
      required: ["visionary", "strategic", "community", "contrarian", "relentless"],
      nullable: false,
    }
  },
  required: ["primaryType", "confidence", "analysis", "secondaryTypes"]
};

export class GeminiAnalyzer {
  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      console.warn('Missing GEMINI_API_KEY.');
      return;
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: {
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 2048,
        responseMimeType: "application/json",
        responseSchema: founderTypeSchema,
      }
    });
  }

  async analyzeFounderType(casts, profile) {
    try {
      // Handle both single cast object and array of casts
      let castsArray = casts;
      if (!Array.isArray(casts)) {
        if (casts === null || casts === undefined) {
          console.error('Casts is null or undefined');
          return null;
        }
        // If it's a single cast object with text property, wrap it in an array
        if (typeof casts === 'object' && casts.text && typeof casts.text === 'string') {
          castsArray = [casts];
        } else if (typeof casts === 'object' && casts.casts && Array.isArray(casts.casts)) {
          // If it's an object with a casts array property
          castsArray = casts.casts;
        } else {
          console.error('Invalid casts format:', JSON.stringify(casts, null, 2));
          return null;
        }
      }

      // Extract usernames mentioned in casts for interaction analysis
      const mentionedUsers = new Map();
      
      castsArray.forEach(cast => {
        const matches = cast.text.match(/@(\w+)/g) || [];
        matches.forEach(match => {
          const username = match.slice(1);
          mentionedUsers.set(username, (mentionedUsers.get(username) || 0) + 1);
        });
      });

      const textPrompt = `${SYSTEM_PROMPT}

Analyze this Farcaster user's profile and activity to determine their founder archetype.

Profile Information:
${JSON.stringify(profile, null, 2)}

Activity Analysis:
- Total Casts Analyzed: ${castsArray.length}

Content Sample:
${castsArray.map(cast => cast.text).join('\n\n')}

Based on this data, determine:
1. Their primary founder archetype
2. Confidence level in this classification
3. Detailed analysis of why this is their primary type
4. Percentage match for each other archetype

Remember:
- Focus on patterns and themes in their content
- Consider their interaction style and topics of interest
- Look for evidence of their approach to problems and opportunities`;

      const result = await this.model.generateContent([textPrompt]);
      return JSON.parse(result.response.text());
    } catch (error) {
      console.error('Error analyzing founder type:', error);
      return null;
    }
  }
}

// Create singleton instance
export const gemini = new GeminiAnalyzer(); 