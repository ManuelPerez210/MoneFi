import React, { useState } from "react";
import { Card, Button, Row, Col, Badge } from "react-bootstrap";
import { formatDateTime } from "../../utils/dateFormater";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import {
  TrashFill,
  PencilSquare,
  CalendarCheckFill,
  CalendarXFill,
  Bank,
} from "react-bootstrap-icons";
import debug from "sabio-debug";
import * as appointmentServices from "../../services/appointmentsServices";

const _logger = debug.extend("Appointment");

function AppointmentCard(prop) {
  const anAppointment = prop.appointment;
  const navigate = useNavigate();
  const startDate = formatDateTime(anAppointment.appointmentStart);
  const endDate = formatDateTime(anAppointment.appointmentEnd);
  const [isDeleted, setIsDeleted] = useState(false);
  const onCardEdit = () => {
    const editState = {
      state: { type: "appointmentEdit", payload: anAppointment },
    };
    navigate(`/appointments/${anAppointment.id}/form`, editState);
  };

  const onCardDelete = (e) => {
    _logger("target", e.target.name);
    Swal.fire({
      title: "Do you want to delete this appointment?",
      showDenyButton: true,
      confirmButtonText: "Yes",
      denyButtonText: `No`,
    }).then((result) => {
      if (result.isConfirmed) {
        appointmentServices
          .deleteAppointment(anAppointment.id, 0)
          .then(onDeleteSuccess)
          .catch(onDeleteError);
      } else if (result.isDenied) {
        Swal.fire({
          title: "Then Appointment was not Deleted",
          icon: "error",
        });
      }
    });
  };
  const onDeleteSuccess = () => {
    setIsDeleted(!isDeleted);
    Swal.fire({ title: "the Appointment was Deleted", icon: "success" });
    prop.onDeleteSuccess(anAppointment.id);
  };

  const onDeleteError = () => {
    Swal.fire({ title: "Then Appointment was not Deleted", icon: "error" });
  };
  return (
    <React.Fragment>
      <Card className="text-center m-3 shadow-lg" style={{ height: "500px" }}>
        <Card.Header>
          <Row>
            <Col>
              {" "}
              <h2>
                <Bank className="m-3"></Bank>
                {anAppointment.nameOfLender}
              </h2>
            </Col>{" "}
            <Col>
              <Badge bg="primary m-2">
                {" "}
                Lender Type {anAppointment.lenderType}
              </Badge>
            </Col>
          </Row>
        </Card.Header>

        <Card.Body>
          <Row>
            <Col>
              {" "}
              <Card.Title>{anAppointment.appointmentType}</Card.Title>
            </Col>
            <Col>
              <Card.Subtitle>{anAppointment.loanType}</Card.Subtitle>
            </Col>
          </Row>
          <Row>
            <Col>
              <Card.Text> {anAppointment.notes}</Card.Text>
            </Col>
            <Col>
              <Card.Body>
                <h6>
                  <CalendarCheckFill /> {startDate} <hr /> <CalendarXFill />{" "}
                  {endDate}
                </h6>
              </Card.Body>
            </Col>
          </Row>
          <Button className="m-3" onClick={onCardEdit} variant="primary">
            <PencilSquare className="m-2"></PencilSquare>
            Edit Appointment
          </Button>
          <Button variant="danger" onClick={onCardDelete} name="delete">
            {" "}
            <TrashFill className="m-2"></TrashFill>
            Delete Appointment
          </Button>
        </Card.Body>
        <Card.Footer>Location : {anAppointment.lenderLocation}</Card.Footer>
      </Card>
    </React.Fragment>
  );
}

export default AppointmentCard;
