import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import debug from "sabio-debug";
import { formatDate } from "../../utils/dateFormater";
import BlogImagePlaceholder from "../../assets/images/placeholder/4by3.jpg";
import ChildCommentForm from "components/comments/ChildCommentForm";
import Ratings from "components/ratings/Ratings";
import "./blogs.css";
const BlogCardFullWidth = (props) => {
  const [showModal, setShowModal] = useState(false);
  const _logger = debug.extend("Blogs");
  let { element, currentUser } = props;
  const { state } = useLocation();
  _logger("blog", state, element);

  const { blogId } = useParams();
  const navigate = useNavigate();
  if (element && blogId) {
    _logger("BlogCardFullWidth", element, blogId);
  }

  const onBlogsClicked = (e) => {
    e.preventDefault();

    _logger("Go back...");
    navigate("/blogs");
  };
  const onBlogsClickedGoBack = (e) => {
    e.preventDefault();

    _logger("Go back...");
    navigate(-1);
  };
  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <React.Fragment>
      <div className="row p-4 bg-white justify-content-between">
        <Button
          className="mb-2 small-button blogs-button"
          variant="link"
          onClick={onBlogsClicked}
        >
          {"<- Show All Blogs"}
        </Button>

        <Button
          className="mb-2 small-button blogs-button"
          variant="link"
          onClick={onBlogsClickedGoBack}
        >
          {"<- Go back"}
        </Button>
      </div>
      <div className="py-4 py-lg-8 pb-14 bg-white">
        <div className="container-fluid">
          <div className="justify-content-center row">
            <div className="mb-2 col-xl-8 col-lg-8 col-md-12 col-sm-12">
              <div className="text-center mb-4">
                <a className="fs-5 fw-semi-bold d-block mb-4 text-primary">
                  {state.blogType.name}
                </a>
                <h1 className="display-3 fw-bold mb-4">{state.title}</h1>
                <span className="mb-3 d-inline-block">{state.subject}</span>
              </div>

              <div className="d-flex justify-content-between align-items-center mb-5">
                <div className="d-flex align-items-center">
                  <img
                    src={state.author.avatarUrl}
                    alt=""
                    className="rounded-circle avatar-md"
                  />
                  <div className="ms-2 lh-1">
                    <h5 className="mb-1 ">
                      {" "}
                      {state.author.firstName} {state.author.lastName}{" "}
                    </h5>
                    <span className="">{formatDate(state.dateModified)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-center p-2 ">
            <img
              src={state.imageUrl}
              className="img-fluid rounded-3 mb-7 blogs-main-image"
              alt="BlogImagePlaceholder"
              onError={({ currentTarget }) => {
                currentTarget.onerror = null;
                currentTarget.src = BlogImagePlaceholder;
              }}
            ></img>
          </div>
        </div>
        <div className="justify-content-center row">
          <div className="mb-2 col-xl-8 col-lg-8 col-md-9 col-sm-8 col-8">
            {state.content}
            <hr className="mt-8 mb-5" />
            <div className="d-flex justify-content-between align-items-center mb-5">
              <div className="d-flex align-items-center">
                <img
                  src={state.author.avatarUrl}
                  alt=""
                  className="rounded-circle avatar-md"
                />
                <div className="ms-2 lh-1 container-content-text">
                  <h5 className="mb-1 ">
                    {" "}
                    {state.author.firstName} {state.author.lastName}
                  </h5>
                  <span className="text">{formatDate(state.dateModified)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <button
          type="button"
          className="comments-headline-button"
          onClick={openModal}
        >
          Comments
        </button>
      </div>
      <div className="ratings-container">
        <div className="text-center">
          <span>Click to Submit Rating</span>
          <Ratings entityId={state.id} entityTypeId={1} />
        </div>
      </div>

      <Modal
        show={showModal}
        onHide={closeModal}
        className="comment-modal-right comment-modal-content"
      >
        <Modal.Header className="comment-modal-header" closeButton>
          <Modal.Title className="comment-modal-title">Comments</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Welcome to our new comments section!
          <br />
          Leave your thoughts, feedback, and questions below. We{"'"}d love to
          hear from you!
          <br />
          If you are experiencing any technical difficulties, email{" "}
          <u>support@MoneFi.com</u>.
          <ChildCommentForm
            entityId={state.id}
            entityTypeId={1}
            currentUser={currentUser}
          />
        </Modal.Body>
      </Modal>
    </React.Fragment>
  );
};

BlogCardFullWidth.propTypes = {
  element: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    subject: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    imageUrl: PropTypes.string.isRequired,
    author: PropTypes.shape({
      id: PropTypes.number.isRequired,
      userId: PropTypes.number.isRequired,
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
      mi: PropTypes.string.isRequired,
      avatarUrl: PropTypes.string.isRequired,
    }).isRequired,
    BlogsCard: PropTypes.string.isRequired,
  }).isRequired,
  currentUser: PropTypes.shape({
    firstName: PropTypes.string.isRequired,
    avatarUrl: PropTypes.string.isRequired,
  }).isRequired,
};

export default BlogCardFullWidth;
