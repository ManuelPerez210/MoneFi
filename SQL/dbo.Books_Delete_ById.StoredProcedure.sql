USE [MoneFi_V2]
GO
/****** Object:  StoredProcedure [dbo].[Books_Delete_ById]    Script Date: 10/5/2023 1:31:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author: Manuel Perez
-- Create date: 10/5/2023
-- Description: Books Delete by Id
-- Code Reviewer:

-- MODIFIED BY:
-- MODIFIED DATE:
-- Code Reviewer:
-- Note:
-- =============================================
CREATE PROC [dbo].[Books_Delete_ById]
@Id int

as
/*--------------------test code-------------------------

DECLARE 
		@Id INT = 2
		

	SELECT *
	FROM dbo.Books
	WHERE Id = @Id;

	EXECUTE dbo.Books_Delete_ById 
		@Id
	

	SELECT 
		IsDeleted
		,Id
	FROM dbo.Books
	WHERE Id = @Id;

*/

BEGIN

	 UPDATE dbo.Books
		SET [IsDeleted] = 1
		WHERE Id = @Id;

END
GO
