import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";

// Admin Pages
import Dashboard from "./admin/pages/Dashboard";
import LaporanAdmin from "./admin/pages/LaporanAdmin";
import Users from "./admin/pages/Users";
import PengaduanDetail from "./admin/pages/PengaduanDetail";


// User Pages
import {
  UserLayout,
  DashboardPage,
  LaporanPage,
  UbahProfilPage,
  GantiPasswordPage,
} from "./user";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />

          {/* Admin Routes */}

          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/laporan" element={<LaporanAdmin />} />
          <Route path="/admin/users" element={<Users />} />
          <Route path="/admin/pengaduan/:id" element={<PengaduanDetail />} />

          {/* User Routes */}
          <Route path="/user" element={<UserLayout />}>
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="laporan" element={<LaporanPage />} />
            <Route path="profil" element={<UbahProfilPage />} />
            <Route path="password" element={<GantiPasswordPage />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
