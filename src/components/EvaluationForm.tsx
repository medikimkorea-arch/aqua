import React, { useState } from 'react';
import { Send, ChevronLeft } from 'lucide-react';

interface EvaluationFormProps {
  participant: any;
  phase: 'initial' | 'mid' | 'final';
  items: Array<{ key: string; label: string }>;
  onSubmit: (scores: Record<string, number>) => void;
  isLoading: boolean;
  onCancel: () => void;
}

const phaseLabels = {
  initial: '초기 평가',
  mid: '중간 평가',
  final: '종결 평가'
};

export default function EvaluationForm({
  participant,
  phase,
  items,
  onSubmit,
  isLoading,
  onCancel
}: EvaluationFormProps) {
  const [scores, setScores] = useState<Record<string, number>>(() => {
    const existing = participant[phase]?.scores || {};
    return Object.fromEntries(items.map(item => [item.key, existing[item.key] || 3]));
  });

  const handleScoreChange = (key: string, value: number) => {
    setScores(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(scores);
  };

  const averageScore = Object.values(scores).length > 0
    ? (Object.values(scores).reduce((a, b) => a + b, 0) / Object.values(scores).length).toFixed(1)
    : '0';

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <button
          onClick={onCancel}
          className="mb-4 text-blue-600 hover:text-blue-800 flex items-center gap-2"
        >
          <ChevronLeft size={20} />
          돌아가기
        </button>
        <h2 className="text-2xl font-bold text-gray-800">{phaseLabels[phase]}</h2>
        <p className="text-gray-600 mt-2">참여자: {participant.name}</p>
        <p className="text-sm text-gray-500 mt-1">각 항목을 1-5점으로 평가해주세요</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white rounded-lg shadow-md p-6">
          {items.map(item => (
            <div key={item.key} className="border rounded-lg p-4 bg-gray-50">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                {item.label}
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={scores[item.key] || 3}
                  onChange={(e) => handleScoreChange(item.key, parseInt(e.target.value))}
                  className="flex-1 cursor-pointer"
                />
                <span className="text-lg font-bold text-blue-600 min-w-8 text-center">
                  {scores[item.key] || 3}점
                </span>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>낮음</span>
                <span>높음</span>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-3">평가 요약</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded p-3">
              <p className="text-xs text-gray-600">평균 점수</p>
              <p className="text-2xl font-bold text-blue-600">{averageScore}</p>
            </div>
            <div className="bg-white rounded p-3">
              <p className="text-xs text-gray-600">총 항목</p>
              <p className="text-2xl font-bold text-gray-700">{items.length}</p>
            </div>
            <div className="bg-white rounded p-3">
              <p className="text-xs text-gray-600">4점 이상</p>
              <p className="text-2xl font-bold text-green-600">
                {Object.values(scores).filter(s => s >= 4).length}개
              </p>
            </div>
            <div className="bg-white rounded p-3">
              <p className="text-xs text-gray-600">2점 이하</p>
              <p className="text-2xl font-bold text-orange-600">
                {Object.values(scores).filter(s => s <= 2).length}개
              </p>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 justify-end bg-white rounded-lg shadow-md p-6">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-6 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md font-medium transition disabled:opacity-50"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md font-medium transition disabled:opacity-50 flex items-center gap-2"
          >
            {isLoading && <span className="animate-spin">⏳</span>}
            {isLoading ? '생성 중...' : (
              <>
                <Send size={18} />
                평가 의견 생성
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
