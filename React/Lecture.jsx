import React, { useState, useEffect } from "react";
import debug from "sabio-debug";
import * as lectureService from "../../services/lectureService";
import LectureCard from "./LectureCard";
import { Button, Row, InputGroup, FormControl } from "react-bootstrap";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import locale from "rc-pagination/lib/locale/en_US";
import "./lecture.css";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

function Lecture({ currentUser }) {
  const _logger = debug.extend("Lectures");
  const navigate = useNavigate();
  const isAdmin = currentUser.roles.includes("Admin");
  const addLecture = (e) => {
    _logger(e);
    navigate(`/courses/lectures/create`);
  };
  const [pageValue, setPageValue] = useState({
    lecturesAr: [],
    lectureComponents: [],
    pageIndex: 0,
    pageSize: 8,
    current: 1,
    query: "",
    totalCount: 0,
  });
  _logger(currentUser);
  const mapLecture = (lecture) => {
    return <LectureCard aLecture={lecture} key={"ListA-" + lecture.id} />;
  };
  useEffect(() => {
    if (pageValue.query === "")
      lectureService
        .getLectures(pageValue.pageIndex, pageValue.pageSize)
        .then(onGetLectureSuccess)
        .catch(onGetLectureError);
    else {
      lectureService
        .getSearchLectures(
          pageValue.pageIndex,
          pageValue.pageSize,
          pageValue.query
        )
        .then(onGetLectureSuccess)
        .catch(onGetLectureError);
    }
  }, [pageValue.pageIndex, pageValue.query]);

  const onGetLectureSuccess = (response) => {
    _logger("All lectures", response);
    let newLectures = response.item.pagedItems;
    _logger(newLectures);
    setPageValue((prevState) => {
      const pd = { ...prevState };
      pd.lecturesAr = newLectures;
      pd.lectureComponents = newLectures.map(mapLecture);
      pd.totalCount = response.item.totalCount;
      return pd;
    });
  };
  const onGetLectureError = (err) => {
    _logger(err);
  };
  const handlePageChange = (page) => {
    setPageValue((prevState) => {
      const newState = { ...prevState };
      newState.current = page;
      newState.pageIndex = page - 1;
      _logger("page change new state", newState);
      return newState;
    });
  };

  const onSearchChange = (e) => {
    _logger(e);
    const { name, value } = e.target;
    setPageValue((prevState) => {
      let searchQuery = { ...prevState };
      searchQuery[name] = value;
      searchQuery.pageIndex = 0;
      _logger(searchQuery[name]);
      return searchQuery;
    });
  };
  _logger(currentUser.roles);
  return (
    <React.Fragment>
      <h1>Lectures</h1>
      <div className="justify-content-between row">
        <div className="col-md-4">
          <InputGroup>
            <FormControl
              className="mb-3"
              type="Search"
              name="query"
              placeholder="Search By Title"
              value={pageValue.query}
              onChange={onSearchChange}
            />
          </InputGroup>
        </div>
        <Pagination
          className="pb-3 pt-3 col-md-4 text-center"
          showTotal={(total, range) =>
            `Showing ${range[0]}-${range[1]} of ${total}`
          }
          locale={locale}
          onChange={handlePageChange}
          current={pageValue.pageIndex + 1}
          total={pageValue.totalCount}
          pageSize={pageValue.pageSize}
        />
        {isAdmin && (
          <div className="col-md-4">
            <Button
              className="mb-3 float-end"
              variant="primary"
              onClick={addLecture}
            >
              Add Lecture
            </Button>
          </div>
        )}
      </div>
      <Row className="col-12 mx-center">{pageValue.lectureComponents}</Row>
    </React.Fragment>
  );
}

Lecture.propTypes = {
  currentUser: PropTypes.shape({
    avatarUrl: PropTypes.string.isRequired,
    firstName: PropTypes.string.isRequired,
    roles: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
};

export default React.memo(Lecture);
