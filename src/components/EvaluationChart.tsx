import React from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { ChevronLeft } from 'lucide-react';

interface EvaluationChartProps {
  participant: any;
  items: Array<{ key: string; label: string }>;
  onBack: () => void;
}

export default function EvaluationChart({ participant, items, onBack }: EvaluationChartProps) {
  // 단계별 데이터 준비
  const phaseData = [
    { phase: '초기', data: participant.initial?.scores || {} },
    { phase: '중간', data: participant.mid?.scores || {} },
    { phase: '종결', data: participant.final?.scores || {} }
  ];

  // 라인 차트 데이터 (각 항목별 진행)
  const lineChartData = items.map(item => {
    const dataPoint: any = { name: item.label };
    phaseData.forEach(({ phase, data }) => {
      dataPoint[phase] = data[item.key] || null;
    });
    return dataPoint;
  });

  // 평균 점수 추이
  const averageData = phaseData.map(({ phase, data }) => {
    const scores = Object.values(data).filter(v => typeof v === 'number');
    const average = scores.length > 0 ? (scores.reduce((a: number, b: any) => a + b, 0) / scores.length).toFixed(1) : 0;
    return { phase, average: parseFloat(average as string) };
  });

  // 레이더 차트 데이터 (최신 평가)
  const latestPhase = participant.final?.scores ? 'final' : participant.mid?.scores ? 'mid' : participant.initial?.scores ? 'initial' : null;
  const radarData = latestPhase
    ? items.map(item => ({
        name: item.label.substring(0, 8),
        score: participant[latestPhase]?.scores?.[item.key] || 0,
        fullName: item.label
      }))
    : [];

  // 항목별 평균
  const itemAverages = items.map(item => {
    const scores = phaseData
      .map(({ data }) => data[item.key])
      .filter(v => typeof v === 'number');
    const avg = scores.length > 0 ? (scores.reduce((a: any, b: any) => a + b, 0) / scores.length).toFixed(1) : 0;
    return {
      name: item.label.substring(0, 10),
      average: parseFloat(avg as string),
      fullName: item.label
    };
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <button
          onClick={onBack}
          className="mb-4 text-blue-600 hover:text-blue-800 flex items-center gap-2"
        >
          <ChevronLeft size={20} />
          돌아가기
        </button>
        <h2 className="text-2xl font-bold text-gray-800">{participant.name} - 평가 진행 현황</h2>
        <p className="text-gray-600 mt-2">3단계 평가의 발전 추이를 시각화합니다</p>
      </div>

      {/* Average Score Trend */}
      {averageData.some(d => d.average > 0) && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">평균 점수 추이</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={averageData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="phase" />
              <YAxis domain={[0, 5]} />
              <Tooltip 
                formatter={(value) => value.toFixed(1)}
                labelFormatter={(label) => `${label}`}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="average"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: '#3b82f6', r: 6 }}
                activeDot={{ r: 8 }}
                name="평균 점수"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Item Averages Bar Chart */}
      {itemAverages.some(d => d.average > 0) && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">항목별 평균 점수</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={itemAverages} layout="vertical" margin={{ left: 150, right: 30 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 5]} />
              <YAxis dataKey="name" type="category" width={140} />
              <Tooltip 
                formatter={(value) => value.toFixed(1)}
                cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
              />
              <Bar dataKey="average" fill="#3b82f6" name="평균 점수" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Latest Phase Radar */}
      {radarData.length > 0 && radarData.some(d => d.score > 0) && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            최근 평가 프로필 (
            {latestPhase === 'final' ? '종결' : latestPhase === 'mid' ? '중간' : '초기'}
            )
          </h3>
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="name" />
              <PolarRadiusAxis angle={90} domain={[0, 5]} />
              <Radar
                name="점수"
                dataKey="score"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.6}
              />
              <Tooltip formatter={(value) => value.toFixed(1)} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Phase Comparison */}
      {lineChartData.filter(d => Object.values(d).some(v => typeof v === 'number')).length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">단계별 진행 비교</h3>
          <div className="overflow-x-auto">
            <ResponsiveContainer width="100%" height={350} minWidth={500}>
              <LineChart data={lineChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} interval={0} />
                <YAxis domain={[0, 5]} />
                <Tooltip formatter={(value) => typeof value === 'number' ? value.toFixed(1) : value} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="초기"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={false}
                  connectNulls
                  name="초기"
                />
                <Line
                  type="monotone"
                  dataKey="중간"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={false}
                  connectNulls
                  name="중간"
                />
                <Line
                  type="monotone"
                  dataKey="종결"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={false}
                  connectNulls
                  name="종결"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!participant.initial && !participant.mid && !participant.final && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
          <p className="text-gray-600 mb-4">아직 평가 데이터가 없습니다.</p>
          <p className="text-sm text-gray-500">평가를 입력한 후 차트를 확인할 수 있습니다.</p>
        </div>
      )}
    </div>
  );
}
