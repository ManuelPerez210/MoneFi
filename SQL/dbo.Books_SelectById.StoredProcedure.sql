USE [MoneFi_V2]
GO
/****** Object:  StoredProcedure [dbo].[Books_SelectById]    Script Date: 10/5/2023 1:31:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author: Manuel Perez
-- Create date: 10/5/2023
-- Description: Books_SelectById
-- Code Reviewer:

-- MODIFIED BY:
-- MODIFIED DATE:
-- Code Reviewer:
-- Note:
-- =============================================
CREATE PROC [dbo].[Books_SelectById]
	@Id INT
AS

/*
	DECLARE @Id INT = 4

	EXECUTE dbo.Books_SelectById @Id

*/

BEGIN

SELECT		 b.Id
			,b.Title
			,b.Author
			,b.[Url]
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
			,b.DateCreated
			,b.DateModified
			,b.IsDeleted

			FROM dbo.Books as b inner join dbo.Users as uc
			ON b.CreatedBy = uc.Id
			inner join dbo.Users as um
			on b.ModifiedBy = um.Id
			inner join dbo.StatusTypes as st
			on b.StatusId = st.Id
			AND b.IsDeleted = 0
			WHERE b.Id = @Id
END
GO
