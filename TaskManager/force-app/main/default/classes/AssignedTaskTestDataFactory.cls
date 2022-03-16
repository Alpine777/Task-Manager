@isTest
public class AssignedTaskTestDataFactory {
    
    public static List<Assigned_task__c> createtasks(Integer numtasks) {
        List<Assigned_task__c> tasks = new List<Assigned_task__c>();
        for(Integer i=0;i<numtasks;i++) {
            Assigned_task__c t = new Assigned_task__c(Name='TestTask' + i,
                                                     User__c='0058c000009iNZXAA2',
                                                     Project__c='a018c00000Ra77nAAB',
                                                     Priority__c='Low',
                                                     Task_status__c='Delayed');
            
            tasks.add(t);
        }
        return tasks;
    }

}