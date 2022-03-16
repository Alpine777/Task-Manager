trigger InvaildUserTrigger on Assigned_task__c (before update) {
    if (Trigger.isUpdate) {
        Id userId = userinfo.getUserId();
        user PName =[SELECT Profile.Name FROM User
                             where Id=:userId ];
         List<String> fieldName= new List<String>();
         Boolean changed_field;
        //List<Assigned_task__c> task = [Select Id, Name, Project__c, User__c, Task_status__c, Priority__c From Assigned_task__c] ;
         if(PName.profile.name == 'Developer')
        { 
        
   
           for (Assigned_task__c task: Trigger.new) {
               Assigned_task__c oldTask = Trigger.oldMap.get(task.ID);
           
               if(task.Name != oldTask.Name || task.Priority__c != oldTask.Priority__c || task.Project__c != oldTask.Project__c || task.User__c != oldTask.User__c ){
                   changed_field = True; 
                    }
              else {changed_field = False;}
            
            
              if (changed_field){task.addError('Can only edit task status');}

           }
         }
      }
      

}