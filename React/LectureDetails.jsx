import React, { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { Card, Button, Row } from "react-bootstrap";
import * as lectureService from "../../services/lectureService";
import PropTypes from "prop-types";
import debug from "sabio-debug";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import { BiArrowToLeft } from "react-icons/bi";
import NotesForm from "components/notes/NotesForm";
import lectureImageDefault from "../../assets/images/placeholder/4by3.jpg";
import "./lecture.css";
import swal from "sweetalert2";

function LectureDetails({ currentUser }) {
  const _logger = debug.extend("LectureDetails");
  const navigate = useNavigate();
  const onReturn = (e) => {
    _logger(e);
    navigate(`/courses/lectures`);
  };
  const [lectureDetails, setLectureDetails] = useState({
    id: 0,
    courseId: 0,
    subject: "",
    title: "",
    description: "",
    duration: "",
    imageUrl: "",
    fileUrl: "",
    sortOrder: 0,
    status: {
      id: 0,
      name: "",
    },
    createdBy: {
      id: 0,
      firstName: "",
      lastName: "",
      middleInitial: "",
      avatarImage: "",
    },
    modifiedBy: {
      id: 0,
      firstName: "",
      lastName: "",
      middleInitial: "",
      avatarImage: "",
    },
    dateCreated: "",
    dateModified: "",
  });
  const isAdmin = currentUser.roles.includes("Admin");

  _logger(currentUser);
  const { id: lectureId } = useParams();
  const location = useLocation();
  _logger("useLocation: ", location);
  _logger("useParams: ", lectureId);
  useEffect(() => {
    let stateLect = null;
    if (location.state && location.state.detail) {
      stateLect = location.state.detail;
      setLectureDetails((prevState) => {
        var lecture = {
          ...prevState,
        };
        lecture = stateLect;
        return lecture;
      });
    } else {
      lectureService
        .getLectureById(lectureId)
        .then(getLectureByIdSuccess)
        .catch(getLectureByIdError);
    }
  }, []);

  const getLectureByIdSuccess = (data) => {
    let aLecture = data.item;
    if (aLecture) {
      setLectureDetails((prevState) => {
        var lecture = {
          ...prevState,
        };
        lecture = aLecture;
        return lecture;
      });
    }
  };

  const getLectureByIdError = (error) => {
    _logger("getLectureByIdError error", error);
    toastr.error("Failed to load lecture details.", error);
  };

  const { id: idToDelete } = useParams();

  const handleDelete = () => {
    lectureService
      .deleteLecture(idToDelete)
      .then(onDeleteSuccess)
      .catch(onDeleteError)
      .finally(() => {
        swal.fire({
          heightAuto: false,
          backdrop: false,
          closeOnCancel: true,
          title: "Lecture deleted.",
          text: "Lecture has been deleted.",
          icon: "success",
        });
        navigate(`/courses/lectures`);
      });
  };

  const onDeleteSuccess = (response) => {
    _logger(response);
  };

  const onDeleteError = (error) => {
    _logger(error);
    toastr.error("Lecture not deleted");
  };

  const { id: updateId } = useParams();
  const editLecture = useNavigate();
  const goToPage = (e) => {
    e.preventDefault();
    editLecture("update/" + updateId);
  };

  return (
    <React.Fragment>
      <Card className="col-5 mx-auto p-2">
        <BiArrowToLeft cursor="pointer" size="50" onClick={onReturn}>
          Return
        </BiArrowToLeft>
        <Card.Header className="d-flex justify-content-center">
          <img
            src={lectureDetails.imageUrl}
            className="col-5 mx-auto p-2"
            alt="lectureImageDefault"
            onError={({ currentTarget }) => {
              currentTarget.onerror = null;
              currentTarget.src = lectureImageDefault;
            }}
          />
        </Card.Header>
        <Card.Header>
          <h4>Course Title: </h4>
          <div>{lectureDetails.subject}</div>
        </Card.Header>
        <Card.Header>
          <h4>Lecture Title: </h4>
          <div>{lectureDetails.title}</div>
        </Card.Header>
        <Card.Header>
          <h4>Description: </h4>
          <div>{lectureDetails.description}</div>
        </Card.Header>
        <Card.Header>
          <h4>Duration: </h4>
          <div>{lectureDetails.duration}</div>
        </Card.Header>
        <Card.Header>
          <h4>CreatedBy: </h4>
          <div>
            {lectureDetails.createdBy.firstName}{" "}
            {lectureDetails.createdBy.middleInitial}{" "}
            {lectureDetails.createdBy.lastName}
          </div>
        </Card.Header>
        <Card.Header>
          <h4>ModifiedBy: </h4>
          <div>
            {lectureDetails.modifiedBy.firstName}{" "}
            {lectureDetails.modifiedBy.middleInitial}{" "}
            {lectureDetails.modifiedBy.lastName}
          </div>
        </Card.Header>
        <Card.Header>
          <h4>DateCreated: </h4>
          <div>{lectureDetails.dateCreated.slice(0, 10)}</div>
        </Card.Header>
        <Card.Header>
          <h4>DateModified: </h4>
          <div>{lectureDetails.dateModified.slice(0, 10)}</div>
        </Card.Header>
        <Row md={6} xs={12} className="mb-3">
          {isAdmin && (
            <>
              <Button
                variant="btn btn-primary"
                className="custom-button"
                onClick={goToPage}
              >
                Update Lecture
              </Button>
              <Button
                variant="btn btn-danger"
                className="custom-button"
                onClick={handleDelete}
              >
                Delete Lecture
              </Button>
            </>
          )}
        </Row>
      </Card>
      <div className="d-flex mt-3 justify-content-center ">
        <div className="col-5">
          <NotesForm lectureId={lectureDetails.id} />
        </div>
      </div>
    </React.Fragment>
  );
}

LectureDetails.propTypes = {
  aLecture: PropTypes.shape({
    id: PropTypes.number.isRequired,
    courseId: PropTypes.number.isRequired,
    subject: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    duration: PropTypes.string.isRequired,
    imageUrl: PropTypes.string,
    fileUrl: PropTypes.string.isRequired,
    sortOrder: PropTypes.number.isRequired,
    status: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    }).isRequired,
    createdBy: PropTypes.shape({
      id: PropTypes.number.isRequired,
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
      middleInitial: PropTypes.string,
      avatarImage: PropTypes.string,
    }).isRequired,
    modifiedBy: PropTypes.shape({
      id: PropTypes.number.isRequired,
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
      middleInitial: PropTypes.string,
      avatarImage: PropTypes.string,
    }),
    dateCreated: PropTypes.string.isRequired,
    dateModified: PropTypes.string.isRequired,
  }),
};

export default React.memo(LectureDetails);

LectureDetails.propTypes = {
  currentUser: PropTypes.shape({
    avatarUrl: PropTypes.string.isRequired,
    firstName: PropTypes.string.isRequired,
    roles: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
};
