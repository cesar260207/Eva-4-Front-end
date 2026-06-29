import { useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import Swal from "sweetalert2";
import RoomFormModal from "./RoomFormModal";
import { getRooms, deleteRoom, createRoom, updateRoom } from "../../services/roomService";

export default function RoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      setLoading(true);
      const response = await getRooms();
      setRooms(response.data && Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error al cargar:", error);
      Swal.fire("Error", "No se pudieron cargar las salas", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData) => {
    // Preparamos el payload con todos los campos que requiere tu modelo Room.js
    const payload = {
      name: formData.name,
      description: formData.description,
      capacity: parseInt(formData.capacity, 10),
      location: formData.location,
      status: true
    };

    try {
      if (selectedRoom) {
        await updateRoom(selectedRoom.id, payload);
        Swal.fire("Éxito", "Sala actualizada", "success");
      } else {
        await createRoom(payload);
        Swal.fire("Éxito", "Sala creada", "success");
      }
      setShowModal(false);
      setSelectedRoom(null);
      loadRooms();
    } catch (error) {
      console.error("Error al guardar:", error);
      Swal.fire("Error", "No se pudo guardar la sala. Revisa los datos.", "error");
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "¿Seguro?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar"
    });
    
    if (result.isConfirmed) {
      await deleteRoom(id);
      loadRooms();
    }
  };

  if (loading) return <p>Cargando salas...</p>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between mb-3">
        <h2>Gestión de Salas</h2>
        <Button variant="primary" onClick={() => { setSelectedRoom(null); setShowModal(true); }}>
          Nueva Sala
        </Button>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Capacidad</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room) => (
            <tr key={room.id}>
              <td>{room.name}</td>
              <td>{room.description}</td>
              <td>{room.capacity}</td>
              <td>
                <Button variant="warning" size="sm" className="me-2" onClick={() => { setSelectedRoom(room); setShowModal(true); }}>
                  Editar
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(room.id)}>
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <RoomFormModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        handleSave={handleSave}
        selectedRoom={selectedRoom}
      />
    </div>
  );
}