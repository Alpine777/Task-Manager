trigger setIsLocked on Assigned_task__c (before update) {
    if(Trigger.isUpdate){
        for(Assigned_task__c aT : Trigger.new){
        
            if(at.Is_Locked__c){
                at.addError('Cannot perform actions on locked records');
            } else{
                if(at.Approval_status__c == 'Approved'){
                    at.Is_Locked__c = true;
                }
            }
            
            
        }
    }
}