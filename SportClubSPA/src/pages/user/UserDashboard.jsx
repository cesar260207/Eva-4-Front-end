import { useEffect, useState } from "react"
import { getDisplayName, getUser } from "../../services/authService"
import { getAvailableClasses } from "../../services/memberService"
import { getMyReservations } from "../../services/reservationService"

function UserDashboard() {
  const user = getUser()
  const displayName = getDisplayName(user)
  const [classes, setClasses] = useState([])
  const [reservations, setReservations] = useState([])

  useEffect(() => {
    const load = async () => {
      try {
        const [cls, res] = await Promise.all([getAvailableClasses(), getMyReservations()])

        // Aplanar clases con schedules
        const flat = []
        const data = Array.isArray(cls.data) ? cls.data : []
        data.forEach(item => {
          if (item.schedules && item.schedules.length > 0) {
            item.schedules.forEach(sch => {
              flat.push({
                id: sch.id,
                deporte: item.sport?.name ?? "—",
                dia: sch.day_of_week ?? "—",
                hora: sch.start_time ?? "—"
              })
            })
          }
        })
        setClasses(flat.slice(0, 4)) // Mostrar solo 4 en el dashboard
        setReservations(Array.isArray(res.data) ? res.data.slice(0, 4) : [])
      } catch {
        console.error("Error cargando datos del usuario")
      }
    }
    load()
  }, [])

  return (
    <>
      <h2>Dashboard Usuario</h2>
      <p className="dashboard-welcome">
        Sesión iniciada como: <strong>{displayName}</strong>
      </p>

      <section className="dashboard-panel">
        <div className="panel">
          <h3>Mi Perfil</h3>
          <p>Nombre: <span>{displayName}</span></p>
          <p>Email: <span>{user?.email}</span></p>
        </div>

        <div className="panel">
          <h3>Clases Disponibles</h3>
          {classes.length === 0 ? (
            <p>No hay clases disponibles</p>
          ) : (
            classes.map(item => (
              <p key={item.id} className="text-capitalize">
                {item.deporte} - {item.dia} {item.hora}
              </p>
            ))
          )}
        </div>

        <div className="panel">
          <h3>Mis Reservas</h3>
          {reservations.length === 0 ? (
            <p>No tienes reservas activas</p>
          ) : (
            reservations.map(res => {
              const sch = res.classSchedule ?? res.class_schedule ?? {}
              const sportRoom = sch.sportRoom ?? {}
              return (
                <p key={res.id} className="text-capitalize">
                  {sportRoom?.sport?.name ?? "—"} - {sch.day_of_week ?? "—"} ({res.status ?? "—"})
                </p>
              )
            })
          )}
        </div>
      </section>
    </>
  )
}

export default UserDashboard