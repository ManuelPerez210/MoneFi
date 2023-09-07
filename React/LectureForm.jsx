import React, { useState, Fragment, useEffect } from "react";
import toastr from "toastr";
import debug from "sabio-debug";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as lectureService from "../../services/lectureService";
import LectureSchema from "../../schemas/lectureSchema";
import { Col, Row, Button, Card } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { BiArrowToLeft } from "react-icons/bi";
import PropTypes from "prop-types";
import lectureImageDefault from "../../assets/images/placeholder/4by3.jpg";
import lookUpService from "services/lookUpService";
import UploadFile from "../files/UploadFile";

function LectureForm() {
  const [formData, setFormData] = useState({
    courseId: "",
    title: "",
    description: "",
    duration: "",
    imageUrl: "",
    fileUrl: "",
    lectureSections: "",
    sortOrder: "",
  });

  const _logger = debug.extend("Lecture Form");

  const { updateId } = useParams();
  useEffect(() => {
    if (updateId) {
      lectureService
        .getLectureById(updateId)
        .then(onGetByIdSuccess)
        .catch(onGetByIdError);
    }
  }, [updateId]);
  const onGetByIdSuccess = (response) => {
    _logger(response);
    setFormData(() => {
      const obj = {
        id: response.item.id,
        courseId: response.item.courseId,
        title: response.item.title,
        description: response.item.description,
        duration: response.item.duration,
        imageUrl: response.item.imageUrl,
        fileUrl: response.item.fileUrl,
        lectureSections: response.item.lectureSections,
        sortOrder: response.item.sortOrder,
      };
      return obj;
    });
  };
  const onGetByIdError = (err) => {
    _logger(err);
    toastr.error("Lecture not found");
  };

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    setFormData(values);
    const setSubmit = setSubmitting(false);

    if (updateId && values) {
      lectureService
        .updateLecture(updateId, values)
        .then(onLectureEditSuccess)
        .catch(onLectureEditError)
        .finally(setSubmit);
    } else {
      lectureService
        .Add(values)
        .then(onLectureAddSuccess)
        .catch(onLectureAddError)
        .finally(() => {
          setSubmitting(false);
          resetForm({
            values: {
              courseId: "",
              title: "",
              description: "",
              duration: "",
              imageUrl: "",
              fileUrl: "",
              lectureSections: "",
              sortOrder: "",
            },
          });
        });
    }
  };
  const onLectureEditSuccess = (response) => {
    _logger("edit", response);
    toastr.success("Lecture Updated");
  };
  const onLectureEditError = (err) => {
    _logger(err);
    toastr.error("Update failed");
  };

  const onLectureAddSuccess = (response) => {
    _logger(response);
    toastr.success("Lecture Added");
  };
  const onLectureAddError = (err) => {
    _logger(err);
    toastr.error("Lecture Not Added");
  };

  const navigate = useNavigate();
  const onReturn = (e) => {
    _logger(e);
    navigate(`/courses/lectures`);
  };

  useEffect(() => {
    lookUpService
      .getTypes(["Courses"])
      .then(onGetCourseTitlesSuccess)
      .catch(onGetCourseTitlesError);
  }, []);
  const onGetCourseTitlesSuccess = (response) => {
    let newSubjects = response.item.courses;
    setDropdownTitles((prevState) => {
      const pageData = { ...prevState };
      pageData.titles = newSubjects;
      pageData.dropdownTitlesList = newSubjects.map(mapTitles);
      return pageData;
    });
  };

  const onGetCourseTitlesError = (err) => {
    _logger(err);
    toastr.error("Course not found");
  };

  const [dropdownTitles, setDropdownTitles] = useState({
    titles: [],
    dropdownTitlesList: [],
  });
  const mapTitles = (singleTitle, index) => {
    _logger("map subjects", singleTitle);
    return (
      <option className="optionStyle" value={singleTitle.id} key={index}>
        {singleTitle.name}
      </option>
    );
  };
  const isUpdating = !!updateId;

  return (
    <Fragment>
      <Row>
        <Col lg={12} md={12} sm={12}>
          <div className="border-bottom pb-4 mb-4 d-md-flex align-items-center justify-content-between">
            <div className="mb-3 mb-md-0"></div>
          </div>
        </Col>
      </Row>
      <div className="py-6">
        <Row>
          <Col xl={{ offset: 3, span: 6 }} md={12} xs={12}>
            <Card>
              <Card.Header className="border-bottom px-4 py-3">
                <h1 className="mb-1 h2 fw-bold">
                  {isUpdating ? "Update Lecture" : "Create New Lecture"}
                </h1>
              </Card.Header>
              <Card.Body className="p-lg-6">
                <Formik
                  enableReinitialize={true}
                  initialValues={formData}
                  onSubmit={handleSubmit}
                  validationSchema={LectureSchema}
                >
                  {({ handleSubmit, isSubmitting, errors, setFieldValue }) => (
                    <Form>
                      <BiArrowToLeft
                        cursor="pointer"
                        size="50"
                        onClick={onReturn}
                      >
                        Return
                      </BiArrowToLeft>
                      <Row>
                        <Col md={6} xs={12} className="mb-3">
                          <label
                            className="form-label"
                            htmlFor="formProjectTitle"
                          >
                            Course Title
                          </label>
                          <Field
                            as="select"
                            type="text"
                            name="courseId"
                            isInvalid={!!errors.courseId}
                            className="form-control optionStyle"
                          >
                            <option value={0}>Select...</option>
                            {dropdownTitles.dropdownTitlesList}
                          </Field>
                          <ErrorMessage
                            name="courseId"
                            component="div"
                            className="has-error"
                          />
                        </Col>
                        <Col md={6} xs={12} className="mb-3">
                          <label
                            className="form-label"
                            htmlFor="formProjectTitle"
                          >
                            Lecture Title
                          </label>
                          <Field
                            type="text"
                            name="title"
                            className="form-control"
                          />
                          <ErrorMessage
                            name="title"
                            component="div"
                            className="has-error"
                          />
                        </Col>
                        <Row md={6} xs={12} className="mb-3">
                          <Col>
                            <label
                              className="form-label mb-3"
                              htmlFor="formProjectTitle"
                            >
                              Description
                            </label>
                          </Col>
                          <Field
                            as="textarea"
                            name="description"
                            className="form-control"
                          />
                          <ErrorMessage
                            name="description"
                            component="div"
                            className="has-error"
                          />
                        </Row>
                        <Col md={6} xs={12} className="mb-3">
                          <Col>
                            <label
                              className="form-label"
                              htmlFor="formProjectTitle"
                            >
                              Duration
                            </label>
                          </Col>
                          <Field
                            type="text"
                            name="duration"
                            className="form-control"
                          />
                          <ErrorMessage
                            name="duration"
                            component="div"
                            className="has-error"
                          />
                        </Col>
                        <Col md={6} xs={12} className="mb-3">
                          <label
                            className="form-label"
                            htmlFor="formProjectTitle"
                          >
                            SortOrder
                          </label>
                          <Field
                            type="number"
                            name="sortOrder"
                            className="form-control"
                          />
                          <ErrorMessage
                            name="sortOrder"
                            component="div"
                            className="has-error"
                          />
                        </Col>
                        <Row>
                          <Col
                            md={3}
                            xs={6}
                            className="mb-3 d-flex align-items-center"
                          ></Col>
                          <Row md={9} xs={18} className="mb-3">
                            <div className="d-flex align-items-center">
                              <label
                                className="form-label mb-0"
                                htmlFor="formProjectTitle"
                              >
                                CoverImage
                              </label>
                              <Field
                                type="input"
                                name="imageUrl"
                                alt="lectureImageDefault"
                                placeholder="Please add a cover image for lecture"
                                onError={({ currentTarget }) => {
                                  currentTarget.onerror = null;
                                  currentTarget.src = lectureImageDefault;
                                }}
                                className="form-control refreshIcon"
                              />
                            </div>
                            <ErrorMessage
                              name="imageUrl"
                              component="div"
                              className="has-error"
                            />
                            <p>Drag and drop or upload an image. </p>
                            <div className="w-50 mx-18">
                              <UploadFile
                                getResponseFile={(arr) => {
                                  setFieldValue("imageUrl", arr[0].url);
                                }}
                              />
                            </div>
                          </Row>
                        </Row>
                        <Row>
                          <Col
                            md={3}
                            xs={6}
                            className="mb-3 d-flex align-items-center"
                          ></Col>
                          <Row md={9} xs={18} className="mb-3">
                            <div className="d-flex align-items-center">
                              <label
                                className="form-label mb-0"
                                htmlFor="formProjectTitle"
                              >
                                LectureFile
                              </label>
                              <Field
                                type="input"
                                name="fileUrl"
                                placeholder="Please add a lecture file"
                                className="form-control refreshIcon"
                              />
                            </div>
                            <ErrorMessage
                              name="fileUrl"
                              component="div"
                              className="has-error"
                            />
                            <p>Drag and drop or upload a lecture file. </p>
                            <div className="w-50 mx-18">
                              <UploadFile
                                getResponseFile={(arr) => {
                                  setFieldValue("fileUrl", arr[0].url);
                                }}
                              />
                            </div>
                          </Row>
                        </Row>
                        <Col md={6} xs={12} className="mb-3">
                          <label
                            className="form-label"
                            htmlFor="formProjectTitle"
                          >
                            Lecture Sections
                          </label>
                          <Field
                            type="number"
                            name="lectureSections"
                            className="form-control"
                          />
                          <ErrorMessage
                            name="lectureSections"
                            component="div"
                            className="has-error"
                          />
                        </Col>
                        <Col xs={12}>
                          <Button
                            variant="primary"
                            type="button"
                            disabled={isSubmitting}
                            onClick={handleSubmit}
                          >
                            Submit
                          </Button>
                          {"  "}
                        </Col>
                      </Row>
                    </Form>
                  )}
                </Formik>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </Fragment>
  );
}

LectureForm.propTypes = {
  state: PropTypes.shape({
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

export default LectureForm;
