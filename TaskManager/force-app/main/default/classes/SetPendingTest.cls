@isTest public class SetPendingTest {
    
    @isTest static void TestSetPendingCompleteAndUnapproved() {
        Assigned_task__c[] tasks= AssignedTaskTestDataFactory.createtasks(1);
        insert(tasks);
        Test.startTest();
        for(Assigned_task__c t: tasks){
            t.Task_status__c= 'Completed';
        }
        Database.SaveResult result = Database.update(tasks[0],false);
        Test.stopTest();
        System.assert(result.isSuccess());
        List<Assigned_task__c> taskList= [Select Approval_Status__c from Assigned_task__c Where Id= :tasks];
        for(Assigned_task__c t: taskList){
            system.assertEquals('Pending', t.Approval_Status__c);
        }
    }     
    @isTest static void TestBulkSetPendingCompleteAndUnapproved() {
        Assigned_task__c[] tasks= AssignedTaskTestDataFactory.createtasks(200);
        insert(tasks);
        Test.startTest();
        for(Assigned_task__c t: tasks){
            t.Task_status__c= 'Completed';
        }
        Database.SaveResult[] results = Database.update(tasks,false);
        Test.stopTest();
        for(Database.SaveResult dr : results) {
            System.assert(dr.isSuccess());
        }
        List<Assigned_task__c> taskList= [Select Approval_Status__c from Assigned_task__c Where Id= :tasks];
        for(Assigned_task__c t: taskList){
            system.assertEquals('Pending', t.Approval_Status__c);
        }
    }     
    
    
}