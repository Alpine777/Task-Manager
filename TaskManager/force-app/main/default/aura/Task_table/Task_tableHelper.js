({
    getData : function(cmp) {
        var getID = cmp.get('v.recordId');
        var action = cmp.get('c.getTasks');
        action.setParams({"pId":getID});
        action.setCallback(this, $A.getCallback(function (response) {
            
            var state = response.getState();
            if (state === "SUCCESS") {
                var colorStatusMap = new Map();
                colorStatusMap.set('Not Started', 'Not-Started');
                colorStatusMap.set('In Progress', 'In-Progress');
                colorStatusMap.set('Completed', 'Completed');
                colorStatusMap.set('Delayed', 'Delayed');
                var rows = response.getReturnValue();     //storing the response in a temporary variable 
                rows.forEach(function(row){
                    if (row.User__r) { 
                        row.Username= row.User__r.FirstName +' '+ row.User__r.LastName;   
                        
                    }
                    row.linkName = '/'+row.Id;
                    row['taskCss'] = colorStatusMap.get(row.Task_status__c);
                    
                });
                cmp.set('v.mydata', response.getReturnValue());
                cmp.set('v.rawData', response.getReturnValue());
            } else if (state === "ERROR") {
                var errors = response.getError();
                console.error(errors);
            }
        }));
        
        $A.enqueueAction(action);
    },
    
    sortData: function (cmp, fieldName, sortDirection) {
        var fname = fieldName;
        if (fieldName == 'linkName')
        {
            fieldName = 'Name';
        }
        
        var data = cmp.get("v.mydata");
        var reverse = sortDirection !== 'asc';
        data.sort(this.sortBy(fieldName, reverse))
        cmp.set("v.mydata", data);
    },
    sortBy: function (field, reverse) {
        var key = function(x) {return x[field]};
        reverse = !reverse ? 1 : -1;
        return function (a, b) {
            return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
        }
    },
    deleteTask: function (cmp, row) {
        var action = cmp.get('c.deleteTask');
        action.setParams({
            "getId":row.Id
        });
        action.setCallback(this, $A.getCallback(function (response) {
            var state = response.getState();
            if (state === "SUCCESS") {
            } 
            
            else if (state === "ERROR") {
                var errors = response.getError();
                console.error(errors);
            }
        }));
        $A.enqueueAction(action);
        var rows = cmp.get('v.rawData');  
        var rowIndex = rows.indexOf(row);;    
        rows.splice(rowIndex, 1);
        var newrows = rows;
        cmp.set("v.mydata",newrows);
        
    },
})