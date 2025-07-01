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
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

interface ColumnDefinition {
  id: string;
  name: string;
  displayName: string;
  type: string;
  required: boolean;
  visible: boolean;
  order: number;
  options?: string;
}

const ColumnsManagement: React.FC = () => {
  const [columns, setColumns] = useState<ColumnDefinition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingColumn, setEditingColumn] = useState<ColumnDefinition | null>(null);
  const [formData, setFormData] = useState<Partial<ColumnDefinition>>({});

  const columnTypes = [
    { value: 'text', label: 'טקסט' },
    { value: 'date', label: 'תאריך' },
    { value: 'number', label: 'מספר' },
    { value: 'boolean', label: 'בוליאני' },
    { value: 'select', label: 'רשימה נפתחת' }
  ];

  useEffect(() => {
    loadColumns();
  }, []);

  const loadColumns = async () => {
    try {
      setLoading(true);
      const response = await fetch('/ms/rest/unrtmng/columns');
      
      if (!response.ok) {
        throw new Error('שגיאה בטעינת עמודות');
      }

      const data = await response.json();
      setColumns(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'שגיאה לא ידועה');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingColumn(null);
    setFormData({
      name: '',
      displayName: '',
      type: 'text',
      required: false,
      visible: true,
      order: columns.length + 1
    });
    setOpenDialog(true);
  };

  const handleEdit = (column: ColumnDefinition) => {
    setEditingColumn(column);
    setFormData(column);
    setOpenDialog(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('האם אתה בטוח שברצונך למחוק עמודה זו?')) {
      return;
    }

    try {
      const response = await fetch(`/ms/rest/unrtmng/columns/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await loadColumns();
      } else {
        throw new Error('שגיאה במחיקת עמודה');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'שגיאה לא ידועה');
    }
  };

  const handleSave = async () => {
    try {
      const url = editingColumn 
        ? `/ms/rest/unrtmng/columns/${editingColumn.id}`
        : '/ms/rest/unrtmng/columns';
      
      const method = editingColumn ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setOpenDialog(false);
        await loadColumns();
      } else {
        throw new Error('שגיאה בשמירת עמודה');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'שגיאה לא ידועה');
    }
  };

  const handleVisibilityChange = async (column: ColumnDefinition) => {
    try {
      const updatedColumn = { ...column, visible: !column.visible };
      const response = await fetch(`/ms/rest/unrtmng/columns/${column.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedColumn)
      });

      if (response.ok) {
        await loadColumns();
      } else {
        throw new Error('שגיאה בעדכון נראות');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'שגיאה לא ידועה');
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
        <Typography variant="h4">ניהול עמודות</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAdd}
        >
          הוספת עמודה
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
              <TableCell>שם עמודה</TableCell>
              <TableCell>כותרת תצוגה</TableCell>
              <TableCell>סוג</TableCell>
              <TableCell>חובה</TableCell>
              <TableCell>נראה</TableCell>
              <TableCell>סדר</TableCell>
              <TableCell>פעולות</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {columns.map((column) => (
              <TableRow key={column.id}>
                <TableCell>{column.name}</TableCell>
                <TableCell>{column.displayName}</TableCell>
                <TableCell>
                  {columnTypes.find(t => t.value === column.type)?.label || column.type}
                </TableCell>
                <TableCell>{column.required ? 'כן' : 'לא'}</TableCell>
                <TableCell>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={column.visible}
                        onChange={() => handleVisibilityChange(column)}
                      />
                    }
                    label=""
                  />
                </TableCell>
                <TableCell>{column.order}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(column)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(column.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingColumn ? 'עריכת עמודה' : 'הוספת עמודה חדשה'}
        </DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField
              label="שם עמודה (באנגלית)"
              value={formData.name || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              fullWidth
              required
            />
            <TextField
              label="כותרת תצוגה"
              value={formData.displayName || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
              fullWidth
              required
            />
            <FormControl fullWidth>
              <InputLabel>סוג עמודה</InputLabel>
              <Select
                value={formData.type || 'text'}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                label="סוג עמודה"
              >
                {columnTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="סדר"
              type="number"
              value={formData.order || 1}
              onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) }))}
              fullWidth
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formData.required || false}
                  onChange={(e) => setFormData(prev => ({ ...prev, required: e.target.checked }))}
                />
              }
              label="שדה חובה"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formData.visible !== false}
                  onChange={(e) => setFormData(prev => ({ ...prev, visible: e.target.checked }))}
                />
              }
              label="נראה בטבלה"
            />
            {formData.type === 'select' && (
              <TextField
                label="אפשרויות (מופרדות בפסיקים)"
                value={formData.options || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, options: e.target.value }))}
                fullWidth
                multiline
                rows={3}
                helperText="לדוגמה: אפשרות 1, אפשרות 2, אפשרות 3"
              />
            )}
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

export default ColumnsManagement; 