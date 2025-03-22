import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from "@mui/material";
import { Trash2, Edit2 } from "lucide-react";
import { TableProps } from "../../app/types";
import { format } from "date-fns";

const formatDate = (dateString: string) => {
  if (!dateString) return "—";
  try {
    return format(new Date(dateString), "dd.MM.yyyy HH:mm");
  } catch {
    return dateString;
  }
};

const CustomTable = <T extends { id: string }>({ data, onDelete, onEdit }: TableProps<T>) => {
  if (!data.length) return <p>Данные не найдены</p>;

  const columns = Object.keys(data[0]).filter((key) => key !== "id");

  return (
    <TableContainer component={Paper} sx={{ mt: 3, boxShadow: 3, borderRadius: 2 }}>
      <Table sx={{ minWidth: 650 }} aria-label="custom table">
        <TableHead>
          <TableRow>
            {columns.map((col) => (
              <TableCell key={col} sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}>
                {col}
              </TableCell>
            ))}
            <TableCell sx={{ fontWeight: "bold" }}>Действия</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id}>
              {columns.map((col) => (
                <TableCell key={col} sx={{ whiteSpace: "nowrap" }}>
                  {col.includes("Date") ? formatDate(String(item[col as keyof T])) : String(item[col as keyof T])}
                </TableCell>
              ))}
              <TableCell sx={{ whiteSpace: "nowrap" }}>
                <IconButton onClick={() => onEdit(item)} aria-label="Редактировать">
                  <Edit2 size={18} />
                </IconButton>
                <IconButton onClick={() => onDelete(item.id)} aria-label="Удалить">
                  <Trash2 size={18} />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CustomTable;
