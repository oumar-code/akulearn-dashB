export default CourseManagementPanel;
"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import styles from "./course-management.module.css";

  type Course = { id: string; title: string; description?: string };
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    setError("");
    try {
      const { data, error } = await supabase.from('courses').select('*');
      if (error) throw error;
      setCourses(data || []);
    } catch (err) {
      setError("Unable to fetch courses. Please check your Supabase table and permissions.");
    }
    setLoading(false);
  };

  const handleAddCourse = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title) return;
    const { error } = await supabase.from('courses').insert([{ title, description }]);
    if (!error) {
      setTitle("");
      setDescription("");
      fetchCourses();
    }
  };

  const handleDelete = async (id: string) => {
    await supabase.from('courses').delete().eq('id', id);
    fetchCourses();
  };

  return (
    <div className={styles.courseMgmtPanel}>
      <h3>Course Management</h3>
      <form onSubmit={handleAddCourse} className={styles.courseMgmtForm}>
        <input
          className={styles.courseMgmtInput}
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <input
          className={styles.courseMgmtInput}
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
        <button type="submit">Add Course</button>
      </form>
      {loading && <div>Loading courses...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <table style={{ width: '100%', marginTop: 12 }}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.map(course => (
            <tr key={course.id}>
              <td>{course.title}</td>
              <td>{course.description}</td>
              <td>
                <button onClick={() => handleDelete(course.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
