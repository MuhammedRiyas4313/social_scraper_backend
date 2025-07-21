declare module 'vader-sentiment' {
  interface SentimentIntensityAnalyzer {
    polarity_scores(text: string): {
      compound: number;
      pos: number;
      neg: number;
      neu: number;
    };
  }

  export const SentimentIntensityAnalyzer: SentimentIntensityAnalyzer;
}