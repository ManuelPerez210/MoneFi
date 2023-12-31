USE [MoneFi_V2]
GO
/****** Object:  StoredProcedure [dbo].[Lectures_Insert]    Script Date: 9/6/2023 7:00:56 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author: Manuel Perez
-- Create date: 5/6/2023
-- Description: Lectures Insert
-- Code Reviewer: Alex Golomb

-- MODIFIED BY: Manuel Perez
-- MODIFIED DATE: 06-05-23
-- Code Reviewer: Alejandro Saavedra
-- Note: Added an insert for new table column LectureSections changed fileUrl to nvarchar(150)
-- =============================================
ALTER PROC [dbo].[Lectures_Insert]
@CourseId INT
,@Title NVARCHAR(50)
,@Description NVARCHAR(500)
,@Duration NVARCHAR(50)
,@ImageUrl NVARCHAR (150)
,@FileUrl NVARCHAR (150)
,@LectureSections INT
,@SortOrder INT
,@CreatedBy INT
,@Id INT OUTPUT

AS

/*
	DECLARE
		@Id INT = 0
		
	DECLARE
		@CourseId INT = 7
		,@Title nvarchar(50) = 'Test Title'
		,@Description nvarchar(500) = 'Test Description'
		,@Duration NVARCHAR(50) = 'Test Duration'
		,@ImageUrl nvarchar(150) = 'Test Image'
		,@FileUrl NVARCHAR (125) = 'Test File'
		,@LectureSections INT = 2
		,@SortOrder nvarchar(50) = 1
		,@CreatedBy INT = 1
		
	EXECUTE [dbo].[Lectures_Insert]
		@CourseId
		,@Title
		,@Description
		,@Duration
		,@ImageUrl
		,@FileUrl
		,@LectureSections
		,@SortOrder
		,@CreatedBy

		,@Id OUTPUT

SELECT * FROM dbo.Lectures

*/

BEGIN

	INSERT INTO dbo.Lectures
				([CourseId]
				,[Title]
				,[Description]
				,[Duration]
				,[ImageUrl]
				,[FileUrl]
				,[LectureSections]
				,[SortOrder]
				,[CreatedBy]
				,[ModifiedBy])
			VALUES
				(@CourseId
				,@Title
				,@Description
				,@Duration
				,@ImageUrl
				,@FileUrl
				,@LectureSections
				,@SortOrder
				,@CreatedBy
				,@CreatedBy)


	SET @Id = SCOPE_IDENTITY()

END