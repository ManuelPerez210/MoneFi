using Sabio.Data.Providers;
using Sabio.Models.Domain;
using Sabio.Models.Requests;
using Sabio.Models;
using Sabio.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Sabio.Data;
using Sabio.Models.Requests.Books;

namespace Sabio.Services
{
    public class BooksService : IBooksService
    {
        IDataProvider _data = null;
        ILookUpService _lookUpService = null;
        IBaseUserMapper _baseUserMapper = null;
        public BooksService(IDataProvider data, ILookUpService lookUpService, IBaseUserMapper baseUserMapper)
        {
            _data = data;
            _lookUpService = lookUpService;
            _baseUserMapper = baseUserMapper;
        }
        public Book Get(int id)
        {
            string procName = "[dbo].[Books_SelectById]";
            Book book = null;
            _data.ExecuteCmd(procName, delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@Id", id);
            }, delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                book = MapSingleBook(reader, ref startingIndex);
            }
            );
            return book;
        }
       

        public Paged<Book> GetAllPaginated(int pageIndex, int pageSize)
        {
            string procName = "[dbo].[Books_SelectAllPaginated]";
            Paged<Book> pagedResult = null;
            List<Book> result = null;
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
                    Book book = MapSingleBook(reader, ref startIndex);
                    if (totalCount == 0)
                    {
                        totalCount = reader.GetSafeInt32(startIndex++);
                    }
                    if (result == null)
                    {
                        result = new List<Book>();
                    }
                    result.Add(book);
                }
            );
            if (result != null)
            {
                pagedResult = new Paged<Book>(result, pageIndex, pageSize, totalCount);
            }
            return pagedResult;
        }
        
        public int Add(BookAddRequest model, int userId)
        {
            int id = 0;
            string procName = "[dbo].[Books_Insert]";
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
        public void Update(BookUpdateRequest model, int userId)
        {
            string procName = "[dbo].[Books_Update]";
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
            string procName = "[dbo].[Books_Delete_ById]";
            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection collection)
            {
                collection.AddWithValue("@Id", id);
            }, returnParameters: null
            );
        }
        private Book MapSingleBook(IDataReader reader, ref int startingIndex)
        {
            Book aBook = new Book();

            aBook.Id = reader.GetSafeInt32(startingIndex++);
            aBook.Title = reader.GetSafeString(startingIndex++);
            aBook.Author = reader.GetSafeString(startingIndex++);
            aBook.Url = reader.GetSafeString(startingIndex++);
            aBook.Status = _lookUpService.MapSingleLookUp(reader, ref startingIndex);
            aBook.CreatedBy = _baseUserMapper.MapBaseUser(reader, ref startingIndex);
            aBook.ModifiedBy = _baseUserMapper.MapBaseUser(reader, ref startingIndex);
            aBook.DateCreated = reader.GetSafeDateTime(startingIndex++);
            aBook.DateModified = reader.GetSafeDateTime(startingIndex++);
            aBook.IsDeleted = reader.GetSafeBool(startingIndex++);

            return aBook;
        }
        private static void AddCommonParams(BookAddRequest model, SqlParameterCollection collection)
        {
            collection.AddWithValue("@Title", model.Title);
            collection.AddWithValue("@Author", model.Author);
            collection.AddWithValue("@Url", model.Url);
        }
    }
}
