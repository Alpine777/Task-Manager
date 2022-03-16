trigger RevokeAccess on Project_Team_Member__c (after delete) {

    Map<String, List<String>> mp =  new Map<String, List<String>>();
    Set<String> projects = new Set<String>();
    
    for(Project_Team_Member__c member:trigger.old)
    {
    projects.add(member.Project__c);  
    }
 
    
    for (String project:projects)
    {
    mp.put(project, new List<String>());
    }
    
    for(Project_Team_Member__c member:trigger.old)
    {
    if (projects.contains(member.Project__c ))
    {
       mp.get(member.Project__c).add(member.User__c);
    }
    }
    
     List<Project__Share> sharesToDelete= new List<Project__Share>();
     
    for (String project:projects)
    {
    sharesToDelete.add([SELECT Id FROM Project__Share 
                                  WHERE UserorGroupId IN :mp.get(project)
                                  AND ParentId = :project
                                  AND RowCause = 'User__c']);
    }

    if(!sharesToDelete.isEmpty()){
    Database.Delete(sharesToDelete, false);
    }
 
    }