@isTest
public class TestInvalidUserTrigger {
    @isTest public static void TestInvalidFields(){
        Assigned_task__c[] tasks= AssignedTaskTestDataFactory.createtasks(1);
        User haley= [Select Id from User where Username='hbrown@abc.com'];
       
        Profile pl = [SELECT Id FROM Profile WHERE Name='System Administrator'];
        User user1 = new User(LastName = 'LIVESTON',
                              FirstName='JB',
                              Alias = 'jbliv',
                              Email = 'jb.liveston@abc.com',
                              Username = 'jb.liveston@abc.com',
                              ProfileId = pl.Id,
                              TimeZoneSidKey = 'GMT',
                              LanguageLocaleKey = 'en_US',
                              EmailEncodingKey = 'UTF-8',
                              LocaleSidKey = 'en_US'
                             ); 
        insert user1;
        system.runAs(user1){
            insert tasks;
        }
        system.runAs(haley){
            Test.startTest();
            for(Assigned_task__c t: tasks){
                t.Priority__c= 'Normal';
            }
            Database.SaveResult result = Database.update(tasks[0],false);
            Test.stopTest();
            System.assert(!result.isSuccess());
            System.assert(result.getErrors().size() > 0);
            System.assertEquals('Can only edit task status',
                                result.getErrors()[0].getMessage());
        }
    }
    
     @isTest public static void TestValidFields(){
       Assigned_task__c[] tasks= AssignedTaskTestDataFactory.createtasks(1);
       User haley= [Select Id from User where Username='hbrown@abc.com'];
       
        Profile pl = [SELECT Id FROM Profile WHERE Name='System Administrator'];
        User user1 = new User(LastName = 'LIVESTON',
                              FirstName='JB',
                              Alias = 'jbliv',
                              Email = 'jb.liveston@abc.com',
                              Username = 'jb.liveston@abc.com',
                              ProfileId = pl.Id,
                              TimeZoneSidKey = 'GMT',
                              LanguageLocaleKey = 'en_US',
                              EmailEncodingKey = 'UTF-8',
                              LocaleSidKey = 'en_US'
                             ); 
        insert user1;
        system.runAs(user1){
            insert tasks;
        }
        system.runAs(haley){
            Test.startTest();
            for(Assigned_task__c t: tasks){
                t.Task_status__c= 'In Progress';
            }
            Database.SaveResult result = Database.update(tasks[0],false);
            Test.stopTest();
            System.assert(result.isSuccess());
            System.assert(result.getErrors().size() == 0);
        }
    }
}