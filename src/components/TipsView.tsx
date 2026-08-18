import React, { useState } from "react";
import { 
  BookOpen, 
  Sparkles, 
  HelpCircle, 
  Check, 
  X, 
  ChevronDown, 
  ChevronUp, 
  ShieldCheck,
  Flame,
  Award
} from "lucide-react";
import { EDUCATIONAL_ARTICLES } from "../data/educationalTips";
import { EducationalArticle } from "../types";

export const TipsView: React.FC = () => {
  const [expandedId, setExpandedId] = useState<string>(EDUCATIONAL_ARTICLES[0].id);

  // Quick Myth Buster Quiz state
  const [quizAnswered, setQuizAnswered] = useState<Record<number, boolean>>({});
  const [quizFeedback, setQuizFeedback] = useState<Record<number, string>>({});

  const QUIZ_QUESTIONS = [
    {
      question: "Is it okay to put greasy pizza boxes in the blue paper recycling bin?",
      correct: false,
      explanation: "False! Oil and melted cheese ruin the water-based paper pulping process. Put greasy bottoms in Green Compost / Organics!",
    },
    {
      question: "Do you need to wash recyclables with soap and run them in the dishwasher?",
      correct: false,
      explanation: "False! A simple 3-second rinse or scrape to remove bulk liquids/food is sufficient. Don't waste dishwashing water.",
    },
    {
      question: "Can spent alkaline and lithium batteries cause garbage truck fires?",
      correct: true,
      explanation: "True! Truck compactors crush batteries, causing thermal short circuits and dangerous chemical fires.",
    },
  ];

  const handleAnswer = (qIndex: number, userBool: boolean) => {
    const q = QUIZ_QUESTIONS[qIndex];
    const isCorrect = userBool === q.correct;
    setQuizAnswered((prev) => ({ ...prev, [qIndex]: true }));
    setQuizFeedback((prev) => ({
      ...prev,
      [qIndex]: isCorrect
        ? `✅ Correct! ${q.explanation}`
        : `❌ Incorrect. ${q.explanation}`,
    }));
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header Bento Tile */}
      <div className="bg-white dark:bg-[#0F172A] rounded-[2rem] p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none space-y-2">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-[#2196F3]" />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Education & Guidelines
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A] dark:text-white tracking-tight flex items-center space-x-2.5">
          <BookOpen className="w-7 h-7 text-[#2196F3]" />
          <span>Recycling Best Practices & Myth Busters</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
          Master the rules of proper waste segregation to prevent recycling contamination and protect sanitation workers.
        </p>
      </div>

      {/* Interactive Myth Buster Challenge Box in Bento Style */}
      <div className="bg-[#0F172A] text-white rounded-[2rem] p-6 sm:p-8 shadow-2xl space-y-5 border border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <ShieldCheck className="w-6 h-6 text-[#2196F3]" />
            <h3 className="font-black text-lg sm:text-xl">Quick Myth Buster Challenge</h3>
          </div>
          <span className="text-xs font-black uppercase tracking-wider px-3 py-1 bg-white/10 rounded-full text-[#2196F3] border border-white/10">
            Interactive Test
          </span>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
          Test your household waste segregation knowledge against these 3 common recycling myths:
        </p>

        <div className="space-y-3.5">
          {QUIZ_QUESTIONS.map((q, idx) => (
            <div key={idx} className="bg-white/5 backdrop-blur-md rounded-[1.5rem] p-4 sm:p-5 border border-white/10 space-y-3">
              <p className="font-bold text-sm sm:text-base text-white">
                {idx + 1}. {q.question}
              </p>

              {!quizAnswered[idx] ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAnswer(idx, true)}
                    className="px-5 py-2 bg-[#2196F3] hover:bg-blue-600 text-white text-xs font-black uppercase tracking-wider rounded-full transition-all active:scale-95 shadow-md shadow-blue-500/20"
                  >
                    True
                  </button>
                  <button
                    onClick={() => handleAnswer(idx, false)}
                    className="px-5 py-2 bg-white/15 hover:bg-white/25 text-white text-xs font-black uppercase tracking-wider rounded-full transition-all active:scale-95"
                  >
                    False
                  </button>
                </div>
              ) : (
                <div className="p-3.5 bg-slate-900 rounded-2xl text-xs sm:text-sm text-blue-200 border border-slate-700 animate-in fade-in font-medium">
                  {quizFeedback[idx]}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Educational Articles List in Bento style */}
      <div className="space-y-4">
        <h3 className="font-black text-lg text-[#0F172A] dark:text-white">
          Recycling Masterclasses & Safety Guides
        </h3>

        <div className="space-y-3">
          {EDUCATIONAL_ARTICLES.map((article) => {
            const isExpanded = expandedId === article.id;
            return (
              <div
                key={article.id}
                className="bg-white dark:bg-[#0F172A] rounded-[1.75rem] border-2 border-slate-200/80 dark:border-slate-800 shadow-md shadow-slate-200/30 dark:shadow-none overflow-hidden transition-all hover:border-[#2196F3]/40"
              >
                <div
                  onClick={() => setExpandedId(isExpanded ? "" : article.id)}
                  className="p-5 sm:p-6 flex items-center justify-between cursor-pointer hover:bg-[#F1F5F9]/50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <div className="space-y-1.5 pr-4">
                    <div className="flex items-center space-x-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-900 dark:bg-blue-950/60 dark:text-blue-300">
                        {article.badge}
                      </span>
                      <span className="text-xs text-slate-400 font-semibold">
                        {article.readTime}
                      </span>
                    </div>
                    <h4 className="font-black text-[#0F172A] dark:text-white text-base sm:text-lg">
                      {article.title}
                    </h4>
                  </div>

                  <button className="p-2 rounded-full bg-[#F1F5F9] dark:bg-slate-800 text-slate-500 shrink-0">
                    {isExpanded ? <ChevronUp className="w-5 h-5 text-[#2196F3]" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>

                {isExpanded && (
                  <div className="px-5 sm:px-6 pb-6 pt-2 space-y-4 border-t border-slate-100 dark:border-slate-800 animate-in fade-in">
                    <p className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 bg-[#F1F5F9] dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700">
                      {article.summary}
                    </p>

                    <div className="space-y-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                      {article.content.map((paragraph, pIdx) => (
                        <p key={pIdx}>{paragraph}</p>
                      ))}
                    </div>

                    <div className="p-4 bg-blue-50/80 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/60 rounded-2xl text-xs sm:text-sm text-blue-900 dark:text-blue-300 font-black flex items-center space-x-2.5">
                      <Sparkles className="w-4 h-4 text-[#2196F3] shrink-0" />
                      <span>Key Takeaway: {article.keyTakeaway}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
