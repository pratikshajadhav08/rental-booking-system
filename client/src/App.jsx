import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Home from "./pages/Home";
import Listings from "./pages/listings/Listings";
import ListingDetails from "./pages/listings/ListingDetails";
import MyBookings from "./pages/bookings/MyBookings";
import Favorites from "./pages/favorites/Favorites";
import Profile from "./pages/Profile";
import About from "./pages/About";
import Contact from "./pages/Contact";
import HostDashboard from "./pages/Host/HostDashboard";
import AddProperty from "./pages/Host/AddProperty";
import HostListings from "./pages/Host/HostListings";
import HostBookings from "./pages/Host/HostBookings";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/Users";
import AdminListings from "./pages/admin/Listings";
import AdminBookings from "./pages/admin/Bookings";
import AdminReviews from "./pages/admin/Reviews";
import AdminReports from "./pages/admin/Reports";
import { getDashboardPath } from "./utils/roleRedirect";
import Footer from "./components/Footer";

function ProtectedRoute({ children, roles }) {
  const user = JSON.parse(localStorage.getItem("userInfo") || "null");

  if (!user) return <Navigate to="/login" replace />;

  if (roles?.length && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function RoleHome() {
  const user = JSON.parse(localStorage.getItem("userInfo") || "null");

  if (user?.role === "host" || user?.role === "admin") {
    return <Navigate to={getDashboardPath(user.role)} replace />;
  }

  return <Home />;
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<RoleHome />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/listings" element={<Listings />} />
            <Route path="/listings/:id" element={<ListingDetails />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />

            <Route
              path="/bookings"
              element={
                <ProtectedRoute roles={["user", "admin"]}>
                  <MyBookings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/favorites"
              element={
                <ProtectedRoute>
                  <Favorites />
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

            <Route
              path="/host/dashboard"
              element={
                <ProtectedRoute roles={["host", "admin"]}>
                  <HostDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/host/HostDashboard" element={<Navigate to="/host/dashboard" replace />} />
            <Route
              path="/host/add-property"
              element={
                <ProtectedRoute roles={["host", "admin"]}>
                  <AddProperty />
                </ProtectedRoute>
              }
            />
            <Route path="/host/new" element={<Navigate to="/host/add-property" replace />} />
            <Route
              path="/host/listings"
              element={
                <ProtectedRoute roles={["host", "admin"]}>
                  <HostListings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/host/bookings"
              element={
                <ProtectedRoute roles={["host", "admin"]}>
                  <HostBookings />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <AdminUsers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/listings"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <AdminListings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/bookings"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <AdminBookings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/reviews"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <AdminReviews />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/reports"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <AdminReports />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
