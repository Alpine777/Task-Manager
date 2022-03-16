trigger NewTaskTrigger on Assigned_task__c (before insert) {   
 for(Assigned_task__c task: trigger.new){
       task.Approval_status__c = 'Unapproved';
       }
}