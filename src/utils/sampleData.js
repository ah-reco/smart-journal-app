/**
 * Sample data for testing the EntryDetailScreen
 *
 * To use this data, you can import it in your HomeScreen and add a button to load sample data:
 *
 * import { createSampleEntries } from '../utils/sampleData';
 * import storageService from '../services/storageService';
 *
 * const loadSampleData = async () => {
 *   const samples = createSampleEntries();
 *   await storageService.saveEntries(samples);
 *   loadEntries();
 * };
 */

export function createSampleEntries() {
  const now = new Date();

  return [
    {
      id: '1',
      title: 'A Great Day at Work',
      content: 'Today was wonderful! I completed the big project that I\'ve been working on for weeks. My team was so supportive and we celebrated together. I feel grateful for having such amazing colleagues. This success gives me confidence to tackle even bigger challenges.',
      createdAt: new Date(now.getTime() - 86400000).toISOString(), // 1 day ago
      updatedAt: new Date(now.getTime() - 86400000).toISOString(),
      tags: ['work', 'achievement', 'gratitude'],
    },
    {
      id: '2',
      title: 'Feeling Overwhelmed',
      content: 'I feel stressed and anxious about the upcoming deadline. There\'s so much to do and not enough time. I\'m worried I won\'t be able to deliver quality work. Need to take a break and reorganize my priorities.',
      createdAt: new Date(now.getTime() - 172800000).toISOString(), // 2 days ago
      updatedAt: new Date(now.getTime() - 172800000).toISOString(),
      tags: ['stress', 'work', 'anxiety'],
    },
    {
      id: '3',
      title: 'Weekend Plans',
      content: 'Planning to visit the beach this weekend. I need some time to relax and disconnect from work. Looking forward to spending time with family and enjoying nature. Maybe I\'ll try that new restaurant everyone is talking about.',
      createdAt: new Date(now.getTime() - 259200000).toISOString(), // 3 days ago
      updatedAt: new Date(now.getTime() - 259200000).toISOString(),
      tags: ['plans', 'family', 'relaxation'],
    },
    {
      id: '4',
      title: 'Learning Journey',
      content: 'Started learning React Native today. It\'s challenging but exciting. I can see how powerful it is for building mobile apps. My goal is to build a personal project by the end of the month. Taking it one step at a time.',
      createdAt: new Date(now.getTime() - 345600000).toISOString(), // 4 days ago
      updatedAt: new Date(now.getTime() - 345600000).toISOString(),
      tags: ['learning', 'technology', 'goals'],
    },
  ];
}

export function createSampleEntryWithAnalysis() {
  return {
    id: '5',
    title: 'Reflection on Personal Growth',
    content: 'Looking back at the past year, I\'ve grown so much. I\'ve learned to handle stress better, communicate more effectively, and set healthy boundaries. There were difficult moments, but each challenge taught me something valuable. I\'m proud of how far I\'ve come and excited about what\'s next.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: ['reflection', 'growth', 'personal'],
    aiAnalysis: {
      sentiment: 'positive',
      summary: 'Looking back at the past year, I\'ve grown so much. I\'ve learned to handle stress better, communicate more effectively, and set healthy boundaries.',
      insights: [
        'You are reflecting on your personal growth and development',
        'This is a detailed entry showing deep reflection',
        'You are expressing gratitude for your journey',
      ],
      recommendations: [
        'Capture what made this growth special to revisit later',
        'Consider sharing your positive energy with others',
        'Continue documenting your daily experiences',
      ],
      generatedAt: new Date().toISOString(),
    },
  };
}
