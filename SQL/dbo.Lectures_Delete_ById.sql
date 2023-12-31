USE [MoneFi_V2]
GO
/****** Object:  StoredProcedure [dbo].[Lectures_Delete_ById]    Script Date: 9/6/2023 7:00:15 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
/****** Object:  StoredProcedure [dbo].[Lectures_Delete_ById]    Script Date: 5/9/2023 12:49:04 PM ******/
-- =============================================
-- Author: Manuel Perez
-- Create date: 5/8/2023
-- Description: Lectures Delete by Id
-- Code Reviewer: Alex Golomb

-- MODIFIED BY:
-- MODIFIED DATE:
-- Code Reviewer:
-- Note:
-- =============================================
ALTER PROC [dbo].[Lectures_Delete_ById]
@Id int

as
/*--------------------test code-------------------------

declare @Id int = 2

	select *
	from dbo.Lectures
      WHERE Id = @Id;

	execute dbo.Lectures_Delete_ById @Id

	select *
	from dbo.Lectures
      WHERE Id = @Id;

*/

BEGIN

	  DELETE FROM [dbo].[Lectures]
	  WHERE Id = @Id;

END