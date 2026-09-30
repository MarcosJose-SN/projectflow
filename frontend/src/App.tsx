import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Projetos from "./pages/Projetos";
import Tarefas from "./pages/Tarefas";
import Relatorios from "./pages/Relatorios";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/projetos" element={<Projetos />} />
          <Route path="/tarefas" element={<Tarefas />} />
          <Route path="/relatorios" element={<Relatorios />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;