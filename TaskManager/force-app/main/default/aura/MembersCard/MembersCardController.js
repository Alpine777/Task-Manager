({
    init: function(cmp, event, helper) {
        var action = cmp.get('c.getUserValueWrapper');
        action.setParams({
            pId : cmp.get("v.recordId")
        });
        action.setCallback(this, function(response) {
            
            var state = response.getState();
            if (state === "SUCCESS") {
                //set response value in wrapperList attribute on cmp.
                var userValue=  response.getReturnValue();
                console.log(userValue);
                userValue.forEach(function(value){
                    if(value.countAllTask != 0){
                        value.progress = Math.ceil((value.countTask/value.countAllTask)*100)}
                    else{ value.progress = 0;}
                });
                cmp.set('v.userValueWrapper',userValue);
            }
        });
        $A.enqueueAction(action);
    },
    sortbyName: function(cmp, event, helper) {
        var sortedUserValue= cmp.get('v.userValueWrapper');
        var asc= cmp.get('v.asc');
        if(asc){
            asc= false;
            sortedUserValue.sort( ( a, b ) => {
                return a['fullName'] > b['fullName']   ? 1 : -1; 
            });; }
        
        else{
            asc= true;
            sortedUserValue.sort( ( a, b ) => {
                return a['fullName'] > b['fullName']   ? -1 : 1; 
            });; }
        
        cmp.set('v.asc',asc);
        cmp.set('v.userValueWrapper',sortedUserValue);
        
    },
    
    sortbyProgress: function(cmp, event, helper) {
        var sortedUserValuebyProgress= cmp.get('v.userValueWrapper');
        var ascP= cmp.get('v.ascP');
        
        if(ascP){
        ascP= false;
        sortedUserValuebyProgress.sort( ( a, b ) => {
            if(a['progress'] == b['progress'])
            { return a['fullName'] > b['fullName']   ? 1 : -1; }
                                       return a['progress'] > b['progress']   ? -1 : 1; 
                                       });; }
        else{
            ascP= true;
             sortedUserValuebyProgress.sort( ( a, b ) => {
            if(a['progress'] == b['progress'])
            { return a['fullName'] > b['fullName']   ? 1 : -1; }
                                       return a['progress'] > b['progress']   ? 1 : -1; 
                                       });;
        
        }
              
        cmp.set('v.ascP',ascP);
        cmp.set('v.userValueWrapper',sortedUserValuebyProgress);
    }
})