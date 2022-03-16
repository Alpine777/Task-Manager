({
    init : function(cmp, event, helper) {
        
        var getID = cmp.get('v.recordId');
        var list = [   { label: 'Not Started', value: 'Not Started' },
                    { label: 'In Progress', value: 'in progress' },
                    { label: 'Completed', value: 'completed'},
                   ];
                    var action = cmp.get('c.getPath');
                    action.setParams({"pId":getID});
                    action.setCallback(this, $A.getCallback(function (response) {
                    
                    var state = response.getState();
                    if (state === "SUCCESS") {
                    var row=  response.getReturnValue();
                    console.log('HI'+row.Project_status__c);
                    cmp.set('v.data',row.Project_status__c);
                    var select = cmp.get('v.data');
                    if(select == 'Overdue' || select == 'abandoned' )
                    {          
                    list.pop();
                    list.push({ label: select, value: select});
                    }
                    cmp.set('v.steps',list);
                    } else if (state === "ERROR") {
                    var errors = response.getError();
                    }
                    }));
                    
                    $A.enqueueAction(action);
                    },
                    })