import { CONFIG } from './config.js';

export const Sheets = {
  async submitResults(studentName, studentClass, topic, results, score) {
    if (!CONFIG.sheetsUrl) { console.warn('Google Sheets URL not configured'); return { ok: false, error: 'Not configured' }; }
    try {
      await fetch(CONFIG.sheetsUrl, { method: 'POST', body: JSON.stringify({
        name: studentName, class: studentClass, topic,
        score: `${score}/${results.length}`,
        timestamp: new Date().toISOString(),
        questions: results.map(r => ({ question: r.text, studentAnswer: r.studentAnswer, correctAnswer: r.correctAnswerText, correct: r.correct }))
      })});
      return { ok: true };
    } catch (e) { console.error('Sheets error:', e); return { ok: false, error: e.message }; }
  }
};
