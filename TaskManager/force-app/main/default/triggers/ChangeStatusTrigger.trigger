trigger ChangeStatusTrigger on Project__c (before insert) {

    if(Trigger.isinsert){
        for(Project__c p:trigger.new){
            if(p.Project_status__c!='completed'){
                if(p.Start_date__c > Date.today()){
                    p.Project_status__c= 'To be started';
                    }
                if(p.End_date__c < Date.today()){
                     p.Project_status__c= 'Overdue';
                 }
                 else{p.Project_status__c= 'In progress';}
             }
        }
    }
    
}