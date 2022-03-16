({
    handleShowToast: function(component, event, helper) {
        component.find('notifLib').showToast({
            "variant": "success",
            "title": "Success!",
            "message": "Record has been created successfully."
        });
        component.find("overlayLib").notifyClose();
    },
    
    handleCancel: function(component, event, helper) {
       component.find("overlayLib").notifyClose();
    }
    
   
})