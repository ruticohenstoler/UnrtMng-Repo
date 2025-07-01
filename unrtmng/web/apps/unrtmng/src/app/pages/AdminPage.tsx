import React, { useState, useEffect } from 'react';

const initialTabs = ['חיים', 'רכב', 'דירה'];

export default function AdminPage() {
  const [tabs, setTabs] = useState<string[]>(initialTabs);
  const [newTab, setNewTab] = useState('');
  const [users, setUsers] = useState<string[]>([]);
  const [newUser, setNewUser] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch('/ms/rest/unrtmng/admin/tabs').then(r => r.ok ? r.json() : initialTabs),
      fetch('/ms/rest/unrtmng/admin/users').then(r => r.ok ? r.json() : [])
    ])
      .then(([tabsData, usersData]) => {
        setTabs(Array.isArray(tabsData) ? tabsData : initialTabs);
        setUsers(Array.isArray(usersData) ? usersData : []);
      })
      .catch(() => setError('שגיאה בטעינת נתונים'))
      .finally(() => setLoading(false));
  }, []);

  const saveTabs = async () => {
    setLoading(true);
    setError(null);
    try {
      await fetch('/ms/rest/unrtmng/admin/tabs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tabs)
      });
    } catch {
      setError('שגיאה בשמירת טאבים');
    } finally {
      setLoading(false);
    }
  };

  const saveUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      await fetch('/ms/rest/unrtmng/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(users)
      });
    } catch {
      setError('שגיאה בשמירת משתמשים');
    } finally {
      setLoading(false);
    }
  };

  const addTab = () => {
    if (newTab && !tabs.includes(newTab)) {
      setTabs([...tabs, newTab]);
      setNewTab('');
    }
  };

  const removeTab = (tab: string) => {
    setTabs(tabs.filter(t => t !== tab));
  };

  const addUser = () => {
    if (newUser && !users.includes(newUser)) {
      setUsers([...users, newUser]);
      setNewUser('');
    }
  };

  const removeUser = (user: string) => {
    setUsers(users.filter(u => u !== user));
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>ניהול טאבים</h2>
      {error && <div style={{color: 'red'}}>{error}</div>}
      {loading && <div>טוען...</div>}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input
          type="text"
          placeholder="הוסף טאב"
          value={newTab}
          onChange={e => setNewTab(e.target.value)}
        />
        <button onClick={addTab}>הוסף</button>
        <button onClick={saveTabs}>שמור טאבים</button>
      </div>
      <ul>
        {tabs.map(tab => (
          <li key={tab} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>{tab}</span>
            <button onClick={() => removeTab(tab)}>הסר</button>
          </li>
        ))}
      </ul>

      <h2 style={{ marginTop: 32 }}>ניהול משתמשים</h2>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input
          type="email"
          placeholder="הוסף כתובת מייל"
          value={newUser}
          onChange={e => setNewUser(e.target.value)}
        />
        <button onClick={addUser}>הוסף</button>
        <button onClick={saveUsers}>שמור משתמשים</button>
      </div>
      <ul>
        {users.map(user => (
          <li key={user} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>{user}</span>
            <button onClick={() => removeUser(user)}>הסר</button>
          </li>
        ))}
      </ul>
    </div>
  );
} 