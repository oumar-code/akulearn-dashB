"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function QuizTopicManagement() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newQuiz, setNewQuiz] = useState({ title: '', subject: '', assigned_to: '' });

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    setLoading(true);
    setError("");
    try {
      const { data, error } = await supabase.from('quizzes').select('*');
      if (error) throw error;
      setQuizzes(data || []);
    } catch (err) {
      setError("Unable to fetch quizzes. Please check your Supabase table and permissions.");
    }
    setLoading(false);
  };

  const handleAddQuiz = async (e) => {
    e.preventDefault();
    if (!newQuiz.title || !newQuiz.subject) return;
    const { error } = await supabase.from('quizzes').insert([newQuiz]);
    if (!error) {
      setNewQuiz({ title: '', subject: '', assigned_to: '' });
      fetchQuizzes();
    }
  };

  const handleDelete = async (id) => {
    await supabase.from('quizzes').delete().eq('id', id);
    fetchQuizzes();
  };

  return (
    <div style={{ marginTop: 24, background: '#e3f2fd', padding: 16, borderRadius: 8 }}>
      <h3>Quiz/Topic Management</h3>
      <form onSubmit={handleAddQuiz} style={{ marginBottom: 16 }}>
        <input
          placeholder="Title"
          value={newQuiz.title}
          onChange={e => setNewQuiz(q => ({ ...q, title: e.target.value }))}
          style={{ marginRight: 8 }}
        />
        <input
          placeholder="Subject"
          value={newQuiz.subject}
          onChange={e => setNewQuiz(q => ({ ...q, subject: e.target.value }))}
          style={{ marginRight: 8 }}
        />
        <input
          placeholder="Assign to (student email)"
          value={newQuiz.assigned_to}
          onChange={e => setNewQuiz(q => ({ ...q, assigned_to: e.target.value }))}
          style={{ marginRight: 8 }}
        />
        <button type="submit">Add Quiz</button>
      </form>
      {loading && <div>Loading quizzes...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <table style={{ width: '100%', marginTop: 12 }}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Subject</th>
            <th>Assigned To</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {quizzes.map(quiz => (
            <tr key={quiz.id}>
              <td>{quiz.title}</td>
              <td>{quiz.subject}</td>
              <td>{quiz.assigned_to}</td>
              <td>
                <button onClick={() => handleDelete(quiz.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
