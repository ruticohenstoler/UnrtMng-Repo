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
  CircularProgress
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
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
  values: Record<string, any>;
  lastUpdateDate: string;
}

const DecisionsTable: React.FC = () => {
  const [decisions, setDecisions] = useState<UnderwritingDecision[]>([]);
  const [columns, setColumns] = useState<ColumnDefinition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingDecision, setEditingDecision] = useState<UnderwritingDecision | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [columnsResponse, decisionsResponse] = await Promise.all([
        fetch('/ms/rest/unrtmng/columns/visible'),
        fetch('/ms/rest/unrtmng/decisions')
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
      const response = await fetch(`/ms/rest/unrtmng/decisions/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await loadData();
      } else {
        throw new Error('שגיאה במחיקת החלטה');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'שגיאה לא ידועה');
    }
  };

  const handleSave = async () => {
    try {
      const url = editingDecision 
        ? `/ms/rest/unrtmng/decisions/${editingDecision.id}`
        : '/ms/rest/unrtmng/decisions';
      
      const method = editingDecision ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: editingDecision?.id,
          values: formData
        })
      });

      if (response.ok) {
        setOpenDialog(false);
        await loadData();
      } else {
        throw new Error('שגיאה בשמירת החלטה');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'שגיאה לא ידועה');
    }
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

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">ניהול החלטות חיתום</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAdd}
        >
          הוספת החלטה
        </Button>
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
                <TableCell key={column.id}>
                  {column.displayName}
                </TableCell>
              ))}
              <TableCell>פעולות</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {decisions.map((decision) => (
              <TableRow key={decision.id}>
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