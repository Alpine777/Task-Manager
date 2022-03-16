public class ProgressPathController {
    @AuraEnabled
    public static Project__c getPath(id pId) {
        Project__c path = 
            [SELECT  Project_status__c FROM Project__c 
             Where Project__c.Id = :pID];
        //Add isAccessible() check
        return path;
    }
}