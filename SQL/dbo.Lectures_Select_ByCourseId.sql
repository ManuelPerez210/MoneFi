USE [MoneFi_V2]
GO
/****** Object:  StoredProcedure [dbo].[Lectures_Select_ByCourseId]    Script Date: 9/6/2023 7:01:50 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author: Alex Golomb
-- Create date: 06/09/2023
-- Description: Select Lectures by Course ID
-- Code Reviewer: Mark Nella

-- MODIFIED BY:
-- MODIFIED DATE:
-- Code Reviewer:
-- Note:
-- =============================================

ALTER PROC [dbo].[Lectures_Select_ByCourseId]
@Id INT

AS
/*
DECLARE 
	@Id INT = 8

	EXECUTE [dbo].[Lectures_Select_ByCourseId]
	@Id
*/

BEGIN

	SELECT l.Id
		  ,l.CourseId
		  ,l.Title
		  ,l.Description
		  ,l.Duration
		  ,l.ImageUrl
		  ,l.FileUrl


	FROM [dbo].Lectures AS l 
	WHERE l.CourseId=@Id

END
