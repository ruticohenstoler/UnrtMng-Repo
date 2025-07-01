import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Tabs,
  Tab
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Upload as UploadIcon } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import * as XLSX from 'xlsx';
//import { he } from 'date-fns/locale';

interface ColumnDefinition {
  id: string;
  name: string;
  displayName: string;
  type: string;
  required: boolean;
  visible: boolean;
  order: number;
}

interface UnderwritingDecision {
  id: string;
  tab: string;
  values: Record<string, any>;
  lastUpdateDate: string;
  active?: boolean;
}

type TabDef = { id: string; name: string };

const DecisionsTable: React.FC = () => {
  const [decisions, setDecisions] = useState<UnderwritingDecision[]>([]);
  const [columns, setColumns] = useState<ColumnDefinition[]>([]);
  const [tabs, setTabs] = useState<TabDef[]>([]);
  const [selectedTab, setSelectedTab] = useState<TabDef | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingDecision, setEditingDecision] = useState<UnderwritingDecision | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [showInactive, setShowInactive] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [searchTerms, setSearchTerms] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch('/ms/rest/unrtmng/admin/tabs')
      .then(r => r.ok ? r.json() : [])
      .then((data) => {
        setTabs(data);
        setSelectedTab(data[0] || null);
      });
  }, []);

  useEffect(() => {
    if (selectedTab) {
      loadData(selectedTab.id);
    }
  }, [selectedTab]);

  const loadData = async (tabId: string) => {
    try {
      setLoading(true);
      const [columnsResponse, decisionsResponse] = await Promise.all([
        fetch('/ms/rest/unrtmng/columns/visible'),
        fetch(`/ms/rest/unrtmng/decisions?tab=${encodeURIComponent(tabId)}`)
      ]);

      if (!columnsResponse.ok || !decisionsResponse.ok) {
        throw new Error('שגיאה בטעינת נתונים');
      }

      const columnsData = await columnsResponse.json();
      const decisionsData = await decisionsResponse.json();

      setColumns(columnsData);
      setDecisions(decisionsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'שגיאה לא ידועה');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingDecision(null);
    setFormData({});
    setOpenDialog(true);
  };

  const handleEdit = (decision: UnderwritingDecision) => {
    setEditingDecision(decision);
    setFormData(decision.values);
    setOpenDialog(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('האם אתה בטוח שברצונך למחוק החלטה זו?')) {
      return;
    }
    try {
      // שליפת ההחלטה לעדכון
      const decision = decisions.find(d => d.id === id);
      if (!decision) throw new Error('החלטה לא נמצאה');
      const updated = { ...decision, active: false };
      const response = await fetch(`/ms/rest/unrtmng/decisions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      if (response.ok) {
        await loadData(selectedTab?.id || '');
      } else {
        throw new Error('שגיאה במחיקת החלטה');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'שגיאה לא ידועה');
    }
  };

  const handleSave = async () => {
    if (!selectedTab) return;
    try {
      const url = editingDecision 
        ? `/ms/rest/unrtmng/decisions/${editingDecision.id}`
        : '/ms/rest/unrtmng/decisions';
      const method = editingDecision ? 'PUT' : 'POST';
      const body: any = {
        id: editingDecision?.id,
        tab: selectedTab.id,
        values: formData
      };
      if (editingDecision?.active !== undefined) {
        body.active = editingDecision.active;
      }
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });
      if (response.ok) {
        setOpenDialog(false);
        await loadData(selectedTab.id);
      } else {
        throw new Error('שגיאה בשמירת החלטה');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'שגיאה לא ידועה');
    }
  };

  const handleImportExcel = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const data = await readExcelFile(file);
      await importDecisions(data);
      event.target.value = '';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'שגיאה בייבוא קובץ אקסל');
    }
  };

  const readExcelFile = (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          resolve(jsonData);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  const importDecisions = async (excelData: any[]) => {
    if (!selectedTab) return;
    const decisions = excelData.map((row, index) => ({
      id: `imported_${Date.now()}_${index}`,
      values: row,
      lastUpdateDate: new Date().toISOString(),
      tab: selectedTab.id
    }));

    for (const decision of decisions) {
      await fetch(`/ms/rest/unrtmng/decisions?tab=${encodeURIComponent(selectedTab.id)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(decision)
      });
    }

    await loadData(selectedTab.id);
  };

  const renderCell = (decision: UnderwritingDecision, column: ColumnDefinition) => {
    const value = decision.values[column.name];
    
    if (value == null) return '-';
    
    switch (column.type) {
      case 'date':
        return new Date(value).toLocaleDateString('he-IL');
      case 'boolean':
        return value ? 'כן' : 'לא';
      default:
        return String(value);
    }
  };

  const renderFormField = (column: ColumnDefinition) => {
    const value = formData[column.name];
    
    switch (column.type) {
      case 'date':
        return (
          /*<LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={he}>*/
            <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label={column.displayName}
              value={value ? new Date(value) : null}
              onChange={(newValue) => {
                setFormData(prev => ({
                  ...prev,
                  [column.name]: newValue?.toISOString().split('T')[0]
                }));
              }}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </LocalizationProvider>
        );
      case 'boolean':
        return (
          <TextField
            select
            label={column.displayName}
            value={value || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, [column.name]: e.target.value === 'true' }))}
            fullWidth
          >
            <option value="true">כן</option>
            <option value="false">לא</option>
          </TextField>
        );
      default:
        return (
          <TextField
            label={column.displayName}
            value={value || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, [column.name]: e.target.value }))}
            fullWidth
            required={column.required}
          />
        );
    }
  };

  const handleSort = (columnName: string) => {
    if (sortBy === columnName) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(columnName);
      setSortDirection('asc');
    }
  };

  const handleSearchChange = (columnName: string, value: string) => {
    setSearchTerms(prev => ({ ...prev, [columnName]: value }));
  };

  const filteredDecisions = decisions
    .filter(decision => showInactive ? decision.active === false : decision.active !== false)
    .filter(decision =>
      columns.every(col => {
        const term = searchTerms[col.name]?.toLowerCase() || '';
        if (!term) return true;
        const value = String(decision.values[col.name] ?? '').toLowerCase();
        return value.includes(term);
      })
    );

  const sortedDecisions = sortBy
    ? [...filteredDecisions].sort((a, b) => {
        const aValue = a.values[sortBy] ?? '';
        const bValue = b.values[sortBy] ?? '';
        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      })
    : filteredDecisions;

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Tabs
        value={selectedTab?.id || ''}
        onChange={(_, v) => setSelectedTab(tabs.find(t => t.id === v) || null)}
        sx={{ mb: 2 }}
        variant="scrollable"
        scrollButtons="auto"
      >
        {tabs.map(tab => (
          <Tab key={tab.id} value={tab.id} label={tab.name} />
        ))}
      </Tabs>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">ניהול החלטות חיתום</Typography>
        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            startIcon={<UploadIcon />}
            onClick={() => fileInputRef.current?.click()}
          >
            ייבוא מאקסל
          </Button>
          <Button
            variant={showInactive ? "contained" : "outlined"}
            onClick={() => setShowInactive(!showInactive)}
          >
            {showInactive ? 'הצג פעילים' : 'הצג לא פעילים'}
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAdd}
          >
            הוספת החלטה
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.id} onClick={() => handleSort(column.name)} style={{ cursor: 'pointer' }}>
                  {column.displayName}
                  {sortBy === column.name && (sortDirection === 'asc' ? ' ▲' : ' ▼')}
                </TableCell>
              ))}
              <TableCell>פעולות</TableCell>
            </TableRow>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.id}>
                  <TextField
                    size="small"
                    placeholder="חיפוש..."
                    value={searchTerms[column.name] || ''}
                    onChange={e => handleSearchChange(column.name, e.target.value)}
                    fullWidth
                  />
                </TableCell>
              ))}
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedDecisions.map((decision) => (
              <TableRow key={decision.id} sx={{
                opacity: decision.active === false ? 0.6 : 1,
                backgroundColor: decision.active === false ? '#f5f5f5' : 'inherit'
              }}>
                {columns.map((column) => (
                  <TableCell key={column.id}>
                    {renderCell(decision, column)}
                  </TableCell>
                ))}
                <TableCell>
                  <IconButton onClick={() => handleEdit(decision)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(decision.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept=".xlsx,.xls"
        onChange={handleImportExcel}
      />

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingDecision ? 'עריכת החלטה' : 'הוספת החלטה חדשה'}
        </DialogTitle>
        <DialogContent>
          <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={2} mt={1}>
            {columns.map((column) => (
              <Box key={column.id}>
                {renderFormField(column)}
              </Box>
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>ביטול</Button>
          <Button onClick={handleSave} variant="contained">
            שמור
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DecisionsTable; 