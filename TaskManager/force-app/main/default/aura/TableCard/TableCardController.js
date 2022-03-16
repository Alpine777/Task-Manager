({
    openForm: function(component, event, helper) {
        var modalBody;
        $A.createComponent("c:Taskform", {},
                           function(content, status) {
                               if (status === "SUCCESS") {
                                   console.log(content);
                                   modalBody = content;
                                   component.find('overlayLib').showCustomModal({
                                       header: "Create Task",
                                       body: modalBody,
                                       showCloseButton: true,
                                       //cssClass: "mymodal",
                                       
                                   })
                               }
                           });
    },
    
    Refresh: function(component, event, helper) {
         var childComponent = component.find("childCmp");
        childComponent.reInit();
        
    }
    
    
})