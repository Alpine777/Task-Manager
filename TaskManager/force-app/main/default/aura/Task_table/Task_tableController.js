({
    init: function (cmp, event, helper) {
        var actions = [
            { label:'Edit', name:'edit'},
            { label:'Delete', name:'delete'}
            
        ]; 
        cmp.set('v.mycolumns', [
            
            {label: 'Task Name', sortable:true, fieldName: 'linkName', type: 'url', 
             typeAttributes: {label: { fieldName: 'Name' }, target: '_blank'}},
            {label: 'Assigned to', sortable:true, fieldName: 'Username', type: 'text'},
            {label: 'Task status', fieldName: 'Task_status__c', type: 'text', 
             cellAttributes:{ class: {
                 fieldName: 'taskCss'
             } } }, 
            {label: 'Priority', fieldName: 'Priority__c', type: 'text'},
            {label: 'Approval Status', fieldName: 'Approval_status__c', type: 'text',},
            { type: 'action', typeAttributes: { rowActions: actions } }
        ]);
        helper.getData(cmp);
    }, 
    
    updateSorting: function (cmp, event, helper) {
        var fieldName = event.getParam('fieldName');
        var sortDirection = event.getParam('sortDirection');
        cmp.set("v.sortedBy", fieldName);
        cmp.set("v.sortedDirection", sortDirection);
        helper.sortData(cmp, fieldName, sortDirection);
    },
  
    handleRowAction: function (cmp, event, helper) {
        var action = event.getParam('action');
        var row = event.getParam('row');
        switch (action.name) {
            case 'preview':
                alert('Preview: ' + JSON.stringify(row));
                break;
            case 'delete':
                helper.deleteTask(cmp,row);
                break;
            case 'edit':
                var editRecordEvent = $A.get("e.force:editRecord");
                editRecordEvent.setParams({
                    "recordId": row.Id
                });
                editRecordEvent.fire();
                break;
                
        }
    }
    
    
})