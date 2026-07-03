import { useEffect, useState } from "react"
import { getDisplayName, getUser } from "../../services/authService"
import { getMyClasses, getMySchedules } from "../../services/coachService"

function CoachDashboard() {
  const user = getUser()
  const displayName = getDisplayName(user)
  const [classes, setClasses] = useState([])
  const [schedules, setSchedules] = useState([])

  useEffect(() => {
    const load = async () => {
      try {
        const [cls, sch] = await Promise.all([getMyClasses(), getMySchedules()])
        setClasses(Array.isArray(cls.data) ? cls.data : [])
        setSchedules(Array.isArray(sch.data) ? sch.data : [])
      } catch {
        console.error("Error cargando datos del coach")
      }
    }
    load()
  }, [])

  return (
    <>
      <h2>Dashboard Coach</h2>
      <p className="dashboard-welcome">
        Sesión iniciada como: <strong>{displayName}</strong> ({user?.email})
      </p>

      <section className="dashboard-panel">
        <div className="panel">
          <h3>Mis Clases</h3>
          {classes.length === 0 ? (
            <p>No tienes clases asignadas</p>
          ) : (
            classes.map(item => (
              <p key={item.id}>
                {item.sport?.name ?? "—"} - {item.room?.name ?? "—"}
              </p>
            ))
          )}
        </div>

        <div className="panel">
          <h3>Mi Horario</h3>
          {schedules.length === 0 ? (
            <p>No tienes horarios asignados</p>
          ) : (
            schedules.map(item => (
              <p key={item.id} className="text-capitalize">
                {item.day_of_week ?? "—"} - {item.sportRoom?.sport?.name ?? item.sport?.name ?? "—"} {item.start_time}
              </p>
            ))
          )}
        </div>

        <div className="panel">
          <h3>Reportes</h3>
          <p>Ver detalles de progreso</p>
        </div>
      </section>
    </>
  )
}

export default CoachDashboard
