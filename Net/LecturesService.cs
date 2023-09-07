using MoneFi.Data.Providers;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Data;
using MoneFi.Data;
using MoneFi.Models.Interfaces;
using MoneFi.Models.Domain;
using MoneFi.Models.Requests;
using MoneFi.Models;
using MoneFi.Services.Interfaces;


namespace MoneFi.Services
{
    public class LecturesService : ILecturesService
    {
        IDataProvider _data = null;
        ILookUpService _lookUpService = null;
        IBaseUserMapper _baseUserMapper = null;
        public LecturesService(IDataProvider data, ILookUpService lookUpService, IBaseUserMapper baseUserMapper)
        {
            _data = data;
            _lookUpService = lookUpService;
            _baseUserMapper = baseUserMapper;
        }
        public Lecture Get(int id)
        {
            string procName = "[dbo].[Lectures_SelectById]";
            Lecture lecture = null;
            _data.ExecuteCmd(procName, delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@Id", id);
            }, delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                lecture = MapSingleLecture(reader, ref startingIndex);
            }
            );
            return lecture;
        }
        public List<Lecture> GetByCourseId(int courseId)
        {
            List<Lecture> list = null;

            string procName = "[dbo].[Lectures_Select_ByCourseId]";
            _data.ExecuteCmd(procName, delegate (SqlParameterCollection paramCollection)
            {

                paramCollection.AddWithValue("@Id", courseId);

            }, delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                Lecture aLecture = MapLectureByCourseId(reader, ref startingIndex);

                if (list == null)
                {
                    list = new List<Lecture>();
                }
                list.Add(aLecture);
            }
            );
            return list;
        }

        public Paged<Lecture> GetAllPaginated(int pageIndex, int pageSize)
        {
            string procName = "[dbo].[Lectures_SelectAllPaginated]";
            Paged<Lecture> pagedResult = null;
            List<Lecture> result = null;
            int totalCount = 0;
            _data.ExecuteCmd(
                procName,
                delegate (SqlParameterCollection col)
                {
                    col.AddWithValue("@PageIndex", pageIndex);
                    col.AddWithValue("@PageSize", pageSize);
                },
                delegate (IDataReader reader, short set)
                {
                    int startIndex = 0;
                    Lecture lecture = MapSingleLecture(reader, ref startIndex);
                    if (totalCount == 0)
                    {
                        totalCount = reader.GetSafeInt32(startIndex++);
                    }
                    if (result == null)
                    {
                        result = new List<Lecture>();
                    }
                    result.Add(lecture);
                }
            );
            if (result != null)
            {
                pagedResult = new Paged<Lecture>(result, pageIndex, pageSize, totalCount);
            }
            return pagedResult;
        }
        public Paged<Lecture> SearchPagination(int pageIndex, int pageSize, string query)
        {
            Paged<Lecture> pagedResult = null;
            List<Lecture> result = null;
            int totalCount = 0;
            string procname = "[dbo].[Lectures_SearchPagination]";
            _data.ExecuteCmd(
                procname,
                inputParamMapper: delegate (SqlParameterCollection parameterCollection)
                {
                    parameterCollection.AddWithValue("@PageIndex", pageIndex);
                    parameterCollection.AddWithValue("@PageSize", pageSize);
                    parameterCollection.AddWithValue("@Query", query);
                },
                singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    Lecture model = new Lecture();
                    int startingIndex = 0;
                    model = MapSingleLecture(reader, ref startingIndex);
                    if (totalCount == 0)
                    {
                        totalCount = reader.GetSafeInt32(startingIndex++);
                    }
                    if (result == null)
                    {
                        result = new List<Lecture>();
                    }
                    result.Add(model);
                }
            );
            if (result != null)
            {
                pagedResult = new Paged<Lecture>(result, pageIndex, pageSize, totalCount);
            }
            return pagedResult;
        }
        public int Add(LectureAddRequest model, int userId)
        {
            int id = 0;
            string procName = "[dbo].[Lectures_Insert]";
            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection collection)
            {
                AddCommonParams(model, collection);
                collection.AddWithValue("@CreatedBy", userId);
                SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                idOut.Direction = ParameterDirection.Output;
                collection.Add(idOut);
            }, returnParameters: delegate (SqlParameterCollection returnCollection)
            {
                object oId = returnCollection["@Id"].Value;
                int.TryParse(oId.ToString(), out id);
            }
            );
            return id;
        }
        public void Update(LectureUpdateRequest model, int userId)
        {
            string procName = "[dbo].[Lectures_Update]";
            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection collection)
            {
                AddCommonParams(model, collection);
                collection.AddWithValue("@Id", model.Id);
                collection.AddWithValue("@ModifiedBy", userId);
            }, returnParameters: null
            );
        }
        public void Delete(int id)
        {
            int ID = id;
            string procName = "[dbo].[Lectures_Delete_ById]";
            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection collection)
            {
                collection.AddWithValue("@Id", id);
            }, returnParameters: null
            );
        }
        private Lecture MapSingleLecture(IDataReader reader, ref int startingIndex)
        {
            Lecture aLecture = new Lecture();

            aLecture.Id = reader.GetSafeInt32(startingIndex++);
            aLecture.CourseId = reader.GetSafeInt32(startingIndex++);
            aLecture.Subject = reader.GetSafeString(startingIndex++);
            aLecture.Title = reader.GetSafeString(startingIndex++);
            aLecture.Description = reader.GetSafeString(startingIndex++);
            aLecture.Duration = reader.GetSafeString(startingIndex++);
            aLecture.ImageUrl = reader.GetSafeString(startingIndex++);
            aLecture.FileUrl = reader.GetSafeString(startingIndex++);
            aLecture.LectureSections = reader.GetSafeInt32(startingIndex++);
            aLecture.SortOrder = reader.GetSafeInt32(startingIndex++);
            aLecture.Status = _lookUpService.MapSingleLookUp(reader, ref startingIndex);
            aLecture.CreatedBy = _baseUserMapper.MapBaseUser(reader, ref startingIndex);
            aLecture.ModifiedBy = _baseUserMapper.MapBaseUser(reader, ref startingIndex);
            aLecture.DateCreated = reader.GetSafeDateTime(startingIndex++);
            aLecture.DateModified = reader.GetSafeDateTime(startingIndex++);

            return aLecture;
        }
        private static Lecture MapLectureByCourseId(IDataReader reader, ref int startingIndex)
        {
            Lecture aLecture = new Lecture();
            aLecture.Id = reader.GetSafeInt32(startingIndex++);
            aLecture.CourseId = reader.GetSafeInt32(startingIndex++);
            aLecture.Title = reader.GetSafeString(startingIndex++);
            aLecture.Description = reader.GetSafeString(startingIndex++);   
            aLecture.Duration = reader.GetSafeString(startingIndex++);
            aLecture.ImageUrl= reader.GetSafeString(startingIndex++);
            aLecture.FileUrl = reader.GetSafeString(startingIndex++);

            return aLecture;
        }
        private static void AddCommonParams(LectureAddRequest model, SqlParameterCollection collection)
        {
            collection.AddWithValue("@CourseId", model.CourseId);
            collection.AddWithValue("@Title", model.Title);
            collection.AddWithValue("@Description", model.Description);
            collection.AddWithValue("@Duration", model.Duration);
            collection.AddWithValue("@ImageUrl", model.ImageUrl);
            collection.AddWithValue("@FileUrl", model.FileUrl);
            collection.AddWithValue("@LectureSections", model.LectureSections);
            collection.AddWithValue("@SortOrder", model.SortOrder);
        }
    }
}
