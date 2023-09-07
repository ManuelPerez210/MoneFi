import React from "react";
import PropTypes from "prop-types";
import { Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import debug from "sabio-debug";
import "./lecture.css";
import { BiInfoSquare } from "react-icons/bi";
import lectureImageDefault from "../../assets/images/placeholder/4by3.jpg";

function LectureCard(props) {
  const myLecture = props.aLecture;
  const _logger = debug.extend("LectureCard");
  _logger(props.aLecture);
  const navigate = useNavigate();
  const onLectureClicked = (e) => {
    _logger(e);
    navigate(`/courses/lectures/${myLecture.id}`, { state: myLecture });
  };
  return (
    <Card className="mb-2 cardFormat mx-auto justify-content-center">
      <Card className="lectureCard my-2 mb-4 card-hover mx-1">
        <img
          size="6"
          src={myLecture.imageUrl}
          className="lectureImg"
          alt="lectureImageDefault"
          onError={({ currentTarget }) => {
            currentTarget.onerror = null;
            currentTarget.src = lectureImageDefault;
          }}
        />
      </Card>
      <Card.Body className="mx-auto justify-content-center">
        <Card.Title className="d-flex align-items-center">
          {myLecture.title}
          <BiInfoSquare
            cursor="pointer"
            size="20"
            onClick={onLectureClicked}
          ></BiInfoSquare>
        </Card.Title>
      </Card.Body>
    </Card>
  );
}
LectureCard.propTypes = {
  aLecture: PropTypes.shape({
    id: PropTypes.number.isRequired,
    courseId: PropTypes.number.isRequired,
    subject: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    duration: PropTypes.string.isRequired,
    imageUrl: PropTypes.string,
    fileUrl: PropTypes.string.isRequired,
    lectureSections: PropTypes.number.isRequired,
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
    ModifiedBy: PropTypes.shape({
      id: PropTypes.number.isRequired,
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
      middleInitial: PropTypes.string,
      avatarImage: PropTypes.string,
    }),
    dateCreated: PropTypes.string.isRequired,
    dateModified: PropTypes.string.isRequired,
  }).isRequired,
};
export default React.memo(LectureCard);
