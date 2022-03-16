trigger PreventRepeatMember on Project_Team_Member__c (before insert) {

    List<Project_Team_Member__c> Members = [SELECT Project__c, User__c from Project_Team_Member__c ];
    
    Boolean throwErr= false;
    for (Project_Team_Member__c member: trigger.new)
    {
    for(integer i= 0; i<Members.size();i++)
    {
    if(member.Project__c== Members[i].Project__c && member.User__c==Members[i].User__c)
    {
    throwErr = true;
    }
    }
    if(throwErr)
    {
    member.addError('Member is already present in team.');
    }
    }  
}