USE [MoneFi_V2]
GO
/****** Object:  StoredProcedure [dbo].[Lectures_Update]    Script Date: 9/6/2023 7:04:04 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author: Manuel Perez
-- Create date: 5/8/2023
-- Description: Lectures Update
-- Code Reviewer: Alex Golomb

-- MODIFIED BY: Manuel Perez
-- MODIFIED DATE: 06-05-23
-- Code Reviewer: Alejandro Saavedra
-- Note: Added an update column for LectureSections changed fileUrl to nvarchar(150)
-- =============================================
ALTER PROC [dbo].[Lectures_Update]
@CourseId INT
,@Title NVARCHAR(50)
,@Description NVARCHAR(500)
,@Duration NVARCHAR(50)
,@ImageUrl NVARCHAR (150)
,@FileUrl NVARCHAR (150)
,@LectureSections INT
,@SortOrder INT
,@ModifiedBY INT
,@Id INT

as

/* --------------------Test Code----------------------------------
declare @Id int = 35;

DECLARE
		@CourseId INT = 28
		,@Title nvarchar(50) = 'Government Accounting 101'
		,@Description nvarchar(500) = 'This course will teach you about Macro Economics'
		,@Duration NVARCHAR(50) = '55 Mins'
		,@ImageUrl nvarchar(150) = 'https://tinyurl.com/yfyd8d3z'
		,@FileUrl NVARCHAR (125) = 'Test File Update'
		,@LectureSections INT = 2
		,@SortOrder nvarchar(50) = 1
		,@ModifiedBY INT = 110
		
		select *
		   from dbo.Lectures
		   where id = @Id

		execute dbo.Lectures_Update 
			@CourseId
			,@Title
			,@Description
			,@Duration
			,@ImageUrl
			,@FileUrl
			,@LectureSections
			,@SortOrder
			,@ModifiedBY
			,@Id

			select *
		    from dbo.Lectures
		    where id = @Id
*/


BEGIN
declare @DateModified datetime2 = getutcdate()

UPDATE [dbo].[Lectures]
	 SET [CourseId] = @CourseId
		 ,[Title] = @Title
		 ,[Description] = @Description
		 ,[Duration] = @Duration
		 ,[ImageUrl] = @ImageUrl
		 ,[FileUrl] = @FileUrl
		 ,[LectureSections] = @LectureSections
		 ,[SortOrder] = @SortOrder
		 ,[CreatedBy] = @ModifiedBY
		 ,[ModifiedBy] = @ModifiedBY
		 ,[DateModified] = @DateModified
		 WHERE Id = @Id

END
