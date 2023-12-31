USE [MoneFi_V2]
GO
/****** Object:  StoredProcedure [dbo].[Appointments_Select_ByClientId_Paginated]    Script Date: 9/6/2023 6:58:50 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author: Montoya, Kenneth
-- Create date: 05/23/2023

-- Description: Select records by ClientId  in   [dbo].[Appointments]

-- Code Reviewer:

-- MODIFIED BY: Manuel Perez
-- MODIFIED DATE: 09/04/2023
-- Code Reviewer:
-- Note : Changed order to be latest to oldest
-- =============================================
 ALTER   PROC [dbo].[Appointments_Select_ByClientId_Paginated]
								     @ClientId int 
									,@PageIndex int 
									,@PageSize int				
							
AS
/*-- TEST CODE

		DECLARE @ClientId int = 3;



EXECUTE [dbo].[Appointments_Select_ByClientId_Paginated]	
						@ClientId,0,5	
				

Select * from dbo.Appointments

*/

BEGIN
	-- Select the appointment by Client Id
	  Declare @offset int = @PageIndex * @PageSize

SELECT A.Id
      ,ApT.[Name] as AppointmentType
      ,A.[Notes]
      ,A.[IsConfirmed]
      ,A.[AppointmentStart]
      ,A.[AppointmentEnd]
      ,St.[Name] as StatusOfAppointment
	  ,L.[Name] as NameOfLender
	  ,L.[Website]
	  ,Lt.[Name] as LenderType
	  ,LoT.[Name] as LoanType
	  ,Lc.[LineOne] as LenderLocation
	  ,A.[LenderId]
      ,A.[AppointmentTypeId]
	  ,TotalCount = COUNT(1) OVER()
	  

		FROM [dbo].[Appointments] as A
		INNER JOIN [dbo].[Lenders] as L
		ON L.[id]=A.[LenderId]
		INNER JOIN [dbo].[Locations] as Lc
		ON Lc.[Id] = L.[LocationId] 
		INNER JOIN [dbo].[AppointmentTypes] as ApT
		ON ApT.[Id] = A.[AppointmentTypeId]
		INNER JOIN [dbo].[StatusTypes] as St
		ON St.[Id] = A.[StatusTypeId]
		INNER JOIN [dbo].[LenderTypes] as Lt
		on Lt.[Id]=L.[LenderTypeId]
		INNER JOIN [dbo].[LoanTypes] as LoT
		ON Lot.[Id]= L.[LoanTypeId]


	WHERE A.[ClientId] = @ClientId AND A.[StatusTypeId] = 1
		ORDER BY A.[AppointmentStart] DESC
 		OFFSET @offSet Rows
		Fetch Next @PageSize Rows ONLY
	 
	 

END

