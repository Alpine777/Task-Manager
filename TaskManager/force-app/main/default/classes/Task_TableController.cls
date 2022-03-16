public class Task_TableController {
    @AuraEnabled
    public static List<Assigned_task__c> getTasks(id pId) {
        List<Assigned_task__c> tasks = 
            [SELECT  Name, User__r.username, user__r.firstname,user__r.lastname , Task_status__c, Priority__c,Approval_status__c FROM Assigned_task__c 
             Where Project__c = :pID];
        //Add isAccessible() check
        return tasks;
    }
    
     @AuraEnabled
    public static List<Assigned_task__c> getSupervisor(id pId) {
        List<Assigned_task__c> supervisor = 
            [SELECT  CreatedById FROM Assigned_task__c 
             Where Project__c = :pID];
        //Add isAccessible() check
        return supervisor;
    }
    
    
    @AuraEnabled
    public static List<Wrapper> getUserValueWrapper(Id pId) {
        //
        Map<String,Integer> userValues = new Map<String,Integer>();
        List<Wrapper> wrapperlist = new List<Wrapper>();
        List<Integer> countTask = new List<Integer>();
        List<Integer> countAllTask = new List<Integer>();
        List<String> userName = new List<String>();
        List<String> fullName = new List<String>();
        // List<Wrapper> userWrapper = new List<Wrapper>();
        string check;
        
        AggregateResult[]  allTasks = [SELECT User__r.firstName, User__r.LastName,User__r.username,COUNT(Name) FROM Assigned_task__c  Where Project__c = :pID Group By User__r.username, User__r.firstName, User__r.Lastname];
        AggregateResult[]  completedTask = [SELECT User__r.firstName, User__r.LastName,User__r.username,COUNT(Name) FROM Assigned_task__c where Task_status__c = 'completed' AND  Project__c = :pID Group By User__r.username, User__r.firstName, User__r.Lastname];
        
        for (AggregateResult result:allTasks){
            username.add((String)result.get('UserName'));
            fullName.add((String)result.get('FirstName')+' '+(String)result.get('LastName')); 
            countAllTask.add((Integer)result.get('expr0'));
        }
        for (AggregateResult completeResult:completedTask){  
            check= (String)completeResult.get('UserName');
            userValues.put(check,(Integer)completeResult.get('expr0'));
        }
        for(integer i=0; i<userName.size(); i++){
            if(check.contains(userName[i]))
            {countTask.add(userValues.get(userName[i]));
            }
            else{countTask.add(0);}
        }
        
        for(integer i = 0; i<fullName.size();i++)
        {
            Wrapper mywrapper= new Wrapper(fullName[i],userName[i],countTask[i],countAllTask[i]);
            wrapperlist.add(mywrapper);
        }
        System.debug(wrapperlist);
        //userWrapper.add(wrapperlist);
        return wrapperlist;
    }
    
    
    public class Wrapper{
        @AuraEnabled
        public String fullName {get;set;}
        @AuraEnabled
        public String userName {get;set;}
        @AuraEnabled
        public Integer countTask {get;set;}   
        @AuraEnabled
        public Integer countAllTask {get;set;}
        public Wrapper(String fullName,String userName,Integer countTask,Integer countAllTask)
        {
            this.fullName= fullName;
            this.userName= userName;
            this.countTask= countTask;
            this.countAllTask= countAllTask;
        }
    }
    
    
    @AuraEnabled
    public static void deleteTask(string getId) {
        delete [select Id FROM Assigned_task__c where Id=:getId];
    }
}