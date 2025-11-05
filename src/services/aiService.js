import axios from 'axios';
import { SENTIMENT_TYPES, ERROR_MESSAGES } from '../utils/constants';

class AIService {
  constructor() {
    // Configure your AI API endpoint here
    // For Claude API: https://api.anthropic.com/v1/messages
    this.apiEndpoint = process.env.EXPO_PUBLIC_AI_API_ENDPOINT || '';
    this.apiKey = process.env.EXPO_PUBLIC_AI_API_KEY || '';
  }

  /**
   * Analyze sentiment of the entry content
   * @param {string} content - Entry content
   * @returns {Promise<string>}
   */
  async analyzeSentiment(content) {
    try {
      // Simple sentiment analysis based on keywords
      // In production, replace with actual AI API call
      const positiveWords = ['happy', 'joy', 'excited', 'grateful', 'love', 'wonderful', 'great', 'excellent', 'amazing'];
      const negativeWords = ['sad', 'angry', 'frustrated', 'worried', 'anxious', 'upset', 'terrible', 'awful', 'hate'];

      const lowerContent = content.toLowerCase();
      const positiveCount = positiveWords.filter(word => lowerContent.includes(word)).length;
      const negativeCount = negativeWords.filter(word => lowerContent.includes(word)).length;

      if (positiveCount > negativeCount && positiveCount > 0) {
        return SENTIMENT_TYPES.POSITIVE;
      } else if (negativeCount > positiveCount && negativeCount > 0) {
        return SENTIMENT_TYPES.NEGATIVE;
      } else if (positiveCount > 0 && negativeCount > 0) {
        return SENTIMENT_TYPES.MIXED;
      }
      return SENTIMENT_TYPES.NEUTRAL;
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
      throw error;
    }
  }

  /**
   * Generate insights from entry content
   * @param {string} content - Entry content
   * @returns {Promise<Array<string>>}
   */
  async generateInsights(content) {
    try {
      // Simulated insights generation
      // In production, replace with actual AI API call
      const insights = [];
      const wordCount = content.split(/\s+/).length;

      if (wordCount > 100) {
        insights.push('This is a detailed entry showing deep reflection');
      } else if (wordCount < 30) {
        insights.push('Consider expanding on your thoughts for more depth');
      }

      const lowerContent = content.toLowerCase();
      if (lowerContent.includes('i feel') || lowerContent.includes('i felt')) {
        insights.push('You are expressing your emotions openly');
      }

      if (lowerContent.includes('today') || lowerContent.includes('yesterday')) {
        insights.push('You are reflecting on recent events');
      }

      if (lowerContent.includes('goal') || lowerContent.includes('plan')) {
        insights.push('You are thinking about future objectives');
      }

      if (insights.length === 0) {
        insights.push('Continue journaling to track your personal growth');
      }

      return insights;
    } catch (error) {
      console.error('Error generating insights:', error);
      throw error;
    }
  }

  /**
   * Generate a summary of the entry
   * @param {string} content - Entry content
   * @returns {Promise<string>}
   */
  async generateSummary(content) {
    try {
      // Simulated summary generation
      // In production, replace with actual AI API call
      const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);

      if (sentences.length === 0) {
        return 'No content to summarize';
      }

      if (sentences.length === 1) {
        return content.trim();
      }

      // Return first 1-2 sentences as summary
      const summaryLength = Math.min(2, sentences.length);
      return sentences.slice(0, summaryLength).join('. ') + '.';
    } catch (error) {
      console.error('Error generating summary:', error);
      throw error;
    }
  }

  /**
   * Generate recommendations based on entry content
   * @param {string} content - Entry content
   * @param {string} sentiment - Entry sentiment
   * @returns {Promise<Array<string>>}
   */
  async generateRecommendations(content, sentiment) {
    try {
      const recommendations = [];

      switch (sentiment) {
        case SENTIMENT_TYPES.POSITIVE:
          recommendations.push('Capture what made today special to revisit later');
          recommendations.push('Consider sharing your positive energy with others');
          break;
        case SENTIMENT_TYPES.NEGATIVE:
          recommendations.push('Remember that difficult times are temporary');
          recommendations.push('Consider talking to someone you trust');
          recommendations.push('Practice self-care activities you enjoy');
          break;
        case SENTIMENT_TYPES.MIXED:
          recommendations.push('Acknowledge both the highs and lows of your day');
          recommendations.push('Reflect on what you learned from today\'s experiences');
          break;
        default:
          recommendations.push('Continue documenting your daily experiences');
          recommendations.push('Try adding more detail about your feelings');
      }

      return recommendations;
    } catch (error) {
      console.error('Error generating recommendations:', error);
      throw error;
    }
  }

  /**
   * Generate complete AI analysis for an entry
   * @param {Object} entry - Journal entry object
   * @returns {Promise<Object>}
   */
  async analyzeEntry(entry) {
    try {
      if (!entry || !entry.content) {
        throw new Error(ERROR_MESSAGES.INVALID_ENTRY);
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      const sentiment = await this.analyzeSentiment(entry.content);
      const insights = await this.generateInsights(entry.content);
      const summary = await this.generateSummary(entry.content);
      const recommendations = await this.generateRecommendations(entry.content, sentiment);

      return {
        sentiment,
        insights,
        summary,
        recommendations,
        generatedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error analyzing entry:', error);
      throw new Error(ERROR_MESSAGES.AI_ANALYSIS_FAILED);
    }
  }

  /**
   * Call actual AI API (Claude, OpenAI, etc.)
   * @param {string} prompt - Prompt for AI
   * @returns {Promise<string>}
   */
  async callAIAPI(prompt) {
    try {
      if (!this.apiEndpoint || !this.apiKey) {
        console.warn('AI API not configured, using simulated analysis');
        return null;
      }

      // Example for Claude API
      const response = await axios.post(
        this.apiEndpoint,
        {
          model: 'claude-3-sonnet-20240229',
          max_tokens: 1024,
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': this.apiKey,
            'anthropic-version': '2023-06-01',
          },
        }
      );

      return response.data.content[0].text;
    } catch (error) {
      console.error('Error calling AI API:', error);
      throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
    }
  }
}

export default new AIService();
