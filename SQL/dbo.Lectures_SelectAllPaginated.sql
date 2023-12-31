USE [MoneFi_V2]
GO
/****** Object:  StoredProcedure [dbo].[Lectures_SelectAllPaginated]    Script Date: 9/6/2023 7:02:54 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
/****** Object:  StoredProcedure [dbo].[Lectures_SelectAllPaginated]    Script Date: 5/8/2023 1:57:38 PM ******/
-- =============================================
-- Author: Manuel Perez
-- Create date: 5/8/2023
-- Description: Lectures SelectAllPaginated
-- Code Reviewer: Deminicus Mckinnon

-- MODIFIED BY: Manuel Perez
-- MODIFIED DATE: 06-05-23
-- Code Reviewer: Alejandro Saavedra
-- Note: Added a select for LectureSections and implemented new join
-- =============================================
ALTER PROC [dbo].[Lectures_SelectAllPaginated]
@PageIndex INT
,@PageSize INT

/*-------------------test code--------------------------------
DECLARE 
	@PageIndex INT = 0
	,@PageSize INT = 50

Execute [dbo].[Lectures_SelectAllPaginated] 
	@PageIndex
	,@PageSize

*/

AS

BEGIN

DECLARE @Offset int = @PageIndex * @PageSize

SELECT		l.Id
			,c.Id as CourseId
			,c.[Title] as CourseTitle
			,l.Title
			,l.[Description]
			,l.Duration
			,l.ImageUrl
			,l.FileUrl
			,l.LectureSections
			,l.SortOrder
			,st.Id as StatusId
			,st.[Name]
			,uc.Id as AuthorId
			,uc.FirstName
			,uc.LastName
			,uc.Mi
			,uc.AvatarUrl
			,um.Id as ModifiedById
			,um.FirstName
			,um.LastName
			,um.Mi
			,um.AvatarUrl
			,l.DateCreated
			,l.DateModified

			,TotalCount = COUNT(1) OVER()
			FROM dbo.Lectures as l inner join dbo.Courses as c
			ON l.CourseId = c.Id
			inner join dbo.Users as uc
			ON l.CreatedBy = uc.Id
			inner join dbo.Users as um
			on l.ModifiedBy = um.Id
			inner join dbo.StatusTypes as st
			on l.StatusId = st.Id
			Order By l.Id 

			 OFFSET @Offset ROWS 
			FETCH NEXT @PageSize ROWS ONLY;
END