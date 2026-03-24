"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import styles from "./student-teacher-dashboard.module.css";

type Student = {
  id: string;
  name: string;
  email: string;
  progress_percent?: number;
  exam_ready?: boolean;
};
type Teacher = {
  id: string;
  name: string;
  email: string;
  assignments?: number;
};

export default function StudentTeacherDashboard() {
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      // Replace with your actual tables and logic
      const { data: studentData, error: studentError } = await supabase.from('students').select('*');
      const { data: teacherData, error: teacherError } = await supabase.from('teachers').select('*');
      if (studentError || teacherError) throw studentError || teacherError;
      setStudents(studentData || []);
      setTeachers(teacherData || []);
    } catch (err) {
      setError("Unable to fetch dashboard data. Please check your Supabase tables and permissions.");
    }
    setLoading(false);
  };

  return (
    <div className={styles.dashboardBox}>
      <h3>Student/Teacher Dashboard</h3>
      {loading && <div>Loading dashboard...</div>}
      {error && <div className={styles.errorText}>{error}</div>}
      <div className={styles.flexRow}>
        <div className={styles.flexCol}>
          <h4>Students</h4>
          <table className={styles.tableFull}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Progress</th>
                <th>Exam Ready</th>
              </tr>
            </thead>
            <tbody>
              {students.map(s => (
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td>{s.email}</td>
                  <td>{s.progress_percent || 0}%</td>
                  <td>{s.exam_ready ? 'Yes' : 'No'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className={styles.flexCol}>
          <h4>Teachers</h4>
          <table className={styles.tableFull}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Assignments</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map(t => (
                <tr key={t.id}>
                  <td>{t.name}</td>
                  <td>{t.email}</td>
                  <td>{t.assignments || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
