import { useEffect, useState } from "react";
import { Card, Table, Spinner, Badge } from "react-bootstrap";
import Swal from "sweetalert2";
import { getMySchedules } from "../../services/coachService";

const DAYS_ORDER = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"];

function MySchedulePage() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getMySchedules();
        const data = Array.isArray(res.data) ? res.data : [];
        // Ordenar por día de la semana
        data.sort(
          (a, b) =>
            DAYS_ORDER.indexOf(a.day_of_week?.toLowerCase()) -
            DAYS_ORDER.indexOf(b.day_of_week?.toLowerCase())
        );
        setSchedules(data);
      } catch {
        Swal.fire("Error", "No se pudo cargar tu horario", "error");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <Card className="shadow-sm">
      <Card.Header>
        <h4 className="mb-0">Mi Horario Semanal</h4>
      </Card.Header>
      <Card.Body>
        {loading ? (
          <div className="text-center py-4">
            <Spinner animation="border" />
          </div>
        ) : schedules.length === 0 ? (
          <p className="text-center text-muted py-3">No tienes horarios asignados</p>
        ) : (
          <Table responsive striped bordered hover>
            <thead>
              <tr>
                <th>Día</th>
                <th>Hora Inicio</th>
                <th>Hora Fin</th>
                <th>Deporte</th>
                <th>Sala</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {schedules.map((item) => (
                <tr key={item.id}>
                  <td className="text-capitalize fw-semibold">
                    {item.day_of_week ?? "—"}
                  </td>
                  <td>{item.start_time ?? "—"}</td>
                  <td>{item.end_time ?? "—"}</td>
                  <td>{item.sportRoom?.sport?.name ?? item.sport?.name ?? "—"}</td>
                  <td>{item.sportRoom?.room?.name ?? item.room?.name ?? "—"}</td>
                  <td>
                    <Badge bg={item.status ? "success" : "secondary"}>
                      {item.status ? "Activo" : "Inactivo"}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card.Body>
    </Card>
  );
}

export default MySchedulePage;
