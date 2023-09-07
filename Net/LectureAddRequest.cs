using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
namespace MoneFi.Models.Requests
{
    public class LectureAddRequest
    {
        [Required]
        [Range(1, int.MaxValue)]
        public int CourseId { get; set; }
        [Required]
        [StringLength(50, MinimumLength = 2)]
        public string Title { get; set; }
        [Required]
        [StringLength(500, MinimumLength = 2)]
        public string Description { get; set; }
        [Required]
        [StringLength(50, MinimumLength = 2)]
        public string Duration { get; set; }
        [StringLength(150, MinimumLength = 0)]
        public string ImageUrl { get; set; }
        [Required]
        [StringLength(150, MinimumLength = 2)]
        public string FileUrl { get; set; }
        [Required]
        [Range(1,50)]
        public int LectureSections { get; set; }
        [Required]
        [Range(1, 50)]
        public int SortOrder { get; set; }
    }
}
