import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import "../blogs/blogs.css";
import blogsService from "services/blogsService";
import lookUpService from "services/lookUpService";
import UploadFile from "../files/UploadFile";
import validBlogSchema from "schemas/validBlogSchema";
import BlogImagePlaceholder from "../../assets/images/placeholder/4by3.jpg";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import * as DOMPurify from "dompurify";
import { Formik, Form, Field, ErrorMessage } from "formik";
import PropTypes from "prop-types";
import { Card } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logger from "sabio-debug";
import swal from "sweetalert2";

const BlogsForm = (props) => {
  const _logger = logger.extend("BlogsForm");
  const location = useLocation();

  const [blogTypes, setBlogTypes] = useState({ mappedTypes: [] });

  const [blogInit, setBlogInit] = useState({
    blogTypeId: "",
    authorId: props.currentUser.id,
    title: "",
    subject: "",
    content: "",
    isPublished: false,
    imageUrl: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    lookUpService
      .getTypes(["BlogTypes"])
      .then(getTypesSuccess)
      .catch(getTypesError);
  }, []);

  useEffect(() => {
    if (location?.state?.payload) {
      setBlogInit((prevState) => {
        let ps = { ...prevState };
        ps.blogTypeId = location?.state?.payload?.blogType?.id;
        ps.authorId = location?.state?.payload?.authorId;
        ps.title = location?.state?.payload?.title;
        ps.subject = location?.state?.payload?.subject;
        ps.content = location?.state?.payload?.content;
        ps.isPublished = location?.state?.payload?.isPublished;
        ps.imageUrl = location?.state?.payload?.imageUrl;
        return ps;
      });
    }
  }, []);

  const getTypesSuccess = (response) => {
    setBlogTypes((prevState) => {
      const ps = { ...prevState };
      ps.mappedTypes = response.item.blogTypes.map(mapOptions);
      return ps;
    });
    _logger("GETTYPES SUCCESS", response);
  };

  const getTypesError = (error) => {
    toast.error(
      "Something went wrong there is no Blog Type to choose from 😔."
    );
    _logger("GETTYPES ERROR", error);
  };

  const mapOptions = (element) => (
    <option key={`BLOGTYPE_OPTION_ID: ${element.id}`} value={element.id}>
      {element.name}
    </option>
  );

  const onSubmit = (values) => {
    values.content = DOMPurify.sanitize(values.content, {
      USE_PROFILES: { html: false },
    });
    _logger("VALUES ONSUBMIT", values);

    const blogServiceAddSuccess = (response) => {
      toast.success("Blog has been successfully created. 🤩");
      _logger("ADD RESPONSE", response);
    };

    const blogServiceAddError = (err) => {
      toast.error("Something went wrong 😔. Your blog was not added.");
      _logger("ADD ERROR", err);
    };

    const blogServiceUpdateSuccess = (response) => {
      toast.success("Blog has been successfuly updated. 🤩");
      _logger("ADD RESPONSE", response);
    };

    const blogServiceUpdateError = (err) => {
      toast.error("Something went wrong 😔. Your blog was not updated. ");
      _logger("ADD RESPONSE", err);
    };

    location?.state?.payload?.id
      ? blogsService
          .update(location?.state?.payload?.id, values)
          .then(blogServiceUpdateSuccess)
          .catch(blogServiceUpdateError)
      : blogsService
          .add(values)
          .then(blogServiceAddSuccess)
          .catch(blogServiceAddError);
  };

  const showConfirmationDialog = (values) => {
    if (!values.imageUrl) {
      swal
        .fire({
          title: "Are you sure?",
          text: "You are about to create a blog without a cover image. A placeholder image will be added in it's place until you are ready to add an image. Do you want to continue?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes, continue",
          cancelButtonText: "Cancel",
        })
        .then((result) => {
          if (result.isConfirmed) {
            setIsSubmitting(true);
            onSubmit(values);
          }
        });
    } else {
      setIsSubmitting(true);
      onSubmit(values);
    }
  };

  return (
    <>
      <div className="mt-3">
        <div className="container-fluid">
          <Formik
            enableReinitialize={true}
            initialValues={blogInit}
            validationSchema={validBlogSchema}
            onSubmit={onSubmit}
          >
            {({ values, setFieldValue }) => (
              <div className="row">
                <Form className="d-inline-flex ms-13">
                  <div className="col-4 mx-13 px-3 ms-3">
                    <div className="form-group formik-text py-1">
                      <label className="formik-text" htmlFor="blogTypeId">
                        Blog Type
                      </label>
                      <Field
                        className="form-control blogs-formik-focus"
                        type="number"
                        as="select"
                        name="blogTypeId"
                      >
                        <option value={0}>Please select a blog type...</option>
                        {blogTypes.mappedTypes}
                      </Field>
                      <ErrorMessage
                        className=" text-warning"
                        name="blogTypeId"
                        component="div"
                      />
                    </div>

                    <div className="form-group formik-text py-1">
                      <label htmlFor="title">Blog Title</label>
                      <Field
                        className="form-control blogs-formik-focus"
                        type="text"
                        name="title"
                      />
                      <ErrorMessage
                        className=" text-warning"
                        name="title"
                        component="div"
                      />
                    </div>

                    <div className="form-group formik-text py-1">
                      <label htmlFor="subject">Blog Subject</label>
                      <Field
                        className="form-control blogs-formik-focus"
                        type="text"
                        name="subject"
                      />
                      <ErrorMessage
                        className="text-warning"
                        name="subject"
                        component="div"
                      />
                    </div>

                    <div className="form-group formik-text py-1">
                      <label htmlFor="content">Blog Content</label>
                      <Field
                        className="form-control blogs-formik-focus text-warning"
                        type="text"
                        name="content"
                      >
                        {({ field }) => (
                          <CKEditor
                            name="content"
                            editor={ClassicEditor}
                            data={field.value}
                            onChange={(e, editor) => {
                              const data = editor.getData();
                              setFieldValue("content", data);
                              _logger("Change.", { e, editor, data });
                            }}
                          />
                        )}
                      </Field>
                      <ErrorMessage
                        name="content"
                        component="div"
                        className="text-warning"
                      />
                    </div>

                    <div className="form-group py-1 d-none">
                      <label htmlFor="formProjectTitle">Image Url</label>
                      <Field
                        className="form-control"
                        type="input"
                        name="imageUrl"
                        alt="BlogImageDefault"
                        placeholder="Please add a cover image for blogs"
                        onError={({ currentTarget }) => {
                          currentTarget.onerror = null;
                          currentTarget.src = BlogImagePlaceholder;
                        }}
                      />
                      <ErrorMessage
                        className="has-error"
                        name="imageUrl"
                        component="div"
                      />
                    </div>
                    <div className="w-100 my-3 cursor-pointer">
                      <label htmlFor="">Upload your image here</label>
                      <UploadFile
                        getResponseFile={(arr) => {
                          let fileUrl = arr[0].url;
                          setFieldValue("imageUrl", fileUrl);
                        }}
                      />
                    </div>

                    <div className="form-group py-1">
                      <label htmlFor="isPublished">Publish</label>
                      <Field
                        type="checkbox"
                        name="isPublished"
                        className="mx-1"
                      />
                      <ErrorMessage
                        className="text-warning"
                        name="isPublished"
                        component="div"
                      />
                    </div>

                    <button
                      className="btn btn-dark"
                      type="button"
                      onClick={() => showConfirmationDialog(values)}
                      disabled={isSubmitting}
                    >
                      Submit
                    </button>
                  </div>

                  <div className="col-4 py-4 ">
                    <Card className="blogs-box-gradient">
                      <Card.Img
                        className="mx-auto pt-4 blogs-form-card-img"
                        variant="top"
                        src={values.imageUrl || BlogImagePlaceholder}
                        alt="Alternative Text for the Image"
                      />
                      <Card.Header>
                        <h1 className="display-4 blogs-form-card-header">
                          {values.title}
                        </h1>
                      </Card.Header>
                      <Card.Body>
                        <h2 className="display-5">{values.subject}</h2>
                        <Card.Text>
                          {DOMPurify.sanitize(values.content, {
                            USE_PROFILES: { html: false },
                          })}
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </div>
                </Form>
              </div>
            )}
          </Formik>
        </div>
        <ToastContainer />
      </div>
    </>
  );
};

BlogsForm.propTypes = {
  currentUser: PropTypes.shape({
    id: PropTypes.number.isRequired,
    email: PropTypes.string.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    roles: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

UploadFile.propTypes = {
  getResponseFile: PropTypes.func.isRequired,
};

export default React.memo(BlogsForm);
