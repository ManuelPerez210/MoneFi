using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sabio.Models.Domain;
using Sabio.Models;
using Sabio.Models.Interfaces;
using Sabio.Models.Requests;
using Sabio.Services;
using Sabio.Services.Interfaces;
using Sabio.Web.Controllers;
using Sabio.Web.Models.Responses;
using System.Collections.Generic;
using System.Data.SqlClient;
using System;
using Sabio.Models.Requests.Books;

namespace Sabio.Web.Api.Controllers
{
    [Route("api/books")]
    [ApiController]
    public class BooksApiController : BaseApiController
    {
        private IBooksService _service = null;
        private IAuthenticationService<int> _authService = null;
        public BooksApiController(IBooksService service,
            ILogger<BooksApiController> logger,
            IAuthenticationService<int> authService) : base(logger)
        {
            _service = service;
            _authService = authService;
        }
        [HttpGet("{id:int}")]
        public ActionResult<ItemResponse<Book>> GetById(int id)
        {
            int iCode = 200;
            BaseResponse response = null;
            try
            {
                Book book = _service.Get(id);

                if (book == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("Lecture not found");
                }

                else
                {
                    response = new ItemResponse<Book> { Item = book };

                }
            }
            catch (Exception ex)
            {
                iCode = 500;
                response = new ErrorResponse($"Generic Error: {ex.Message}");
            }
            return StatusCode(iCode, response);

        }

        [HttpGet("paginated")]
        public ActionResult<ItemResponse<Paged<Book>>> GetAllPaginated(int pageIndex, int pageSize)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                Paged<Book> list = _service.GetAllPaginated(pageIndex, pageSize);


                if (list == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("Lectures not found.");
                }
                else
                {
                    response = new ItemResponse<Paged<Book>> { Item = list };
                }
            }
            catch (Exception ex)
            {
                iCode = 500;
                response = new ErrorResponse($"Generic Error: {ex.Message}");
            }

            return StatusCode(iCode, response);
        }

        [HttpPost]
        public ActionResult<ItemResponse<int>> Create(BookAddRequest model)
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
        public ActionResult<ItemResponse<int>> Update(BookUpdateRequest model)
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
