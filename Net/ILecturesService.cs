using MoneFi.Models.Domain;
using MoneFi.Models.Requests;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MoneFi.Models.Interfaces
{
    public interface ILecturesService
    {
        int Add(LectureAddRequest model, int currentUserId);
        void Delete(int id);
        Lecture Get(int id);
        List<Lecture> GetByCourseId(int courseId);
        void Update(LectureUpdateRequest model, int userId);
        Paged<Lecture> GetAllPaginated(int pageIndex, int pageSize);
        Paged<Lecture> SearchPagination(int pageIndex, int pageSize, string query);
    }
}
