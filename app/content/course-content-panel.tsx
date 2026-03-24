"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import styles from "./course-content-panel.module.css";

  type Course = { id: string; title: string; description?: string };
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch courses from Supabase (replace with your actual table/logic)
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      setError("");
      try {
        // Replace 'courses' with your actual table name
        const { data, error } = await supabase.from('courses').select('*');
        if (error) throw error;
        setCourses(data || []);
      } catch {
        setError("Unable to fetch courses. Please check your Supabase table and permissions.");
      }
      setLoading(false);
    };
    fetchCourses();
  }, []);

  return (
    <div className={styles.coursePanel}>
      <h3>Course & Content Management</h3>
      {loading && <div>Loading courses...</div>}
      {error && <div className={styles.courseError}>{error}</div>}
      {!loading && !error && (
        <table className={styles.courseTable}>
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
                <td className={styles.courseActions}>
                  {/* Add actions: Edit, Delete */}
                  <button disabled>Edit</button>
                  <button disabled>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className={styles.courseAdd}>
        <button disabled>Add Course (Coming Soon)</button>
      </div>
      <p className={styles.courseNote}>
        Note: CRUD actions should be implemented with proper Supabase RLS and permissions.
      </p>
    </div>
  );
}

export default CourseContentPanel;
