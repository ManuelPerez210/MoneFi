import React, { useState, useEffect, Fragment } from "react";
import { Accordion, ListGroup, Row } from "react-bootstrap";
import Icon from "@mdi/react";
import { mdiBookOpenPageVariant, mdiClockOutline } from "@mdi/js";
import courseImageDefault from "../../assets/images/placeholder/4by3.jpg";
import PropTypes from "prop-types";

function CourseAccordion({ lectures }) {
  const [lectureState, setLectures] = useState([]);

  const mapLecture = (lecture) => {
    return (
      <Accordion.Item key={lecture.id}>
        <Accordion.Header>{lecture.title}</Accordion.Header>
        <Accordion.Body>
          <ListGroup as="ul" bsPrefix="list-inline" className="">
            <ListGroup.Item
              as="li"
              bsPrefix="list-inline-item"
              className="mb-1"
            >
              <Icon path={mdiBookOpenPageVariant} size={1} className="me-3" />
              {lecture.title}
            </ListGroup.Item>
            <ListGroup.Item
              as="li"
              bsPrefix="list-inline-item"
              className="py-1"
            >
              <Icon path={mdiClockOutline} size={1} className="me-3 ms-3" />
              {lecture.duration}
            </ListGroup.Item>

            <Row className="align-items-center g-0">
              <ListGroup.Item as="li" bsPrefix="list-inline-item">
                {lecture.description}
              </ListGroup.Item>
            </Row>
          </ListGroup>
          <img
            size="6"
            src={lecture.imageUrl}
            className="col-12 float-start"
            alt=""
            onError={({ currentTarget }) => {
              currentTarget.onerror = null;
              currentTarget.src = courseImageDefault;
            }}
          />
        </Accordion.Body>
      </Accordion.Item>
    );
  };

  useEffect(() => {
    setLectures((prevState) => {
      let ld = { ...prevState };
      ld = lectures.map(mapLecture);
      return ld;
    });
  }, [lectures]);

  return (
    <Fragment>
      <Accordion defaultActiveKey="0">{lectureState}</Accordion>
    </Fragment>
  );
}

CourseAccordion.propTypes = {
  lectures: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      courseId: PropTypes.number.isRequired,
      subject: PropTypes.string,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      duration: PropTypes.string.isRequired,
      fileUrl: PropTypes.string.isRequired,
      imageUrl: PropTypes.string.isRequired,
      lectureSections: PropTypes.number.isRequired,
      modifiedBy: PropTypes.string,
      sortOrder: PropTypes.number.isRequired,
      status: PropTypes.string,
    })
  ).isRequired,
};
export default CourseAccordion;
