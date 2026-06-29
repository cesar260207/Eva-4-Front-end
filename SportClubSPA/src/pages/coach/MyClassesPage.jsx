import { useEffect, useState } from "react";
import { Card, Table, Spinner, Badge } from "react-bootstrap";
import Swal from "sweetalert2";
import { getMyClasses } from "../../services/coachService";

function MyClassesPage() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getMyClasses();
        setClasses(Array.isArray(res.data) ? res.data : []);
      } catch {
        Swal.fire("Error", "No se pudieron cargar tus clases", "error");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <Card className="shadow-sm">
      <Card.Header>
        <h4 className="mb-0">Mis Clases</h4>
      </Card.Header>
      <Card.Body>
        {loading ? (
          <div className="text-center py-4">
            <Spinner animation="border" />
          </div>
        ) : (
          <Table responsive striped bordered hover>
            <thead>
              <tr>
                <th>Deporte</th>
                <th>Sala</th>
                <th>Día</th>
                <th>Hora</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {classes.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center text-muted py-3">
                    No tienes clases asignadas
                  </td>
                </tr>
              ) : (
                classes.map((item) => {
                  // schedules es un array, mostramos una fila por cada horario
                  if (item.schedules && item.schedules.length > 0) {
                    return item.schedules.map((sch) => (
                      <tr key={`${item.id}-${sch.id}`}>
                        <td>{item.sport?.name ?? "—"}</td>
                        <td>{item.room?.name ?? "—"}</td>
                        <td className="text-capitalize">{sch.day_of_week ?? "—"}</td>
                        <td>{sch.start_time} - {sch.end_time}</td>
                        <td>
                          <Badge bg={item.status ? "success" : "secondary"}>
                            {item.status ? "Activa" : "Inactiva"}
                          </Badge>
                        </td>
                      </tr>
                    ));
                  }
                  // Si no tiene horarios aún
                  return (
                    <tr key={item.id}>
                      <td>{item.sport?.name ?? "—"}</td>
                      <td>{item.room?.name ?? "—"}</td>
                      <td className="text-muted">Sin horario</td>
                      <td className="text-muted">—</td>
                      <td>
                        <Badge bg={item.status ? "success" : "secondary"}>
                          {item.status ? "Activa" : "Inactiva"}
                        </Badge>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </Table>
        )}
      </Card.Body>
    </Card>
  );
}

export default MyClassesPage;