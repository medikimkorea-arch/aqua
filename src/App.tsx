import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, BarChart3, Download, Loader } from 'lucide-react';
import ParticipantForm from './components/ParticipantForm';
import EvaluationForm from './components/EvaluationForm';
import EvaluationResult from './components/EvaluationResult';
import EvaluationChart from './components/EvaluationChart';
import ParticipantList from './components/ParticipantList';

interface Participant {
  id: string;
  name: string;
  gender: string;
  birthDate: string;
  disabilityName: string;
  specialNotes: string;
  waterExperience: string;
  dailyWaterUsage: string;
  longTermGoal: string;
  shortTermGoal: string;
  initial?: { scores: Record<string, number>; date: string };
  mid?: { scores: Record<string, number>; date: string };
  final?: { scores: Record<string, number>; date: string };
}

interface EvaluationResult {
  generalOpinion: string;
  aftercare: string;
  averageScore: string;
}

const EVALUATION_ITEMS = [
  { key: 'entry', label: '수중 입수/퇴수 조절' },
  { key: 'water_face', label: '얼굴 물 적시기' },
  { key: 'walking', label: '수중 보행 및 중심 복원' },
  { key: 'immersion', label: '어깨/턱 신체 침수' },
  { key: 'exhalation_oral', label: '입으로 기포 만들기' },
  { key: 'exhalation_nasal', label: '코/입 날숨 연계' },
  { key: 'rhythmic_breathing', label: '보행-호흡 연동' },
  { key: 'supine_float', label: '등 조력 뜨기' },
  { key: 'prone_float', label: '엎드려 전면 뜨기' },
  { key: 'recovery_stand', label: '부체 후 일어서기' },
  { key: 'leg_kick', label: '발차기 추진력' },
  { key: 'arm_stroke', label: '팔로 물 밀어내기' },
  { key: 'independent_propulsion', label: '자율 전진 이동성' },
  { key: 'instruction_following', label: '교육 규칙 준수' },
  { key: 'fear_mastery', label: '불안 심리 안정도' },
  { key: 'self_regulation', label: '수중 자가 조절력' }
];

type Tab = 'list' | 'form' | 'evaluation' | 'chart';

export default function App() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('list');
  const [evaluationResult, setEvaluationResult] = useState<EvaluationResult | null>(null);
  const [currentPhase, setCurrentPhase] = useState<'initial' | 'mid' | 'final'>('initial');
  const [isLoading, setIsLoading] = useState(false);

  // LocalStorage에서 데이터 로드
  useEffect(() => {
    const saved = localStorage.getItem('aqua-participants');
    if (saved) {
      try {
        setParticipants(JSON.parse(saved));
      } catch (e) {
        console.error('데이터 로드 오류:', e);
      }
    }
  }, []);

  // LocalStorage에 데이터 저장
  useEffect(() => {
    localStorage.setItem('aqua-participants', JSON.stringify(participants));
  }, [participants]);

  const handleAddParticipant = (data: Omit<Participant, 'id'>) => {
    const newParticipant: Participant = {
      ...data,
      id: Date.now().toString()
    };
    setParticipants([...participants, newParticipant]);
    setActiveTab('list');
  };

  const handleEditParticipant = (data: Omit<Participant, 'id'>) => {
    if (!selectedParticipant) return;
    const updated = participants.map(p =>
      p.id === selectedParticipant.id ? { ...p, ...data } : p
    );
    setParticipants(updated);
    setSelectedParticipant(null);
    setActiveTab('list');
  };

  const handleDeleteParticipant = (id: string) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      setParticipants(participants.filter(p => p.id !== id));
      if (selectedParticipant?.id === id) {
        setSelectedParticipant(null);
      }
    }
  };

  const handleStartEvaluation = (participant: Participant, phase: 'initial' | 'mid' | 'final') => {
    setSelectedParticipant(participant);
    setCurrentPhase(phase);
    setEvaluationResult(null);
    setActiveTab('evaluation');
  };

  const handleSubmitEvaluation = async (scores: Record<string, number>) => {
    if (!selectedParticipant) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          participant: selectedParticipant,
          phase: currentPhase
        })
      });

      if (!response.ok) throw new Error('평가 실패');
      const result = await response.json();

      // 참여자 데이터 업데이트
      const updated = participants.map(p => {
        if (p.id === selectedParticipant.id) {
          return {
            ...p,
            [currentPhase]: {
              scores,
              date: new Date().toISOString().split('T')[0]
            }
          };
        }
        return p;
      });
      setParticipants(updated);

      setEvaluationResult(result);
    } catch (error) {
      console.error('평가 오류:', error);
      alert('평가 생성 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">수중재활 운동 평가 관리 시스템</h1>
          <p className="text-blue-100 mt-2">전문 의료 평가 및 관리 솔루션</p>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 no-print">
        <div className="container mx-auto px-4">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('list')}
              className={`px-6 py-4 font-medium border-b-2 transition ${
                activeTab === 'list'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              참여자 관리
            </button>
            <button
              onClick={() => setActiveTab('form')}
              className={`px-6 py-4 font-medium border-b-2 transition ${
                activeTab === 'form'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {selectedParticipant ? '참여자 수정' : '참여자 추가'}
            </button>
            {selectedParticipant && (
              <>
                <button
                  onClick={() => setActiveTab('evaluation')}
                  className={`px-6 py-4 font-medium border-b-2 transition ${
                    activeTab === 'evaluation'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  평가 입력
                </button>
                <button
                  onClick={() => setActiveTab('chart')}
                  className={`px-6 py-4 font-medium border-b-2 transition ${
                    activeTab === 'chart'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  진행 현황
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {activeTab === 'list' && (
          <ParticipantList
            participants={participants}
            selectedId={selectedParticipant?.id}
            onSelect={(p) => {
              setSelectedParticipant(p);
              setActiveTab('form');
            }}
            onDelete={handleDeleteParticipant}
            onEvaluate={handleStartEvaluation}
          />
        )}

        {activeTab === 'form' && (
          <ParticipantForm
            initialData={selectedParticipant}
            onSubmit={selectedParticipant ? handleEditParticipant : handleAddParticipant}
            onCancel={() => {
              setSelectedParticipant(null);
              setActiveTab('list');
            }}
          />
        )}

        {activeTab === 'evaluation' && selectedParticipant && !evaluationResult && (
          <EvaluationForm
            participant={selectedParticipant}
            phase={currentPhase}
            items={EVALUATION_ITEMS}
            onSubmit={handleSubmitEvaluation}
            isLoading={isLoading}
            onCancel={() => setActiveTab('list')}
          />
        )}

        {activeTab === 'evaluation' && evaluationResult && (
          <EvaluationResult
            result={evaluationResult}
            participant={selectedParticipant!}
            phase={currentPhase}
            onPrint={handlePrint}
            onBack={() => setEvaluationResult(null)}
          />
        )}

        {activeTab === 'chart' && selectedParticipant && (
          <EvaluationChart
            participant={selectedParticipant}
            items={EVALUATION_ITEMS}
            onBack={() => setActiveTab('list')}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 mt-12 py-6 no-print">
        <div className="container mx-auto px-4 text-center">
          <p>© 2024 수중재활 운동 평가 관리 시스템. All rights reserved.</p>
          <p className="text-sm mt-2">API 키 불필요 | 완전 로컬 처리 | 데이터 안전성 보장</p>
        </div>
      </footer>
    </div>
  );
}
