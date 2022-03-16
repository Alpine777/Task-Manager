({
	 init: function(cmp, event, helper) {
        var action = cmp.get('c.getSupervisor');
        action.setParams({
            pId : cmp.get("v.recordId")
        });
        action.setCallback(this, function(response) {
                       
            var state = response.getState();
            if (state === "SUCCESS") {
                 cmp.set('v.Supervisor', response.getReturnValue());
            }
        });
        $A.enqueueAction(action);
    }
})