import React, { useState } from 'react';
import { Save, X } from 'lucide-react';

interface ParticipantFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export default function ParticipantForm({ initialData, onSubmit, onCancel }: ParticipantFormProps) {
  const [formData, setFormData] = useState(initialData || {
    name: '',
    gender: '남',
    birthDate: '',
    disabilityName: '',
    specialNotes: '',
    waterExperience: '',
    dailyWaterUsage: '',
    longTermGoal: '',
    shortTermGoal: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      alert('이름을 입력해주세요.');
      return;
    }
    onSubmit(formData);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {initialData ? '참여자 정보 수정' : '새 참여자 추가'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 기본 정보 */}
        <div className="border-b pb-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">기본 정보</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">이름 *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="참여자 이름"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">성별</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="남">남</option>
                <option value="여">여</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">생년월일</label>
              <input
                type="date"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">장애명</label>
              <input
                type="text"
                name="disabilityName"
                value={formData.disabilityName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="예: 발달장애, 자폐스펙트럼"
              />
            </div>
          </div>
        </div>

        {/* 수중 관련 정보 */}
        <div className="border-b pb-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">수중 관련 정보</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">수중 참여 경험</label>
              <input
                type="text"
                name="waterExperience"
                value={formData.waterExperience}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="예: 없음, 1년 이상, 처음"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">일상생활 물 사용 정도</label>
              <input
                type="text"
                name="dailyWaterUsage"
                value={formData.dailyWaterUsage}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="예: 매일 샤워, 샤워 회피"
              />
            </div>
          </div>
        </div>

        {/* 훈련 목표 */}
        <div className="border-b pb-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">훈련 목표</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">장기 훈련 목표</label>
              <textarea
                name="longTermGoal"
                value={formData.longTermGoal}
                onChange={handleChange}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="1년 이상의 장기 목표를 입력하세요"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">단기 훈련 목표</label>
              <textarea
                name="shortTermGoal"
                value={formData.shortTermGoal}
                onChange={handleChange}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="3개월 이내의 단기 목표를 입력하세요"
              />
            </div>
          </div>
        </div>

        {/* 특이사항 */}
        <div className="pb-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">기타 정보</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">특이사항</label>
            <textarea
              name="specialNotes"
              value={formData.specialNotes}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="주의사항, 의료 기록, 기타 특이사항"
            />
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex gap-4 justify-end pt-6 border-t">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md font-medium transition"
          >
            <X className="inline mr-2" size={18} />
            취소
          </button>
          <button
            type="submit"
            className="px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md font-medium transition"
          >
            <Save className="inline mr-2" size={18} />
            {initialData ? '수정 저장' : '추가'}
          </button>
        </div>
      </form>
    </div>
  );
}
