USE [MoneFi_V2]
GO
/****** Object:  StoredProcedure [dbo].[Books_Insert]    Script Date: 10/5/2023 1:31:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author: Manuel Perez
-- Create date: 9/26/2023
-- Description: Books Insert
-- Code Reviewer: 

-- MODIFIED BY:
-- MODIFIED DATE:
-- Code Reviewer:
-- Note:
-- =============================================
CREATE PROC [dbo].[Books_Insert]
@Title NVARCHAR(200)
,@Author NVARCHAR(200)
,@Url NVARCHAR(200)
,@CreatedBy INT
,@Id INT OUTPUT

AS

/*
	DECLARE
		@Id INT = 0
		
	DECLARE
		@Title NVARCHAR(200) = 'Test Book Title'
		,@Author NVARCHAR(200) = 'Test Book Author'
		,@Url NVARCHAR(200) = 'Test Book URL'
		,@CreatedBy INT = 110
		
	EXECUTE [dbo].[Books_Insert]
		@Title
		,@Author
		,@Url
		,@CreatedBy

		,@Id OUTPUT

SELECT * FROM dbo.Books

*/

BEGIN

	INSERT INTO dbo.Books
				([Title]
				,[Author]
				,[Url]
				,[CreatedBy]
				,[ModifiedBy])
			VALUES
				(@Title
				,@Author
				,@Url
				,@CreatedBy
				,@CreatedBy)


	SET @Id = SCOPE_IDENTITY()

END
GO
