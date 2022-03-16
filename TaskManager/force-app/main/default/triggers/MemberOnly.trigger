trigger MemberOnly on Assigned_task__c (before insert) {
boolean canAssignTask= false;
List<Project_Team_Member__c> members= [Select Id,User__c,Project__c From Project_Team_Member__c];
for(Assigned_task__c t:trigger.new)
{
    for(Project_Team_Member__c m:members)
    {
        if(t.Project__c == m.Project__c && t.user__c==m.user__c)
        {
                canAssignTask= true;
        }
    }
    if(!canAssignTask)
    {
    t.addError('Add User as a member first.');
    }
    
}
}