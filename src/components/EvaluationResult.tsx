import React from 'react';
import { Printer, ChevronLeft } from 'lucide-react';

interface EvaluationResultProps {
  result: any;
  participant: any;
  phase: 'initial' | 'mid' | 'final';
  onPrint: () => void;
  onBack: () => void;
}

const phaseLabels = {
  initial: '초기 평가',
  mid: '중간 평가',
  final: '종결 평가'
};

export default function EvaluationResult({
  result,
  participant,
  phase,
  onPrint,
  onBack
}: EvaluationResultProps) {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Control Bar */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6 flex justify-between items-center no-print">
        <button
          onClick={onBack}
          className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
        >
          <ChevronLeft size={20} />
          다시 평가하기
        </button>
        <button
          onClick={onPrint}
          className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md font-medium transition flex items-center gap-2"
        >
          <Printer size={18} />
          인쇄
        </button>
      </div>

      {/* Report */}
      <div className="bg-white rounded-lg shadow-md p-8 print-page">
        {/* Header */}
        <div className="border-b-4 border-blue-600 pb-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-800">수중재활 운동 평가 보고서</h1>
          <p className="text-gray-600 mt-2">{phaseLabels[phase]}</p>
          <p className="text-sm text-gray-500 mt-1">
            작성일: {new Date().toLocaleDateString('ko-KR')}
          </p>
        </div>

        {/* Participant Info */}
        <div className="mb-8 bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4">참여자 정보</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-semibold text-gray-700">이름</p>
              <p className="text-gray-600">{participant.name}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-700">성별</p>
              <p className="text-gray-600">{participant.gender}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-700">생년월일</p>
              <p className="text-gray-600">{participant.birthDate}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-700">장애명</p>
              <p className="text-gray-600">{participant.disabilityName}</p>
            </div>
            <div className="col-span-2">
              <p className="font-semibold text-gray-700">특이사항</p>
              <p className="text-gray-600">{participant.specialNotes || '없음'}</p>
            </div>
          </div>
        </div>

        {/* Evaluation Summary */}
        <div className="mb-8 bg-blue-50 p-6 rounded-lg border border-blue-200">
          <h2 className="text-xl font-bold text-blue-900 mb-4">평가 결과 요약</h2>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="bg-white rounded p-4 text-center border border-blue-100">
              <p className="text-sm text-gray-600">평균 점수</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">{result.averageScore}</p>
              <p className="text-xs text-gray-500 mt-1">/ 5.0</p>
            </div>
            <div className="bg-white rounded p-4 text-center border border-blue-100">
              <p className="text-sm text-gray-600">평가 단계</p>
              <p className="text-2xl font-bold text-gray-700 mt-2">{phaseLabels[phase]}</p>
            </div>
            <div className="bg-white rounded p-4 text-center border border-blue-100">
              <p className="text-sm text-gray-600">평가 항목</p>
              <p className="text-3xl font-bold text-gray-700 mt-2">16</p>
              <p className="text-xs text-gray-500 mt-1">개</p>
            </div>
          </div>
        </div>

        {/* General Opinion */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 border-b-2 border-blue-600 pb-2">
            종합 소견
          </h2>
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 leading-relaxed text-gray-700 whitespace-pre-wrap">
            {result.generalOpinion}
          </div>
        </div>

        {/* Aftercare */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 border-b-2 border-blue-600 pb-2">
            사후관리 계획
          </h2>
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 leading-relaxed text-gray-700 whitespace-pre-wrap">
            {result.aftercare}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t-2 border-gray-300 pt-6 mt-12 text-center text-sm text-gray-600">
          <p>이 보고서는 전문 평가사에 의해 작성되었습니다.</p>
          <p className="mt-2">수중재활 운동 평가 관리 시스템</p>
        </div>
      </div>
    </div>
  );
}
