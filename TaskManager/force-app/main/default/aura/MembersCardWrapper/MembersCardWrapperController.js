({
	handleSelect : function(component, event, helper) {
		var selected= event.detail.value;
        var childComponent = component.find("childCmp");
        if (selected=='Name'){
            childComponent.sortbyNameMethod();
        }
        else{
           childComponent.sortbyProgressMethod();
        }
	}
})