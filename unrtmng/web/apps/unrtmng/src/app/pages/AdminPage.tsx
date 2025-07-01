import React, { useState, useEffect } from 'react';

type TabDef = { id: string; name: string };
const initialTabs: TabDef[] = [
  { id: 'life', name: 'חיים' },
  { id: 'car', name: 'רכב' },
  { id: 'home', name: 'דירה' }
];

export default function AdminPage() {
  const [tabs, setTabs] = useState<TabDef[]>(initialTabs);
  const [newTabName, setNewTabName] = useState('');
  const [newTabId, setNewTabId] = useState('');
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
    if (newTabId && newTabName && !tabs.some(t => t.id === newTabId)) {
      setTabs([...tabs, { id: newTabId, name: newTabName }]);
      setNewTabId('');
      setNewTabName('');
    }
  };

  const removeTab = (id: string) => {
    setTabs(tabs.filter(t => t.id !== id));
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
          placeholder="מזהה טאב (אנגלית)"
          value={newTabId}
          onChange={e => setNewTabId(e.target.value)}
        />
        <input
          type="text"
          placeholder="שם טאב (בעברית)"
          value={newTabName}
          onChange={e => setNewTabName(e.target.value)}
        />
        <button onClick={addTab}>הוסף</button>
        <button onClick={saveTabs}>שמור טאבים</button>
      </div>
      <ul>
        {tabs.map(tab => (
          <li key={tab.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>{tab.name} ({tab.id})</span>
            <button onClick={() => removeTab(tab.id)}>הסר</button>
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