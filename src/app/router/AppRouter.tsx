import { Route, Routes, HashRouter } from "react-router-dom";
import Auth from "../../pages/Auth";
import Table from "../../pages/Table";

export const AppRouter = () => (
  <HashRouter>
    <Routes>
      app
      <Route path="/login" element={<Auth />} />
      <Route path="/table" element={<Table />} />
      <Route path="*" element={<Auth />} />
    </Routes>
  </HashRouter>
);
