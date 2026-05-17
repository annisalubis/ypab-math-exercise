export const Sheets = {
  async submitResults(studentName, studentClass, topic, results, score) {
    try {
      await fetch('/api/sheets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: studentName,
          class: studentClass,
          topic,
          score: `${score}/${results.length}`,
          timestamp: new Date().toISOString(),
          questions: results.map((r) => ({
            question: r.text,
            studentAnswer: r.studentAnswer,
            correctAnswer: r.correctAnswerText,
            correct: r.correct,
          })),
        }),
      });
      return { ok: true };
    } catch (e) {
      console.error('Sheets error:', e);
      return { ok: false, error: e.message };
    }
  },
};
