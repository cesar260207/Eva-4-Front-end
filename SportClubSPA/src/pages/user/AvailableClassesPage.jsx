import { useEffect, useState } from "react";
import { Card, Table, Spinner, Button, Badge, Form, Row, Col } from "react-bootstrap";
import Swal from "sweetalert2";
import { getAvailableClasses } from "../../services/memberService";
import { createReservation } from "../../services/reservationService";

function AvailableClassesPage() {
  const [rows, setRows]         = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [booking, setBooking]   = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getAvailableClasses();
        const data = Array.isArray(res.data) ? res.data : [];

        // Aplanar: una fila por cada horario dentro de cada clase
        const flat = [];
        data.forEach(item => {
          if (item.schedules && item.schedules.length > 0) {
            item.schedules.forEach(sch => {
              flat.push({
                scheduleId: sch.id,
                deporte:    item.sport?.name ?? "—",
                coach:      item.coach?.email ?? "—",
                sala:       item.room?.name ?? "—",
                dia:        sch.day_of_week ?? "—",
                inicio:     sch.start_time ?? "—",
                fin:        sch.end_time ?? "—",
                status:     sch.status,
              });
            });
          } else {
            flat.push({
              scheduleId: null,
              deporte:    item.sport?.name ?? "—",
              coach:      item.coach?.email ?? "—",
              sala:       item.room?.name ?? "—",
              dia:        "Sin horario",
              inicio:     null,
              fin:        null,
              status:     item.status,
            });
          }
        });

        setRows(flat);
        setFiltered(flat);
      } catch {
        Swal.fire("Error", "No se pudieron cargar las clases disponibles", "error");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const term = search.toLowerCase();
    setFiltered(
      rows.filter(r =>
        r.deporte.toLowerCase().includes(term) ||
        r.dia.toLowerCase().includes(term)
      )
    );
  }, [search, rows]);

  const handleReservar = async (row) => {
    const result = await Swal.fire({
      title: "¿Confirmar reserva?",
      html: `
        <p><strong>Deporte:</strong> ${row.deporte}</p>
        <p><strong>Día:</strong> ${row.dia}</p>
        <p><strong>Hora:</strong> ${row.inicio} - ${row.fin}</p>
        <p><strong>Sala:</strong> ${row.sala}</p>
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, reservar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#6f42c1",
    });

    if (!result.isConfirmed) return;

    setBooking(row.scheduleId);
    try {
      await createReservation({ class_schedule_id: row.scheduleId });
      Swal.fire("¡Reserva creada!", "Tu reserva fue registrada exitosamente.", "success");
    } catch {
      Swal.fire("Error", "No se pudo crear la reserva. Intenta nuevamente.", "error");
    } finally {
      setBooking(null);
    }
  };

  return (
    <Card className="shadow-sm">
      <Card.Header>
        <h4 className="mb-0">Clases Disponibles</h4>
      </Card.Header>
      <Card.Body>
        <Row className="mb-3">
          <Col md={4}>
            <Form.Control
              type="text"
              placeholder="Buscar por deporte o día..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Col>
        </Row>

        {loading ? (
          <div className="text-center py-4"><Spinner animation="border" /></div>
        ) : (
          <Table responsive striped bordered hover>
            <thead>
              <tr>
                <th>Deporte</th>
                <th>Coach</th>
                <th>Sala</th>
                <th>Día</th>
                <th>Hora</th>
                <th>Estado</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center text-muted py-3">
                    No hay clases disponibles
                  </td>
                </tr>
              ) : (
                filtered.map((row, idx) => (
                  <tr key={idx}>
                    <td>{row.deporte}</td>
                    <td>{row.coach}</td>
                    <td>{row.sala}</td>
                    <td className="text-capitalize">{row.dia}</td>
                    <td>{row.inicio && row.fin ? `${row.inicio} - ${row.fin}` : "—"}</td>
                    <td>
                      <Badge bg={row.status ? "success" : "secondary"}>
                        {row.status ? "Disponible" : "No disponible"}
                      </Badge>
                    </td>
                    <td>
                      <Button
                        size="sm"
                        variant="primary"
                        disabled={!row.status || !row.scheduleId || booking === row.scheduleId}
                        onClick={() => handleReservar(row)}
                      >
                        {booking === row.scheduleId
                          ? <Spinner size="sm" animation="border" />
                          : "Reservar"
                        }
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        )}
      </Card.Body>
    </Card>
  );
}

export default AvailableClassesPage;
