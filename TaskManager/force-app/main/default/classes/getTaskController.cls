public with sharing class getTaskController {
@AuraEnabled(cacheable=true)
public static List<Personal_Task__c> getTasks() {
return [SELECT Id, Name, Description__c, Task_status__c,Priority__c FROM Personal_Task__c];
}

@AuraEnabled(cacheable=true)
public static List<Assigned_Task__c> getUrgentTasks() {
return [SELECT Id, Name, Priority__c FROM Assigned_Task__c Where Task_status__c ='In Progress'
        AND Priority__c = 'High'];
}


@AuraEnabled
public static void deletePersonalTask(Id ptId) {
Personal_Task__c personalTask = new  Personal_Task__c();
personalTask = [SELECT Id FROM Personal_Task__c Where Id= :ptId];
delete(personalTask);
}
}