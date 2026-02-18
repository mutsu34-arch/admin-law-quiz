export interface Quiz {
  id: string;
  question: string;
  answer: "O" | "X";
  basicExplanation: string;
  detailedExplanation: string;
  keywords: string[];
  caseNumbers: string[];
  examInfo: string;
  sourceQuestionId: string;
  createdAt: Date;
}

export interface SourceQuestion {
  id: string;
  text: string;
  examInfo: string;
  createdAt: Date;
  quizIds: string[];
}
