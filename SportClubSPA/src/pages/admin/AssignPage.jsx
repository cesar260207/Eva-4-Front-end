import { useEffect, useState } from "react";
import { Form, Button, Card, Spinner } from "react-bootstrap";
import Swal from "sweetalert2";
import { getSports } from "../../services/sportService";
import { getRooms } from "../../services/roomService";
import { getUsers } from "../../services/userService";
import { assignSportToRoom } from "../../services/sportRoomService";

export default function AssignPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ sports: [], rooms: [], coaches: [] });
  const [formData, setFormData] = useState({ sport_id: "", room_id: "", coach_id: "" });

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      // Ejecutamos las tres peticiones en paralelo
      const [sports, rooms, users] = await Promise.all([
        getSports(),
        getRooms(),
        getUsers()
      ]);

      setData({
        sports: sports.data || [],
        rooms: rooms.data || [],
        coaches: users.data.filter(u => u.role === 'coach') // Filtramos solo a los coaches
      });
    } catch (error) {
      Swal.fire("Error", "No se pudieron cargar los datos", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await assignSportToRoom(formData);
      Swal.fire("Éxito", "Asignación realizada correctamente", "success");
      setFormData({ sport_id: "", room_id: "", coach_id: "" }); // Limpiar formulario
    } catch (error) {
      Swal.fire("Error", "No se pudo realizar la asignación", "error");
    }
  };

  if (loading) return <div className="text-center mt-5"><Spinner animation="border" /></div>;

  return (
    <Card className="shadow-sm p-4 mt-4">
      <h4 className="mb-4">Nueva Asignación</h4>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Deporte</Form.Label>
          <Form.Select required onChange={(e) => setFormData({...formData, sport_id: e.target.value})}>
            <option value="">Seleccione un deporte</option>
            {data.sports.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Sala</Form.Label>
          <Form.Select required onChange={(e) => setFormData({...formData, room_id: e.target.value})}>
            <option value="">Seleccione una sala</option>
            {data.rooms.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Coach</Form.Label>
          <Form.Select required onChange={(e) => setFormData({...formData, coach_id: e.target.value})}>
            <option value="">Seleccione un coach</option>
            {data.coaches.map(c => <option key={c.id} value={c.id}>{c.full_name}</option>)}
          </Form.Select>
        </Form.Group>

        <Button variant="primary" type="submit">
          Confirmar Asignación
        </Button>
      </Form>
    </Card>
  );
}