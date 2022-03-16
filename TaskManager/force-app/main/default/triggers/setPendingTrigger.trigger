trigger setPendingTrigger on Assigned_task__c (before update) {   
 for(Assigned_task__c task: trigger.new){
       if(task.Task_status__c== 'Completed' && task.Approval_status__c != 'Approved')
       task.Approval_status__c = 'Pending';
       }
  }