public without sharing class MembersCardController {
     @AuraEnabled
    public static User getSupervisor(id pId) {
        Project__c supervisor = 
            [SELECT  CreatedById FROM Project__c 
             Where Project__c.Id = :pID];
        User supervisorName = [SELECT  Name, Username FROM User
             Where Id = :supervisor.CreatedById];
        //Add isAccessible() check
        return supervisorName;
    }
    
    @AuraEnabled
    public static List<Wrapper> getUserValueWrapper(Id pId) {
        
        Map<String,Integer> userValues = new Map<String,Integer>();//map user who have completed task and count of complete task
         Map<String,String> Names = new Map<String,String>();//map username to fullname
        List<Wrapper> wrapperlist = new List<Wrapper>();
        List<Integer> countTask = new List<Integer>();
        List<Integer> countAllTask = new List<Integer>();
        List<String> userName = new List<String>();//list of usernames who have task assigned to them
        List<String> memberName= new List<String>();//list of username who are project members
        List<String> fullName = new List<String>();//list of names who have task assigned to them

        string check;
        
        AggregateResult[]  allTasks = [SELECT User__r.firstName, User__r.LastName,User__r.username,COUNT(Name) FROM Assigned_task__c  Where Project__c = :pID Group By User__r.username, User__r.firstName, User__r.Lastname];
        AggregateResult[]  completedTask = [SELECT User__r.firstName, User__r.LastName,User__r.username,COUNT(Name) FROM Assigned_task__c where Task_status__c = 'completed' AND  Project__c = :pID Group By User__r.username, User__r.firstName, User__r.Lastname];
        List<Project_Team_Member__c> members= [SELECT User__r.firstName, User__r.LastName,User__r.username FROM Project_Team_Member__c Where Project__c = :pID];
        
        for(Project_Team_Member__c member:members){
            memberName.add(member.User__r.username);
            Names.put(member.User__r.username, member.User__r.firstName +' '+ member.User__r.LastName);
        }
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
            if(userValues.keySet().contains(userName[i]))
            {countTask.add(userValues.get(userName[i]));
            }
            else{countTask.add(0);}
        }
        
        for(integer i=0; i<memberName.size(); i++){
            if(!userName.contains(memberName[i]))
            {
                fullName.add(Names.get(memberName[i]));
                userName.add(memberName[i]);
                countAllTask.add(0);
                countTask.add(0);
            }
        }


        
        for(integer i = 0; i<fullName.size();i++)
        {
            Wrapper mywrapper= new Wrapper(fullName[i],userName[i],countTask[i],countAllTask[i]);
            wrapperlist.add(mywrapper);
        }
        //System.debug(wrapperlist);
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


}