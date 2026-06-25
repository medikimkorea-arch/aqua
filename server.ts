import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// 평가 의견 생성 함수 (API 없이 로컬에서 처리)
function generateEvaluationOpinion(participant: any, phase: string) {
  const phaseTimeline = participant?.[phase] || { scores: {} };
  const scores = phaseTimeline.scores || {};

  const itemsMap: Record<string, string> = {
    entry: '수중 입수/퇴수 조절',
    water_face: '얼굴 물 적시기',
    walking: '수중 보행 및 중심 복원',
    immersion: '어깨/턱 신체 침수',
    exhalation_oral: '입으로 기포 만들기',
    exhalation_nasal: '코/입 날숨 연계 (음-파)',
    rhythmic_breathing: '보행-호흡 연동',
    supine_float: '등 조력 뜨기',
    prone_float: '엎드려 전면 뜨기',
    recovery_stand: '부체 후 일어서기',
    leg_kick: '발차기 추진력',
    arm_stroke: '팔로 물 밀어내기',
    independent_propulsion: '자율 전진 이동성',
    instruction_following: '교육 규칙 준수',
    fear_mastery: '불안 심리 안정도',
    self_regulation: '수중 자가 조절력'
  };

  // 점수 분석
  const lowScores: string[] = [];
  const highScores: string[] = [];
  let totalScore = 0;
  let scoreCount = 0;

  for (const [key, val] of Object.entries(scores)) {
    const num = Number(val);
    totalScore += num;
    scoreCount++;
    
    if (num <= 2 && itemsMap[key]) {
      lowScores.push(itemsMap[key]);
    } else if (num >= 4 && itemsMap[key]) {
      highScores.push(itemsMap[key]);
    }
  }

  const averageScore = scoreCount > 0 ? (totalScore / scoreCount).toFixed(1) : '0';

  // 1. 수중 적응 분석
  let adaptationText = "";
  if (phase === 'initial') {
    if (Number(averageScore) >= 3.5) {
      adaptationText = `입수 단계에서 물에 대한 적응력이 양호함. 강습에 참여하는 자세가 긍정적이며, 기본적인 안전 지침을 잘 이해하고 따르고 있음.`;
    } else if (Number(averageScore) >= 2.5) {
      adaptationText = `입수 단계에서 경미한 불안감과 긴장이 관찰됨. 물에 대한 적응 과정이 진행 중이며, 지속적인 격려와 보조가 필요함.`;
    } else {
      adaptationText = `입수 단계에서 상당한 불안감과 방어 기제가 확인됨. 안전 밀착 방어 체계를 확립하고 점진적 적응을 도모해야 함.`;
    }
  } else if (phase === 'mid') {
    if (Number(averageScore) >= 3.5) {
      adaptationText = `강습 중반기 세션 진행에 따라 물에 대한 심리적 거부 반응이 현저히 경감됨. 수중 보행 및 자세 안정성이 개선되고 있음.`;
    } else if (Number(averageScore) >= 2.5) {
      adaptationText = `강습 중반기 점진적 진전을 보이고 있으나, 아직 일부 항목에서 불안감이 남아있음. 특화된 보조 훈련이 필요함.`;
    } else {
      adaptationText = `강습 중반기에도 불안감이 지속되고 있음. 더욱 세심한 접근과 개별 맞춤형 훈련이 요구됨.`;
    }
  } else {
    if (Number(averageScore) >= 4) {
      adaptationText = `종결 단계 완수 시점에서 물에 대한 공포감을 완전히 극복하고 정서 안정감을 획득함. 자율적 수중 활동이 가능한 수준에 도달함.`;
    } else if (Number(averageScore) >= 3) {
      adaptationText = `종결 단계에서 상당한 진전을 이루었으나, 일부 영역에서는 추가 훈련이 필요함. 전반적인 수중 적응 능력이 향상됨.`;
    } else {
      adaptationText = `종결 단계에서도 일부 불안감이 남아있음. 향후 지속적인 관리와 보조가 필요함.`;
    }
  }

  // 2. 기술 진척 분석
  let skillAnalysis = "";
  if (highScores.length > 0) {
    const top3 = highScores.slice(0, 3).join(', ');
    skillAnalysis += `강점 분석: ${top3} 영역에서 탁월한 수행 능력을 보여줌. `;
  }
  if (lowScores.length > 0) {
    const bottom3 = lowScores.slice(0, 3).join(', ');
    skillAnalysis += `극복 과제: ${bottom3} 영역에서의 개선이 필요하며, 특화된 훈련을 통한 발전을 기대함.`;
  } else if (highScores.length === 0) {
    skillAnalysis = `전 영역에 걸쳐 균형잡힌 발달을 보이고 있음.`;
  }

  // 3. 종합 의견
  let summaryText = "";
  const disability = participant?.disabilityName || "발달장애";
  const specialNotes = participant?.specialNotes || "별도 주의사항 없음";

  if (phase === 'initial') {
    summaryText = `${disability} 특성을 고려하여 안전 중심의 접근을 지속함. 점진적 적응을 통해 물에 대한 공포감을 경감할 것으로 기대됨.`;
  } else if (phase === 'mid') {
    summaryText = `훈련 과정에서 긍정적 변화가 관찰되고 있음. 현재의 접근 방식을 유지하되, 약점 영역에 대한 집중 훈련을 강화할 것을 권장함.`;
  } else {
    summaryText = `훈련 기간을 통해 유의미한 발전을 이루었음. 추후 정기적인 보수 훈련과 모니터링을 통해 획득한 능력을 유지 및 향상시킬 것을 권장함.`;
  }

  const generalOpinion = `${adaptationText}\n\n${skillAnalysis}\n\n${summaryText}`;

  // 4. 사후관리 계획
  let aftercareList: string[] = [];
  if (phase === 'initial') {
    aftercareList = [
      `1. 정기 추적 관찰: 온수 치료 전용 수조(31~33°C)에서 주 2회, 40분 세션으로 수중 적응 감각 통합 훈련을 지속 추진함.`,
      `2. 운동 연계 제언: 일상생활 속 물 경험(샤워, 머리감기 등)과 수중 훈련을 연계하여 점진적 공포 감소를 도모함.`,
      `3. 주의 및 안전 수칙: 안전 장구(부력보조 도구, 보호 장비) 착용을 필수로 하며, 1:1 보조 지도자 밀착 지원을 유지함.`
    ];
  } else if (phase === 'mid') {
    aftercareList = [
      `1. 정기 추적 관찰: 진행 상황을 월 1회 평가하여 훈련 계획을 조정하고, 취약 영역에 집중 훈련을 배정함.`,
      `2. 운동 연계 제언: 보행-호흡 연동 훈련을 규칙적으로 반복하여 기포음 발성과 자세 제어력을 강화함.`,
      `3. 주의 및 안전 수칙: 피로도 상승에 따른 근경직 발생을 대비하여, 훈련 후 온수 샤워 및 스트레칭을 병행함.`
    ];
  } else {
    aftercareList = [
      `1. 정기 추적 관찰: 분기별 1회 평가 모니터링을 통해 획득 능력의 유지 상태를 확인하고 필요시 보충 훈련을 실시함.`,
      `2. 운동 연계 제언: 독립적 수중 활동 능력을 유지하기 위해 월 1~2회 수중 운동 참여를 지속적으로 권장함.`,
      `3. 주의 및 안전 수칙: 오픈 수상 시설 이용 시 보호자 또는 지도자 동반을 필수로 하며, 정기적인 안전 교육을 실시함.`
    ];
  }

  const aftercare = aftercareList.join('\n');

  return { generalOpinion, aftercare, averageScore };
}

// API Routes
app.post("/api/evaluate", (req, res) => {
  try {
    const { participant, phase } = req.body;

   // Gemini Summarize API Route (새로 추가)
app.post("/api/gemini/summarize", (req, res) => {
  ...
  res.json({
    summary: result.generalOpinion,
    aftercare: result.aftercare,
    score: result.averageScore,
    success: true
  });
});
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const publicPath = path.join(process.cwd(), 'dist/public');
    app.use(express.static(publicPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(publicPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`✅ 서버 시작: http://localhost:${PORT}`);
  });
}

startServer();
