import { Outlet, useNavigate } from "react-router-dom"
import SiteFooter from "../components/SiteFooter"
import SiteHeader from "../components/SiteHeader"
import { logout } from "../services/authService"

function UserLayout() {
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <div className="page-user">
      <SiteHeader
        links={[
          { to: "/", label: "Inicio" },
          { to: "/user/dashboard", label: "Dashboard" },
          { to: "/perfil", label: "Mi perfil" },
          { to: "/user/classes", label: "Clases" },
          { to: "/user/reservations", label: "Reservas" },
          { to: "#", label: "Mi Progreso", external: true },
        ]}
        showLogout
        onLogout={handleLogout}
      />
      <main>
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  )
}

export default UserLayout