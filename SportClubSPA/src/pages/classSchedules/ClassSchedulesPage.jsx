import { useEffect, useState } from "react";
import { Button, Card, Spinner, Table } from "react-bootstrap";
import Swal from "sweetalert2";
import { getClassSchedules, deleteClassSchedule } from "../../services/classScheduleService";
import ClassScheduleFormModal from "../../components/classSchedules/ClassScheduleFormModal";

function ClassSchedulesPage() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  const loadSchedules = async () => {
    try {
      setLoading(true);
      const res = await getClassSchedules();
      setSchedules(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      Swal.fire("Error", "No se pudieron cargar los horarios", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadSchedules(); }, []);

  const handleDelete = async (schedule) => {
    const result = await Swal.fire({
      title: "¿Eliminar horario?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      confirmButtonColor: "#d33"
    });

    if (result.isConfirmed) {
      await deleteClassSchedule(schedule.id);
      loadSchedules();
    }
  };

  return (
    <Card className="shadow-sm">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h4 className="mb-0">Gestión de Horarios</h4>
        <Button variant="primary" onClick={() => { setSelectedSchedule(null); setShowModal(true); }}>
          Nuevo Horario
        </Button>
      </Card.Header>
      <Card.Body>
        {loading ? <div className="text-center"><Spinner animation="border" /></div> : (
          <Table responsive striped bordered hover>
            <thead>
              <tr>
                <th>Deporte</th><th>Sala</th><th>Coach</th><th>Día</th><th>Hora</th><th>Acciones</th>
              </tr>
            </thead>
<tbody>
  {schedules.length === 0 ? (
    <tr>
      <td colSpan="6" className="text-center text-muted">No hay horarios registrados</td>
    </tr>
  ) : (
    schedules.map(item => (
      <tr key={item.id}>
        <td>{item.sportRoom?.sport?.name ?? "—"}</td>
        <td>{item.sportRoom?.room?.name ?? "—"}</td>
        <td>{item.sportRoom?.coach?.full_name ?? "—"}</td>
        <td>{item.day_of_week ?? "—"}</td>
        <td>{item.start_time} - {item.end_time}</td>
        <td>
          <Button size="sm" variant="warning" className="me-2"
            onClick={() => { setSelectedSchedule(item); setShowModal(true); }}>
            Editar
          </Button>
          <Button size="sm" variant="danger" onClick={() => handleDelete(item)}>
            Eliminar
          </Button>
        </td>
      </tr>
    ))
  )}
</tbody>
          </Table>
        )}
      </Card.Body>
      <ClassScheduleFormModal 
        show={showModal} 
        handleClose={() => setShowModal(false)} 
        onSuccess={loadSchedules}
        selected={selectedSchedule}
      />
    </Card>
  );
}
export default ClassSchedulesPage;