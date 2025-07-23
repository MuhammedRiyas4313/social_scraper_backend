import natural from "natural";
import vader from 'vader-sentiment';

interface SentimentResult {
  score: number;
  sentiment: "positive" | "neutral" | "negative";
}

const stopwords = require("natural/lib/natural/util/stopwords").words;

const tokenizer = new natural.WordTokenizer();

// Types
interface Keyword {
  word: string;
  count: number;
}

interface Hashtag {
  tag: string;
  count: number;
}

interface SentimentResult {
  score: number;
  sentiment: "positive" | "neutral" | "negative";
}

interface AnalysisResult {
  keywords: Keyword[];
  hashtags: Hashtag[];
  sentiment: SentimentResult;
}

interface SocialPost {
  content?: string;
  text?: string;
  title?: string;
}

export const analyzeText = async (
  posts: SocialPost[]
): Promise<AnalysisResult> => {
  const allText = posts
    .map((p) => p.text || p.title || p.content || "")
    .filter(Boolean)
    .join(" ");

  return {
    keywords: extractKeywords(allText),
    hashtags: extractHashtags(allText),
    sentiment: analyzeSentiment(allText),
  };
};

function extractKeywords(text: string): Keyword[] {
  if (!text) return [];

  const tokens = tokenizer.tokenize(text.toLowerCase()) || [];
  const filtered = tokens.filter(
    (token) =>
      !stopwords.includes(token) && 
      token.length > 3 &&
      /^[a-z]+$/.test(token)
  );

  const freq: Record<string, number> = {};
  filtered.forEach((word) => {
    freq[word] = (freq[word] || 0) + 1;
  });

  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([word, count]) => ({ word, count }));
}

function extractHashtags(text: string): Hashtag[] {
  if (!text) return [];

  const hashtags = text.match(/#\w+/g) || [];
  const freq: Record<string, number> = {};

  hashtags.forEach((tag) => {
    const normalized = tag.toLowerCase();
    freq[normalized] = (freq[normalized] || 0) + 1;
  });

  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([tag, count]) => ({ tag, count }));
}

 function analyzeSentiment(text: string | undefined | null): SentimentResult {
  // Handle null/undefined or non-string input
  if (typeof text !== 'string' || !text.trim()) {
    return { score: 0, sentiment: "neutral" };
  }
  
  try {
    const result = vader.SentimentIntensityAnalyzer.polarity_scores(text);
    const score = result.compound;
    
    let sentiment: "positive" | "neutral" | "negative";
    if (score > 0.05) sentiment = "positive";
    else if (score < -0.05) sentiment = "negative";
    else sentiment = "neutral";

    return { score, sentiment };
  } catch (error) {
    console.error('Sentiment analysis failed:', error);
    return { score: 0, sentiment: "neutral" };
  }
}
