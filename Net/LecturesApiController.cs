using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using MoneFi.Models;
using MoneFi.Services;
using MoneFi.Web.Controllers;
using MoneFi.Web.Models.Responses;
using System.Collections.Generic;
using System.Data.SqlClient;
using System;
using MoneFi.Models.Interfaces;
using MoneFi.Models.Domain;
using MoneFi.Models.Requests;
using MoneFi.Models.Domain.LoanApplications;
using MoneFi.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;

namespace MoneFi.Web.Api.Controllers
{
    [Route("api/lectures")]
    [ApiController]
    public class LecturesApiController : BaseApiController
    {
        private ILecturesService _service = null;
        private IAuthenticationService<int> _authService = null;
        public LecturesApiController(ILecturesService service,
            ILogger<LecturesApiController> logger,
            IAuthenticationService<int> authService) : base(logger)
        {
            _service = service;
            _authService = authService;
        }
       
        [HttpGet("{id:int}")]
        public ActionResult<ItemResponse<Lecture>> GetById(int id)
        {
            int iCode = 200;
            BaseResponse response = null;
            try
            {
                Lecture lecture = _service.Get(id);

                if (lecture == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("Lecture not found");
                }

                else
                {
                    response = new ItemResponse<Lecture> { Item = lecture };

                }
            }
            catch (Exception ex)
            {
                iCode = 500;
                response = new ErrorResponse($"Generic Error: {ex.Message}");
            }
            return StatusCode(iCode, response);

        }
        [AllowAnonymous]
        [HttpGet("courseId/{courseId:int}")]
        public ActionResult<ItemsResponse<Lecture>> GetByCourseId(int courseId) 
        { 
            int iCode =200;
            BaseResponse response = null;

            try
            {
                List<Lecture> list = _service.GetByCourseId(courseId);

                if(list== null)
                {
                    iCode = 404;
                    response = new ErrorResponse("Lectures not found");
                }
                else
                {
                    response = new ItemsResponse<Lecture> { Items = list };
                }
            }
            catch(SqlException ex)
            {
                iCode = 500;
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse($"Generic Error: ${ex.Message}");
            }
            return StatusCode(iCode, response);

        }

        [HttpGet("paginated")]
        public ActionResult<ItemResponse<Paged<Lecture>>> GetAllPaginated(int pageIndex, int pageSize)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                Paged<Lecture> list = _service.GetAllPaginated(pageIndex, pageSize);


                if (list == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("Lectures not found.");
                }
                else
                {
                    response = new ItemResponse<Paged<Lecture>> { Item = list };
                }
            }
            catch (Exception ex)
            {
                iCode = 500;
                response = new ErrorResponse($"Generic Error: {ex.Message}");
            }

            return StatusCode(iCode, response);
        }

        [HttpGet("search")]
        public ActionResult<ItemResponse<Paged<Lecture>>> SearchPaginated(int pageIndex, int pageSize, string query)
        {
            int iCode = 200;
            BaseResponse response = null;
            try
            {
                Paged<Lecture> paged = _service.SearchPagination(pageIndex, pageSize, query);

                if (paged == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("Lecture not found");
                }

                else
                {
                    response = new ItemResponse<Paged<Lecture>> { Item = paged };

                }
            }
            catch (Exception ex)
            {
                iCode = 500;
                response = new ErrorResponse($"Generic Error: {ex.Message}");
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(iCode, response);
        }

        [HttpPost]
        public ActionResult<ItemResponse<int>> Create(LectureAddRequest model)
        {
            int iCode = 201;
            BaseResponse response = null;
            try
            {
                int userId = _authService.GetCurrentUserId();
                int id = _service.Add(model, userId);
                ItemResponse<int> itemResponse = new ItemResponse<int>() { Item = id };
                response = itemResponse;
                iCode = 201;
            }
            catch (Exception ex)
            {
                iCode = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(iCode, response);
        }

        [HttpDelete("{id:int}")]
        public ActionResult<SuccessResponse> Delete(int id)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                _service.Delete(id);

                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                iCode = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(iCode, response);
        }
        [HttpPut("{id:int}")]
        public ActionResult<ItemResponse<int>> Update(LectureUpdateRequest model)
        {
            int iCode = 200;
            BaseResponse response = null;
            IUserAuthData user = _authService.GetCurrentUser();
            try
            {
                _service.Update(model, user.Id);
                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                iCode = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(iCode, response);
        }
    }
}
