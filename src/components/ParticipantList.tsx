import React from 'react';
import { Plus, Edit2, Trash2, Activity } from 'lucide-react';

interface ParticipantListProps {
  participants: any[];
  selectedId?: string;
  onSelect: (participant: any) => void;
  onDelete: (id: string) => void;
  onEvaluate: (participant: any, phase: 'initial' | 'mid' | 'final') => void;
}

export default function ParticipantList({
  participants,
  selectedId,
  onSelect,
  onDelete,
  onEvaluate
}: ParticipantListProps) {
  const getEvaluationStatus = (participant: any) => {
    const statuses = [];
    if (participant.initial) statuses.push('초기');
    if (participant.mid) statuses.push('중간');
    if (participant.final) statuses.push('종결');
    return statuses.length > 0 ? statuses.join(' > ') : '미평가';
  };

  const getStatusColor = (status: string) => {
    if (status.includes('종결')) return 'bg-green-100 text-green-800';
    if (status.includes('중간')) return 'bg-yellow-100 text-yellow-800';
    if (status.includes('초기')) return 'bg-blue-100 text-blue-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">참여자 관리</h2>
          <p className="text-gray-600 mt-1">총 {participants.length}명의 참여자</p>
        </div>
        <button
          onClick={() => onSelect({ name: '' })}
          className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md font-medium transition flex items-center gap-2"
        >
          <Plus size={20} />
          새 참여자 추가
        </button>
      </div>

      {/* Participants List */}
      {participants.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-500 text-lg mb-4">등록된 참여자가 없습니다.</p>
          <p className="text-gray-400 mb-6">새 참여자를 추가하여 평가를 시작하세요.</p>
          <button
            onClick={() => onSelect({ name: '' })}
            className="px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md font-medium transition inline-flex items-center gap-2"
          >
            <Plus size={20} />
            첫 참여자 추가
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {participants.map(participant => (
            <div
              key={participant.id}
              className={`bg-white rounded-lg shadow-md p-6 border-2 transition cursor-pointer ${
                selectedId === participant.id ? 'border-blue-600 bg-blue-50' : 'border-transparent hover:shadow-lg'
              }`}
              onClick={() => onSelect(participant)}
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800">{participant.name}</h3>
                  <p className="text-sm text-gray-500">
                    {participant.gender} · {participant.birthDate || '미정'}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                  getStatusColor(getEvaluationStatus(participant))
                }`}>
                  {getEvaluationStatus(participant)}
                </span>
              </div>

              {/* Info */}
              <div className="space-y-2 mb-4 text-sm text-gray-600 border-b pb-4">
                <div>
                  <span className="font-medium text-gray-700">장애명:</span> {participant.disabilityName || '미정'}
                </div>
                {participant.specialNotes && (
                  <div>
                    <span className="font-medium text-gray-700">특이사항:</span> {participant.specialNotes}
                  </div>
                )}
              </div>

              {/* Evaluation Buttons */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEvaluate(participant, 'initial');
                  }}
                  className={`py-2 rounded-md text-xs font-medium transition ${
                    participant.initial
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {participant.initial ? '✓ 초기' : '초기 평가'}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEvaluate(participant, 'mid');
                  }}
                  className={`py-2 rounded-md text-xs font-medium transition ${
                    participant.mid
                      ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {participant.mid ? '✓ 중간' : '중간 평가'}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEvaluate(participant, 'final');
                  }}
                  className={`py-2 rounded-md text-xs font-medium transition ${
                    participant.final
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {participant.final ? '✓ 종결' : '종결 평가'}
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4 border-t">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(participant);
                  }}
                  className="flex-1 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-md font-medium transition text-sm flex items-center justify-center gap-2"
                >
                  <Edit2 size={16} />
                  수정
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(participant.id);
                  }}
                  className="flex-1 px-3 py-2 text-red-600 hover:bg-red-50 rounded-md font-medium transition text-sm flex items-center justify-center gap-2"
                >
                  <Trash2 size={16} />
                  삭제
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
