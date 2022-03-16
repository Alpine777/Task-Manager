@isTest
public class PreventEditOnCompletionTest {
    @isTest static void TestPreventEditOnCompletion() {
        Assigned_task__c[] tasks= AssignedTaskTestDataFactory.createtasks(1);
        insert(tasks);
        for(Assigned_task__c t: tasks){
            t.Task_status__c= 'Completed';
        }
        Test.startTest();
        for(Assigned_task__c t: tasks){
            t.Name= 'Test for trigger';
        }
        Database.SaveResult result = Database.update(tasks[0],false);
        Test.stopTest();
        System.assert(!result.isSuccess());
        System.assert(result.getErrors().size() > 0);
        System.assertEquals('Cannot edit on completed task.',
                            result.getErrors()[0].getMessage());
    }  
}