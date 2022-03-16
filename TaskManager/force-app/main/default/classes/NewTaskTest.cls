@isTest
public class NewTaskTest {
    @isTest static void TestSetApprovalStatus() {
        Assigned_task__c[] tasks= AssignedTaskTestDataFactory.createtasks(1);
        Test.startTest();
        Database.SaveResult result = Database.insert(tasks[0], false);
        Test.stopTest();
        System.assert(result.isSuccess());
        List<Assigned_task__c> taskList= [Select Approval_Status__c from Assigned_task__c Where Id= :tasks[0].Id];
        for(Assigned_task__c t: taskList){
            system.assertEquals('Unapproved', t.Approval_Status__c);
        }
    }     
    
      @isTest static void TestBulkSetApprovalStatus() {
        Assigned_task__c[] tasks= AssignedTaskTestDataFactory.createtasks(200);
        Test.startTest();
        Database.SaveResult[] results = Database.insert(tasks, false);
        Test.stopTest();
          
        for(Database.SaveResult dr : results) {
            System.assert(dr.isSuccess());
        }
        List<Assigned_task__c> taskList= [Select Approval_Status__c from Assigned_task__c Where Id= :tasks];
        for(Assigned_task__c t: taskList){
            system.assertEquals('Unpproved', t.Approval_Status__c);
        }
    }     
}