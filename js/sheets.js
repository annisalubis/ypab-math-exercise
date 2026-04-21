const Sheets = (() => {
  const send = async (data) => {
    if (!CONFIG.sheetsUrl) {
      console.warn('Google Sheets URL not configured in config.js');
      return { ok: false, error: 'Not configured' };
    }
    try {
      const res = await fetch(CONFIG.sheetsUrl, {
        method: 'POST',
        body: JSON.stringify(data)
      });
      return { ok: true };
    } catch (e) {
      console.error('Sheets error:', e);
      return { ok: false, error: e.message };
    }
  };

  const submitResults = (studentName, studentClass, topic, results, score) => {
    return send({
      name: studentName,
      class: studentClass,
      topic,
      score: `${score}/${results.length}`,
      timestamp: new Date().toISOString(),
      questions: results.map(r => ({
        question: r.text,
        studentAnswer: r.studentAnswer,
        correctAnswer: r.correctAnswerText,
        correct: r.correct
      }))
    });
  };

  return { submitResults };
})();
