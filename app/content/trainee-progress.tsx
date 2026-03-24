"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import dynamic from "next/dynamic";

const ProgressBar = ({ percent }) => (
  <div style={{ background: '#eee', borderRadius: 8, width: 200, height: 16 }}>
    <div style={{ background: '#8bc34a', width: `${percent}%`, height: '100%', borderRadius: 8 }} />
  </div>
);

export default function TraineeProgressTracker() {
  const [trainees, setTrainees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTrainees = async () => {
      setLoading(true);
      setError("");
      try {
        // Replace 'trainee_progress' with your actual table name
        const { data, error } = await supabase.from('trainee_progress').select('*');
        if (error) throw error;
        setTrainees(data || []);
      } catch (err) {
        setError("Unable to fetch trainee progress. Please check your Supabase table and permissions.");
      }
      setLoading(false);
    };
    fetchTrainees();
  }, []);

  return (
    <div style={{ marginTop: 24, background: '#e8f5e9', padding: 16, borderRadius: 8 }}>
      <h3>Trainee Progress Tracker</h3>
      {loading && <div>Loading progress...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <table style={{ width: '100%', marginTop: 12 }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Course</th>
            <th>Progress</th>
          </tr>
        </thead>
        <tbody>
          {trainees.map(t => (
            <tr key={t.id}>
              <td>{t.name}</td>
              <td>{t.course}</td>
              <td><ProgressBar percent={t.progress_percent || 0} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
