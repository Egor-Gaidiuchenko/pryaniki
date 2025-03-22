import React, { useState } from "react";
import { addDocument } from "../../app/store/slices/tableSlice";
import { DocumentProps } from "../../app/types";
import { useAppDispatch, useAppSelector } from "../../app/store/hooks";
import { Box, TextField, Button } from "@mui/material";
import Loader from "../../shared/components/Spiner";
import CustomModal from "../../shared/components/Modal";

const AddDocumentForm: React.FC<{ token: string }> = ({ token }) => {
  const dispatch = useAppDispatch();
  const { data } = useAppSelector((state) => state.table);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [newEntry, setNewEntry] = useState<DocumentProps>({
    companySigDate: new Date().toISOString(),
    companySignatureName: "",
    documentName: "",
    documentStatus: "",
    documentType: "",
    employeeNumber: "",
    employeeSigDate: new Date().toISOString(),
    employeeSignatureName: "",
    id: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    if (
      !newEntry.documentName 
      // !newEntry.documentStatus ||
      // !newEntry.documentType ||
      // !newEntry.employeeNumber ||
      // !newEntry.companySignatureName ||
      // !newEntry.employeeSignatureName
    ) {
      setErrorMessage("Пожалуйста, заполните все обязательные поля.");
      setIsLoading(false);
      return;
    }

    const updatedData = [...data, newEntry];
    dispatch({
      type: "table/fetchData/fulfilled",
      payload: updatedData,
    });

    try {
      await dispatch(addDocument({ token, entry: newEntry })).unwrap();
      setNewEntry({
        companySigDate: new Date().toISOString(),
        companySignatureName: "",
        documentName: "",
        documentStatus: "",
        documentType: "",
        employeeNumber: "",
        employeeSigDate: new Date().toISOString(),
        employeeSignatureName: "",
        id: ""
      });
    } catch {
      dispatch({
        type: "table/fetchData/fulfilled",
        payload: data,
      });

      setErrorMessage("Ошибка при добавлении документа.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
      <h3>Добавить документ</h3>
      <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: 400 }}>
        <TextField
          fullWidth
          label="Название документа"
          variant="outlined"
          value={newEntry.documentName}
          onChange={(e) => setNewEntry({ ...newEntry, documentName: e.target.value })}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Статус документа"
          variant="outlined"
          value={newEntry.documentStatus}
          onChange={(e) => setNewEntry({ ...newEntry, documentStatus: e.target.value })}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Тип документа"
          variant="outlined"
          value={newEntry.documentType}
          onChange={(e) => setNewEntry({ ...newEntry, documentType: e.target.value })}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Номер сотрудника"
          variant="outlined"
          value={newEntry.employeeNumber}
          onChange={(e) => setNewEntry({ ...newEntry, employeeNumber: e.target.value })}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Имя подписанта компании"
          variant="outlined"
          value={newEntry.companySignatureName}
          onChange={(e) => setNewEntry({ ...newEntry, companySignatureName: e.target.value })}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Имя сотрудника"
          variant="outlined"
          value={newEntry.employeeSignatureName}
          onChange={(e) => setNewEntry({ ...newEntry, employeeSignatureName: e.target.value })}
          margin="normal"
          required
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={isLoading}
        >
          Добавить
        </Button>
      </form>

      {isLoading && <Loader />}

      <CustomModal open={Boolean(errorMessage)} onClose={() => setErrorMessage(null)} title="Ошибка">
        {errorMessage}
      </CustomModal>
    </Box>
  );
};

export default AddDocumentForm;
