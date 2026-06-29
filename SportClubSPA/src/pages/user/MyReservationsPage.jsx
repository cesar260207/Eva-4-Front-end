import { useEffect, useState } from "react";
import { Card, Table, Spinner, Button, Badge } from "react-bootstrap";
import Swal from "sweetalert2";
import { getMyReservations, cancelReservation } from "../../services/reservationService";

// Colores según el estado de la reserva
const STATUS_BADGE = {
  active:    "success",
  confirmed: "success",
  cancelled: "secondary",
  cancelada: "secondary",
  pending:   "warning",
};

function MyReservationsPage() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [cancelling, setCancelling]     = useState(null); // id en proceso de cancelación

  const loadReservations = async () => {
    try {
      setLoading(true);
      const res = await getMyReservations();
      setReservations(Array.isArray(res.data) ? res.data : []);
    } catch {
      Swal.fire("Error", "No se pudieron cargar tus reservas", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReservations();
  }, []);

  const handleCancel = async (reservation) => {
    const result = await Swal.fire({
      title: "¿Cancelar reserva?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, cancelar",
      cancelButtonText: "Volver",
      confirmButtonColor: "#d33",
    });

    if (!result.isConfirmed) return;

    setCancelling(reservation.id);
    try {
      await cancelReservation(reservation.id);
      Swal.fire("Cancelada", "Tu reserva fue cancelada.", "success");
      loadReservations(); // Recargar lista
    } catch {
      Swal.fire("Error", "No se pudo cancelar la reserva.", "error");
    } finally {
      setCancelling(null);
    }
  };

  // Una reserva se puede cancelar si su estado no es ya "cancelled" o "cancelada"
  const canCancel = (status) =>
    !["cancelled", "cancelada", "canceled"].includes(status?.toLowerCase());

  return (
    <Card className="shadow-sm">
      <Card.Header>
        <h4 className="mb-0">Mis Reservas</h4>
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
                <th>#</th>
                <th>Deporte</th>
                <th>Sala</th>
                <th>Coach</th>
                <th>Día</th>
                <th>Hora</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {reservations.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center text-muted py-3">
                    No tienes reservas registradas
                  </td>
                </tr>
              ) : (
                reservations.map((res, idx) => {
                  const schedule = res.classSchedule ?? res.class_schedule ?? {};
                  const sportRoom = schedule.sportRoom ?? {};

                  return (
                    <tr key={res.id}>
                      <td>{idx + 1}</td>
                      <td>{sportRoom?.sport?.name ?? "—"}</td>
                      <td>{sportRoom?.room?.name ?? "—"}</td>
                      <td>{sportRoom?.coach?.full_name ?? "—"}</td>
                      <td className="text-capitalize">{schedule.day_of_week ?? "—"}</td>
                      <td>
                        {schedule.start_time && schedule.end_time
                          ? `${schedule.start_time} - ${schedule.end_time}`
                          : "—"}
                      </td>
                      <td>
                        <Badge bg={STATUS_BADGE[res.status?.toLowerCase()] ?? "info"}>
                          {res.status ?? "—"}
                        </Badge>
                      </td>
                      <td>
                        {canCancel(res.status) ? (
                          <Button
                            size="sm"
                            variant="danger"
                            disabled={cancelling === res.id}
                            onClick={() => handleCancel(res)}
                          >
                            {cancelling === res.id ? (
                              <Spinner size="sm" animation="border" />
                            ) : (
                              "Cancelar"
                            )}
                          </Button>
                        ) : (
                          <span className="text-muted">—</span>
                        )}
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

export default MyReservationsPage;
