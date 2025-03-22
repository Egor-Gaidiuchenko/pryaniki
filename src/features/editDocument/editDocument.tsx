import React, { useState, useEffect } from 'react';
import { DocumentProps, EditDocumentProps } from '../../app/types';
import { editDocument } from '../../app/store/slices/tableSlice';
import { useAppDispatch, useAppSelector } from '../../app/store/hooks';
import { Box, TextField, Button } from '@mui/material';
import Loader from '../../shared/components/Spiner';
import CustomModal from '../../shared/components/Modal';
import { RootState } from '../../app/store';

const EditDocument: React.FC<EditDocumentProps> = ({ document, onCancel, token }) => {
  const [editEntry, setEditEntry] = useState<DocumentProps>(document);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const data = useAppSelector((state: RootState) => state.table.data);

  useEffect(() => {
    setEditEntry(document);
  }, [document]);

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    if (
      !editEntry.documentName ||
      !editEntry.documentStatus ||
      !editEntry.documentType ||
      !editEntry.employeeNumber ||
      !editEntry.companySignatureName ||
      !editEntry.employeeSignatureName
    ) {
      setErrorMessage('Пожалуйста, заполните все обязательные поля.');
      setIsLoading(false);
      return;
    }

    if (editEntry && editEntry.id && token) {
      const updatedData = data.map((item) =>
        item.id === editEntry.id ? { ...item, ...editEntry } : item
      );

      dispatch({
        type: 'table/fetchData/fulfilled',
        payload: updatedData
      });

      dispatch(editDocument({ token, id: editEntry.id, entry: editEntry }))
        .then(() => {
          onCancel();
        })
        .catch(() => {
          setErrorMessage('Ошибка при редактировании документа.');

          dispatch({
            type: 'table/fetchData/fulfilled',
            payload: data,
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" p={3} sx={{ width: 400 }}>
      <form onSubmit={handleEditSubmit} style={{ width: '100%' }}>
        <TextField
          label="Название документа"
          variant="outlined"
          value={editEntry.documentName}
          onChange={(e) =>
            setEditEntry({
              ...editEntry,
              documentName: e.target.value,
            })
          }
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Статус документа"
          variant="outlined"
          value={editEntry.documentStatus}
          onChange={(e) =>
            setEditEntry({
              ...editEntry,
              documentStatus: e.target.value,
            })
          }
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Тип документа"
          variant="outlined"
          value={editEntry.documentType}
          onChange={(e) =>
            setEditEntry({
              ...editEntry,
              documentType: e.target.value,
            })
          }
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Номер сотрудника"
          variant="outlined"
          value={editEntry.employeeNumber}
          onChange={(e) =>
            setEditEntry({
              ...editEntry,
              employeeNumber: e.target.value,
            })
          }
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Имя подписанта компании"
          variant="outlined"
          value={editEntry.companySignatureName}
          onChange={(e) =>
            setEditEntry({
              ...editEntry,
              companySignatureName: e.target.value,
            })
          }
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Имя сотрудника"
          variant="outlined"
          value={editEntry.employeeSignatureName}
          onChange={(e) =>
            setEditEntry({
              ...editEntry,
              employeeSignatureName: e.target.value,
            })
          }
          fullWidth
          margin="normal"
          required
        />
        <Box display="flex" gap={2} mt={2}>
          <Button type="submit" variant="contained" color="primary" fullWidth disabled={isLoading}>
            Сохранить
          </Button>
          <Button type="button" variant="outlined" color="secondary" fullWidth onClick={onCancel}>
            Отменить
          </Button>
        </Box>
      </form>

      {isLoading && <Loader />}

      <CustomModal open={Boolean(errorMessage)} onClose={() => setErrorMessage(null)} title="Ошибка">
        {errorMessage}
      </CustomModal>
    </Box>
  );
};

export default EditDocument;
