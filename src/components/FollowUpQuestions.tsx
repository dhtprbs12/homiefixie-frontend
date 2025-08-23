import React, { useState } from 'react';
import { FollowUpQuestion, QuestionSet } from '../followUpQuestions';

interface FollowUpQuestionsProps {
  questionSet: QuestionSet;
  onAnswersSubmit: (answers: Record<string, string>) => void;
  onSkip: () => void;
}

export const FollowUpQuestions: React.FC<FollowUpQuestionsProps> = ({
  questionSet,
  onAnswersSubmit,
  onSkip
}) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const currentQuestion = questionSet.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questionSet.questions.length - 1;
  const hasAnsweredCurrent = answers[currentQuestion.id];

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleNext = () => {
    if (isLastQuestion) {
      onAnswersSubmit(answers);
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const canProceed = hasAnsweredCurrent || !currentQuestion.required;

  const renderQuestion = (question: FollowUpQuestion) => {
    switch (question.type) {
      case 'multiple_choice':
        return (
          <div className="space-y-3">
            {question.options?.map((option, index) => (
              <label
                key={index}
                className={`block p-3 border rounded-lg cursor-pointer transition-all ${
                  answers[question.id] === option
                    ? 'border-blue-500 bg-blue-50 text-blue-800'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name={question.id}
                  value={option}
                  checked={answers[question.id] === option}
                  onChange={(e) => handleAnswer(question.id, e.target.value)}
                  className="sr-only"
                />
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded-full border-2 mr-3 flex-shrink-0 ${
                    answers[question.id] === option
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300'
                  }`}>
                    {answers[question.id] === option && (
                      <div className="w-2 h-2 bg-white rounded-full m-auto mt-0.5"></div>
                    )}
                  </div>
                  <span className="text-sm font-medium">{option}</span>
                </div>
              </label>
            ))}
          </div>
        );

      case 'yes_no':
        return (
          <div className="space-y-3">
            {['Yes', 'No'].map((option) => (
              <label
                key={option}
                className={`block p-3 border rounded-lg cursor-pointer transition-all ${
                  answers[question.id] === option
                    ? 'border-blue-500 bg-blue-50 text-blue-800'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name={question.id}
                  value={option}
                  checked={answers[question.id] === option}
                  onChange={(e) => handleAnswer(question.id, e.target.value)}
                  className="sr-only"
                />
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded-full border-2 mr-3 flex-shrink-0 ${
                    answers[question.id] === option
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300'
                  }`}>
                    {answers[question.id] === option && (
                      <div className="w-2 h-2 bg-white rounded-full m-auto mt-0.5"></div>
                    )}
                  </div>
                  <span className="text-sm font-medium">{option}</span>
                </div>
              </label>
            ))}
          </div>
        );

      case 'text':
        return (
          <textarea
            value={answers[question.id] || ''}
            onChange={(e) => handleAnswer(question.id, e.target.value)}
            placeholder="Please provide details..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none resize-none"
            rows={3}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="card">
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-4">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h2 className="section-title mb-0">A Few Quick Questions</h2>
          <p className="text-sm text-gray-600">Help us give you more precise recommendations</p>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">
            Question {currentQuestionIndex + 1} of {questionSet.questions.length}
          </span>
          <span className="text-sm text-gray-600">
            {Math.round(((currentQuestionIndex + 1) / questionSet.questions.length) * 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{
              width: `${((currentQuestionIndex + 1) / questionSet.questions.length) * 100}%`
            }}
          ></div>
        </div>
      </div>

      {/* Current question */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {currentQuestion.question}
          {!currentQuestion.required && (
            <span className="text-sm text-gray-500 font-normal ml-2">(optional)</span>
          )}
        </h3>
        {renderQuestion(currentQuestion)}
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between items-center">
        <div>
          {currentQuestionIndex > 0 && (
            <button
              onClick={handleBack}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 bg-white rounded-lg hover:bg-gray-50 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
          )}
        </div>

        <div className="flex space-x-3">
          <button
            onClick={onSkip}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Skip Questions
          </button>
          <button
            onClick={handleNext}
            disabled={!canProceed}
            className={`inline-flex items-center px-6 py-2 rounded-lg font-medium transition-colors ${
              canProceed
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isLastQuestion ? 'Get Precise Recommendations' : 'Next'}
            {!isLastQuestion && (
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};