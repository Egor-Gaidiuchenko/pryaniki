import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { DocumentProps } from "../../types";

const HOST = "https://test.v5.pryaniky.com";

export const fetchTableData = createAsyncThunk<DocumentProps[], string>(
    "table/fetchData",
    async (token, { rejectWithValue }) => {
        try {
        const response = await fetch(`${HOST}/ru/data/v3/testmethods/docs/userdocs/get`, {
            method: "GET",
            headers: {
            "Content-Type": "application/json",
            "x-auth": token,
            },
        });

        const data = await response.json();
        return data.data as DocumentProps[]; 
        } catch {
        return rejectWithValue("Ошибка при загрузке данных");
        }
    }
);

export const addDocument = createAsyncThunk<DocumentProps, { token: string; entry: DocumentProps }>(
    "table/addDocument",
    async ({ token, entry }, { rejectWithValue }) => {
        try {
        const response = await fetch(`${HOST}/ru/data/v3/testmethods/docs/userdocs/create`, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            "x-auth": token,
            },
            body: JSON.stringify(entry),
        });

        if (!response.ok) throw new Error("Ошибка при добавлении записи");

        return entry;

        } catch {
            return rejectWithValue("Ошибка при добавлении записи");
        }
    }
);

export const editDocument = createAsyncThunk<
  DocumentProps,
  { token: string; id: string; entry: DocumentProps }
>(
  "table/editDocument",
  async ({ token, id, entry }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${HOST}/ru/data/v3/testmethods/docs/userdocs/set/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-auth": token,
          },
          body: JSON.stringify(entry),
        }
      );

      if (!response.ok) throw new Error("Ошибка при изменении записи");

      const data = await response.json();
      return data.data;
    } catch {
      return rejectWithValue("Ошибка при изменении записи");
    }
  }
);


export const deleteDocument = createAsyncThunk<string, { token: string; id: string }>(
    "table/deleteDocument",
    async ({ token, id }, { rejectWithValue }) => {
      try {
        const response = await fetch(`${HOST}/ru/data/v3/testmethods/docs/userdocs/delete/${id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-auth": token,
          },
        });
  
        if (!response.ok) throw new Error("Ошибка при удалении записи");
  
        return id;
  
      } catch {
        return rejectWithValue("Ошибка при удалении записи");
      }
    }
);

const tableSlice = createSlice({
    name: "table",
    initialState: { data: [] as DocumentProps[], status: "idle", error: null },
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(fetchTableData.fulfilled, (state, action) => {
            state.data = action.payload;
            state.status = "succeeded";
        })
        .addCase(addDocument.fulfilled, (state, action) => {
            state.data.push(action.payload);
        })
        .addCase(editDocument.fulfilled, (state, action) => {
            const index = state.data.findIndex((item) => item.id === action.payload.id);
            if (index !== -1) {
              state.data[index] = action.payload;
            }
          })
        .addCase(deleteDocument.fulfilled, (state, action) => {
            state.data = state.data.filter(item => item.id !== action.payload);
        });
    },
});

export default tableSlice.reducer;