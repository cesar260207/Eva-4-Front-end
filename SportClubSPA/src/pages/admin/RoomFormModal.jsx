import { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

export default function RoomFormModal({ show, handleClose, handleSave, selectedRoom }) {
  const [formData, setFormData] = useState({ 
      name: "", 
      capacity: "", 
      description: "", 
      location: "" 
  });

  

  useEffect(() => {
    if (selectedRoom) {
      setFormData(selectedRoom);
    } else {
      setFormData({ name: "", capacity: "" });
    }
  }, [selectedRoom]);

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSave(formData);
  };

  

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{selectedRoom ? "Editar Sala" : "Nueva Sala"}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Nombre de la Sala</Form.Label>
            <Form.Control
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Capacidad</Form.Label>
            <Form.Control
              type="number"
              required
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-3">
        <Form.Label>Descripción</Form.Label>
        <Form.Control
          type="text"
          required
          value={formData.description || ""} // Agregamos || "" para evitar errores si es null
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Ubicación</Form.Label>
        <Form.Control
          type="text"
          value={formData.location || ""}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
        />
      </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Cancelar</Button>
          <Button variant="primary" type="submit">Guardar</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}