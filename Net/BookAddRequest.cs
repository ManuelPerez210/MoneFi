using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MoneFi.Models.Requests.Books
{
    public class BookAddRequest
    {
        [Required]
        [StringLength(200, MinimumLength = 2)]
        public string Title { get; set; }
        [Required]
        [StringLength(200, MinimumLength = 2)]
        public string Author { get; set; }
        [Required]
        [StringLength(200, MinimumLength = 2)]
        public string Url { get; set; }
    }
}
