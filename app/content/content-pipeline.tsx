"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

const statusColors = {
  submitted: '#fffde7',
  review: '#e3f2fd',
  approved: '#e8f5e9',
  published: '#f9fbe7',
  rejected: '#ffebee',
};

export default function ContentPipelinePanel() {
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newContent, setNewContent] = useState({ title: '', status: 'submitted' });

  useEffect(() => {
    fetchContents();
  }, []);

  const fetchContents = async () => {
    setLoading(true);
    setError("");
    try {
      const { data, error } = await supabase.from('content_pipeline').select('*');
      if (error) throw error;
      setContents(data || []);
    } catch (err) {
      setError("Unable to fetch content pipeline. Please check your Supabase table and permissions.");
    }
    setLoading(false);
  };

  const handleAddContent = async (e) => {
    e.preventDefault();
    if (!newContent.title) return;
    const { error } = await supabase.from('content_pipeline').insert([newContent]);
    if (!error) {
      setNewContent({ title: '', status: 'submitted' });
      fetchContents();
    }
  };

  const handleStatusChange = async (id, status) => {
    await supabase.from('content_pipeline').update({ status }).eq('id', id);
    fetchContents();
  };

  return (
    <div style={{ marginTop: 24, background: '#e3f2fd', padding: 16, borderRadius: 8 }}>
      <h3>Content Pipeline</h3>
      <form onSubmit={handleAddContent} style={{ marginBottom: 16 }}>
        <input
          placeholder="Title"
          value={newContent.title}
          onChange={e => setNewContent(c => ({ ...c, title: e.target.value }))}
          style={{ marginRight: 8 }}
        />
        <button type="submit">Submit</button>
      </form>
      {loading && <div>Loading content pipeline...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <table style={{ width: '100%', marginTop: 12 }}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {contents.map(content => (
            <tr key={content.id} style={{ background: statusColors[content.status] || '#fff' }}>
              <td>{content.title}</td>
              <td>{content.status}</td>
              <td>
                <button onClick={() => handleStatusChange(content.id, 'review')}>Review</button>
                <button onClick={() => handleStatusChange(content.id, 'approved')}>Approve</button>
                <button onClick={() => handleStatusChange(content.id, 'published')}>Publish</button>
                <button onClick={() => handleStatusChange(content.id, 'rejected')}>Reject</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
