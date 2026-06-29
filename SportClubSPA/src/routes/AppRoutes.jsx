import ClassSchedulesPage from "../pages/classSchedules/ClassSchedulesPage";
import RoomsPage from "../pages/admin/RoomsPage"
import AssignPage from "../pages/admin/AssignPage"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "../pages/Home"
import Login from "../pages/Login"
import Register from "../pages/Register"
import RecoverPassword from "../pages/RecoverPassword"
import Profile from "../pages/Profile"
import Unauthorized from "../pages/Unauthorized"
import UserDashboard from "../pages/user/UserDashboard"
import CoachDashboard from "../pages/coach/CoachDashboard"
import AdminDashboard from "../pages/admin/AdminDashboard"
import UsersPage from "../pages/admin/UsersPage"
import SportsPage from "../pages/admin/SportsPage"
import UserLayout from "../layouts/UserLayout"
import CoachLayout from "../layouts/CoachLayout"
import AdminLayout from "../layouts/AdminLayout"
import ProtectedRoute from "./ProtectedRoute"
import RoleRoute from "./RoleRoute"

// ✅ Nuevos imports
import MyClassesPage from "../pages/coach/MyClassesPage"
import MySchedulePage from "../pages/coach/MySchedulePage"
import AvailableClassesPage from "../pages/user/AvailableClassesPage"
import MyReservationsPage from "../pages/user/MyReservationsPage"

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/recuperar" element={<RecoverPassword />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        <Route
          path="/perfil"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user"
          element={
            <RoleRoute allowedRoles={["user"]}>
              <UserLayout />
            </RoleRoute>
          }
        >
          <Route path="dashboard" element={<UserDashboard />} />
          {/* ✅ Nuevas rutas de usuario */}
          <Route path="classes" element={<AvailableClassesPage />} />
          <Route path="reservations" element={<MyReservationsPage />} />
        </Route>

        <Route
          path="/coach"
          element={
            <RoleRoute allowedRoles={["coach"]}>
              <CoachLayout />
            </RoleRoute>
          }
        >
          <Route path="dashboard" element={<CoachDashboard />} />
          {/* ✅ Nuevas rutas de coach */}
          <Route path="my-classes" element={<MyClassesPage />} />
          <Route path="my-schedule" element={<MySchedulePage />} />
        </Route>

        <Route
          path="/admin"
          element={
            <RoleRoute allowedRoles={["admin"]}>
              <AdminLayout />
            </RoleRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="sports" element={<SportsPage />} />
          <Route path="rooms" element={<RoomsPage />} />
          <Route path="assign" element={<AssignPage />} />
          <Route path="schedules" element={<ClassSchedulesPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes
