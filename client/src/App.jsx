import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import RFQDetails from "./pages/RFQDetails";
import CreateRFQ from "./pages/CreateRFQ";
import EditRFQ from "./pages/EditRFQ";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={
            <Register />
          }
        />

        {/* Private */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/rfq/:id"
          element={
            <ProtectedRoute>
              <RFQDetails />
            </ProtectedRoute>
          }
        />

        <Route
  path="/create-rfq"
  element={
    <ProtectedRoute allowedRoles={["buyer"]}>
      <CreateRFQ />
    </ProtectedRoute>
  }
/>

<Route
  path="/edit-rfq/:id"
  element={
    <ProtectedRoute allowedRoles={["buyer"]}>
      <EditRFQ />
    </ProtectedRoute>
  }
/>

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route
          path="*"
          element={
            <NotFound />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}