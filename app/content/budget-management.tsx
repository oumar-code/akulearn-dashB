"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function BudgetManagementPanel() {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newBudget, setNewBudget] = useState({ item: '', amount: '', status: 'pending' });

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    setLoading(true);
    setError("");
    try {
      const { data, error } = await supabase.from('budgets').select('*');
      if (error) throw error;
      setBudgets(data || []);
    } catch (err) {
      setError("Unable to fetch budgets. Please check your Supabase table and permissions.");
    }
    setLoading(false);
  };

  const handleAddBudget = async (e) => {
    e.preventDefault();
    if (!newBudget.item || !newBudget.amount) return;
    const { error } = await supabase.from('budgets').insert([newBudget]);
    if (!error) {
      setNewBudget({ item: '', amount: '', status: 'pending' });
      fetchBudgets();
    }
  };

  const handleStatusChange = async (id, status) => {
    await supabase.from('budgets').update({ status }).eq('id', id);
    fetchBudgets();
  };

  return (
    <div style={{ marginTop: 24, background: '#fce4ec', padding: 16, borderRadius: 8 }}>
      <h3>Budget Management</h3>
      <form onSubmit={handleAddBudget} style={{ marginBottom: 16 }}>
        <input
          placeholder="Item"
          value={newBudget.item}
          onChange={e => setNewBudget(b => ({ ...b, item: e.target.value }))}
          style={{ marginRight: 8 }}
        />
        <input
          placeholder="Amount"
          type="number"
          value={newBudget.amount}
          onChange={e => setNewBudget(b => ({ ...b, amount: e.target.value }))}
          style={{ marginRight: 8 }}
        />
        <button type="submit">Add</button>
      </form>
      {loading && <div>Loading budgets...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <table style={{ width: '100%', marginTop: 12 }}>
        <thead>
          <tr>
            <th>Item</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {budgets.map(budget => (
            <tr key={budget.id}>
              <td>{budget.item}</td>
              <td>{budget.amount}</td>
              <td>{budget.status}</td>
              <td>
                <button onClick={() => handleStatusChange(budget.id, 'approved')}>Approve</button>
                <button onClick={() => handleStatusChange(budget.id, 'rejected')}>Reject</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
