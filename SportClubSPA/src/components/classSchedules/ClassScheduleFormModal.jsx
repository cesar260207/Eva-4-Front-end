import { useEffect, useState } from "react";
import { Modal, Form, Button, Spinner } from "react-bootstrap";
import Swal from "sweetalert2";
import { getUsers } from "../../services/userService";
import { getSports } from "../../services/sportService";
import { getRooms } from "../../services/roomService";
import { getSportRooms } from "../../services/sportRoomService"; // Necesitamos esto
import { createClassSchedule, updateClassSchedule } from "../../services/classScheduleService";

function ClassScheduleFormModal({ show, handleClose, onSuccess, selected }) {
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState({ sports: [], rooms: [], coaches: [], sportRooms: [] });
  const [formData, setFormData] = useState({ 
    sport_id: "", room_id: "", coach_id: "", day_of_week: "", start_time: "", end_time: ""
  });

  useEffect(() => {
    if (show) {
      loadInitialData();
      if (selected) setFormData(selected);
    }
  }, [show, selected]);

  const loadInitialData = async () => {
    try {
      const [s, r, u, sr] = await Promise.all([getSports(), getRooms(), getUsers(), getSportRooms()]);
      
      
      console.log("Respuesta completa de getSportRooms:", sr);

      setOptions({ 
        sports: s.data || [], 
        rooms: r.data || [], 
        coaches: u.data.filter(user => user.role === 'coach') || [],
        sportRooms: Array.isArray(sr) ? sr : (sr.data || sr.sportRooms || []) 
      });
    } catch (e) {
      console.error("Error cargando datos:", e);
      Swal.fire("Error", "No se pudieron cargar los datos", "error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log("Valores en formulario:", formData);
    console.log("Lista de asignaciones disponibles:", options.sportRooms);
    const match = options.sportRooms.find(sr => 
        sr.sport_id == formData.sport_id && 
        sr.room_id == formData.room_id && 
        sr.coach_id == formData.coach_id
    );

    if (!match) {
        console.warn("No se encontró match para:", formData);
        Swal.fire("Error", "La combinación seleccionada (Deporte/Sala/Coach) no existe como asignación válida.", "error");
        return;
    }

    const payload = {
        sport_room_id: match.id, // Transformamos los 3 inputs en el ID único requerido
        day_of_week: formData.day_of_week,
        start_time: formData.start_time,
        end_time: formData.end_time || "12:00" // Aseguramos que end_time exista
    };

    setLoading(true);
    try {
      if (selected) await updateClassSchedule(selected.id, payload);
      else await createClassSchedule(payload);
      
      Swal.fire("Éxito", "Horario guardado", "success");
      onSuccess();
      handleClose();
    } catch (e) {
      Swal.fire("Error", "No se pudo guardar", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton><Modal.Title>{selected ? "Editar" : "Nuevo"} Horario</Modal.Title></Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          {/* Tus selects originales (esto es lo que el usuario ve) */}
          <Form.Group className="mb-3">
            <Form.Label>Deporte</Form.Label>
            <Form.Select required value={formData.sport_id} onChange={(e) => setFormData({...formData, sport_id: e.target.value})}>
              <option value="">Seleccione...</option>
              {options.sports.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </Form.Select>
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Sala</Form.Label>
            <Form.Select required value={formData.room_id} onChange={(e) => setFormData({...formData, room_id: e.target.value})}>
              <option value="">Seleccione...</option>
              {options.rooms.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Coach</Form.Label>
            <Form.Select required value={formData.coach_id} onChange={(e) => setFormData({...formData, coach_id: e.target.value})}>
              <option value="">Seleccione...</option>
              {options.coaches.map(c => <option key={c.id} value={c.id}>{c.full_name}</option>)}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Día de la semana</Form.Label>
            <Form.Control type="text" value={formData.day_of_week} onChange={(e) => setFormData({...formData, day_of_week: e.target.value})} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Hora Inicio</Form.Label>
            <Form.Control type="time" value={formData.start_time} onChange={(e) => setFormData({...formData, start_time: e.target.value})} />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Hora Fin</Form.Label>
            <Form.Control type="time" value={formData.end_time} onChange={(e) => setFormData({...formData, end_time: e.target.value})} />
          </Form.Group>

          <Button type="submit" disabled={loading}>{loading ? <Spinner size="sm" /> : "Guardar"}</Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default ClassScheduleFormModal;