﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace Sabio.Models.Domain
{
    public class Lecture
    {
        public int Id { get; set; }
        public int CourseId { get; set; }
        public string Subject { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Duration { get; set; }
        public string ImageUrl { get; set; }
        public string FileUrl { get; set; }
        public int LectureSections { get; set; }
        public int SortOrder { get; set; }
        public LookUp Status { get; set; }
        public BaseUser CreatedBy { get; set; }
        public BaseUser ModifiedBy { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime DateModified { get; set; }
    }
}