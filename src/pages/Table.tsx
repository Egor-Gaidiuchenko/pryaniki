import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";
import { deleteDocument, fetchTableData } from "../app/store/slices/tableSlice";
import { DocumentProps } from "../app/types";
import { useAppDispatch } from "../app/store/hooks";
import { useNavigate } from "react-router-dom";
import EditDocument from "../features/editDocument/editDocument";
import CustomTable from "../shared/components/Table";
import AddDocumentForm from "../features/addDocument/addDocumentForrm";
import Loader from "../shared/components/Spiner";
import CustomModal from "../shared/components/Modal";
import { Box, Button } from "@mui/material";

const Table: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { token } = useSelector((state: RootState) => state.auth);
  const { data } = useSelector((state: RootState) => state.table);
  const [editMode, setEditMode] = useState(false);
  const [editEntry, setEditEntry] = useState<DocumentProps | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!token) return;
    
    setIsLoading(true);
    setErrorMessage(null);
    
    try {
      await dispatch(fetchTableData(token)).unwrap();
    } catch {
      setErrorMessage("Ошибка при загрузке данных.");
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, token]);

  useEffect(() => {
    if (!token) {
      navigate("/auth");
    } else {
      loadData();
    }
  }, [token, loadData, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/auth");
  };

  const handleDelete = async (id: string) => {
    const updatedData = data.filter((item) => item.id !== id);
    dispatch({
      type: 'table/fetchData/fulfilled',
      payload: updatedData,
    });
  
    setErrorMessage(null);
  
    try {
      await dispatch(deleteDocument({ token, id })).unwrap();
    } catch {
      setErrorMessage("Ошибка при удалении документа.");
      dispatch({
        type: 'table/fetchData/fulfilled',
        payload: data,
      });
    } finally {
      setIsLoading(false);
    }
  };
  

  const handleEditItem = (item: DocumentProps) => {
    setEditEntry(item);
    setEditMode(true); 
  };

  const handleCloseModal = () => {
    setEditMode(false);
    setEditEntry(null); 
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" mt={4} px={4}>
      <h2>Таблица документов</h2>

      {isLoading && <Loader />}

      {!isLoading && data.length > 0 ? (
        <CustomTable data={data} onDelete={handleDelete} onEdit={handleEditItem} />
      ) : !isLoading ? (
        <p>Данные не найдены</p>
      ) : null}

      <CustomModal open={Boolean(errorMessage)} onClose={() => setErrorMessage(null)} title="Ошибка">
        {errorMessage}
      </CustomModal>

      {editMode && editEntry && (
        <CustomModal open={editMode} onClose={handleCloseModal} title="Редактировать документ">
          <EditDocument
            document={editEntry}
            onCancel={handleCloseModal}
            token={token}
          />
        </CustomModal>
      )}
      
      <AddDocumentForm token={token || ""} />

      <Button 
        onClick={handleLogout} 
        variant="contained" 
        color="secondary" 
        sx={{ my: 2 }}
      >
        Логаут
      </Button>
    </Box>
  );
};

export default Table;
