trigger AccessToMemberTrigger on Project_Team_Member__c (before insert) {
    if(trigger.isInsert){
        // Create a new list of sharing objects for Job
        List<Project__Share> projectShrs  = new List<Project__Share>();
        
        // Declare variables for recruiting and hiring manager sharing
        Project__Share developerShr;
        
        
        for(Project_Team_Member__c p : trigger.new){
            if(p.User__c != null){
            // Instantiate the sharing objects
            developerShr = new Project__Share();
            
            // Set the ID of record being shared
            
            developerShr.ParentId = p.Project__c;

            
            // Set the ID of user or group being granted access
            developerShr.UserOrGroupId = p.User__c;

            // Set the access level
            developerShr.AccessLevel = 'edit';

            
            // Set the Apex sharing reason for hiring manager and recruiter
            developerShr.RowCause = Schema.Project__Share.RowCause.User__c;
            
            // Add objects to list for insert
            projectShrs.add(developerShr);
            }
        }
        
        // Insert sharing records and capture save result 
        // The false parameter allows for partial processing if multiple records are passed 
        // into the operation 
        Database.SaveResult[] lsr = Database.insert(projectShrs,false);
        
        // Create counter
        Integer i=0;
        
        // Process the save results
        for(Database.SaveResult sr : lsr){
            if(!sr.isSuccess()){
                // Get the first save result error
                Database.Error err = sr.getErrors()[0];
                
                // Check if the error is related to a trivial access level
                // Access levels equal or more permissive than the object's default 
                // access level are not allowed. 
                // These sharing records are not required and thus an insert exception is 
                // acceptable. 
                if(!(err.getStatusCode() == StatusCode.FIELD_FILTER_VALIDATION_EXCEPTION  
                                               &&  err.getMessage().contains('AccessLevel'))){
                    // Throw an error when the error is not related to trivial access level.
                    trigger.newMap.get(projectShrs[i].ParentId).
                      addError(
                       'Unable to grant sharing access due to following exception: '
                       + err.getMessage());
                }
            }
            i++;
        }   
    }
}