import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Auth from "../../pages/Auth";
import Table from "../../pages/Table";

export const AppRouter = () => (
  <Router>
    <Routes>
      <Route path="/login" element={<Auth />} />
      <Route path="/table" element={<Table />} />
      <Route path="*" element={<Auth />} />
    </Routes>
  </Router>
);
