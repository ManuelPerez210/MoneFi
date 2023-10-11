using Sabio.Models.Domain;
using Sabio.Models.Requests;
using Sabio.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Sabio.Models.Requests.Books;

namespace Sabio.Services.Interfaces
{
    public interface IBooksService
    {
        int Add(BookAddRequest model, int currentUserId);
        void Delete(int id);
        Book Get(int id);
        void Update(BookUpdateRequest model, int userId);
        Paged<Book> GetAllPaginated(int pageIndex, int pageSize);
    }
}
