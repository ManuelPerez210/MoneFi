USE [MoneFi_V2]
GO
/****** Object:  StoredProcedure [dbo].[Books_Update]    Script Date: 10/5/2023 1:31:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- Author: Manuel Perez
-- Create date: 9/29/2023
-- Description: Lectures Update
-- Code Reviewer:

-- MODIFIED BY:
-- MODIFIED DATE:
-- Code Reviewer:
-- Note:
-- =============================================
CREATE PROC [dbo].[Books_Update]
@Title NVARCHAR(200)
,@Author NVARCHAR(200)
,@Url NVARCHAR(200)
,@ModifiedBy INT
,@Id INT

as

/* --------------------Test Code----------------------------------
declare @Id int = 2;

DECLARE
		@Title NVARCHAR(200) = 'Test Book Title update'
		,@Author NVARCHAR(200) = 'Test Book Author'
		,@Url NVARCHAR(200) = 'Test Book URL'
		,@ModifiedBy INT = 110
		
		select *
		   from dbo.Books
		   where id = @Id

		execute dbo.Books_Update 
			@Title
			,@Author
			,@Url
			,@ModifiedBy
			,@Id

			select *
		    from dbo.Books
		    where id = @Id
*/


BEGIN
declare @DateModified datetime2 = getutcdate()

UPDATE [dbo].[Books]
	 SET [Title] = @Title
		 ,[Author] = @Author
		 ,[Url] = @Url
		 ,[ModifiedBy] = @ModifiedBy
		 ,[DateModified] = @DateModified
		 WHERE Id = @Id

END
GO
