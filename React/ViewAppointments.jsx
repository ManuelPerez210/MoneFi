import React, { useEffect, useState } from "react";
import { Container, Row } from "react-bootstrap";
import debug from "sabio-debug";
import * as appointmentService from "../../services/appointmentsServices";
import AppointmentCard from "./AppointmentCard";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import locale from "rc-pagination/lib/locale/en_US";
import Swal from "sweetalert2";
const _logger = debug.extend("Appointment");

function ViewAppointments() {
  const [allData, setAllData] = useState({
    data: null,
    components: null,
    currentPage: 1,
    pageSize: 2,
    totalCount: 0,
  });

  const onDeleteSuccess = (idToDelete) => {
    _logger("  DELETING THIS :", idToDelete);
    setAllData((prevState) => {
      let newState = { ...prevState };
      let filteredItems = prevState.data.filter(
        (aGroup) => aGroup.id !== idToDelete
      );
      newState.data = filteredItems;
      newState.components = filteredItems.map(mapAppointments);
      return newState;
    });
  };

  const onChangePage = (page) => {
    setAllData((prevState) => {
      const newState = { ...prevState };
      newState.currentPage = page;
      return newState;
    });
  };

  useEffect(() => {
    appointmentService
      .getAppointmentsByClientId(allData.currentPage - 1, allData.pageSize)
      .then(onGetAppSuccess)
      .catch(onGetAppError);
  }, [allData.currentPage, allData.pageSize]);

  const onGetAppSuccess = (response) => {
    _logger("this is the response", response);
    if (response !== null) {
      setAllData((prev) => {
        const newState = { ...prev };
        newState.data = response?.item.pagedItems;
        newState.components = newState.data.map(mapAppointments);
        newState.totalCount = response.item.totalCount;
        return newState;
      });
    }
  };
  const onGetAppError = () => {
    Swal.fire({
      title: "Calendar",
      text: "You have no upcoming appointments",
      icon: "info",
      confirmButtonColor: "#7cd1f9",
      confirmButtonText: `<a className="text-white" href="/appointments">Create Appointment</a>`,
      showCancelButton: true,
      cancelButtonText: "Close",
    });
  };

  const mapAppointments = (App) => (
    <Container className="w-50">
      <AppointmentCard
        key={`id_appointm_ ${App.id}_${App.nameOfLender}`}
        appointment={App}
        onDeleteSuccess={onDeleteSuccess}
      ></AppointmentCard>
    </Container>
  );

  return (
    <>
      <Container fluid>
        <Row className="text-center">
          <h1>View your Appointments </h1>
          <figcaption className="blockquote-footer text-center">
            Here you can view or edit your appointment with lenders
          </figcaption>
        </Row>
        <Row>
          <Pagination
            onChange={onChangePage}
            current={allData.currentPage}
            pageSize={allData.pageSize}
            total={allData.totalCount}
            className="d-flex justify-content-center "
            locale={locale}
          />
        </Row>
        <Row className="justify-content-md-center">{allData.components}</Row>
        <Row>
          <Pagination
            onChange={onChangePage}
            current={allData.currentPage}
            pageSize={allData.pageSize}
            total={allData.totalCount}
            className="d-flex justify-content-center "
            locale={locale}
          />
        </Row>
      </Container>
    </>
  );
}

export default ViewAppointments;
