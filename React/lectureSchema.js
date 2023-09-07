import * as Yup from "yup";

const LectureSchema = Yup.object().shape({
    courseId: Yup.number().required("required"),
    title: Yup.string().min(2).max(50).required("required"),
    description: Yup.string().min(2).max(500).required("required"),
    duration: Yup.string().min(2).max(50).required("required"),
    imageUrl: Yup.string().min(2).max(150),
    fileUrl: Yup.string().min(2).max(150).required("required"),
    lectureSections: Yup.number().required("required"),
    sortOrder: Yup.number().required("required"),
});

export default LectureSchema