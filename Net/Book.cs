using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Domain
{
    public class Book
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Author { get; set; }
        public string Url { get; set; }
        public LookUp Status { get; set; }
        public BaseUser CreatedBy { get; set; }
        public BaseUser ModifiedBy { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime DateModified { get; set; }
        public bool IsDeleted { get; set; }
    }
}
