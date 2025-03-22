import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../api/authApi";
import { loginSuccess } from "../app/store/slices/authSlice";
import { TextField, Button, Box } from "@mui/material";
import Loader from "../shared/components/Spiner";
import CustomModal from "../shared/components/Modal";

const Auth: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const token = await login(username, password);
      dispatch(loginSuccess({ token, username }));
      localStorage.setItem("token", token);
      navigate("/table");
    } catch {
      setError("Ошибка авторизации. Проверьте данные и попробуйте снова.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
      <h2>Авторизация</h2>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Логин"
          variant="outlined"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Пароль"
          type="password"
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          margin="normal"
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={isLoading}
        >
          Войти
        </Button>
      </form>

      {isLoading && <Loader />}
      
      <CustomModal
        open={Boolean(error)}
        onClose={() => setError(null)}
        title="Ошибка"
      >
        {error}
      </CustomModal>
    </Box>
  );
};

export default Auth;
