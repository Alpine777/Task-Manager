import { LightningElement,track,wire,api} from 'lwc';
import getProjects from '@salesforce/apex/ProjectController.getProjects';
import filterProjects from '@salesforce/apex/ProjectFilterController.retrieveProjects';
import { publish, MessageContext } from 'lightning/messageService';
import projectMessageChannel from '@salesforce/messageChannel/projectMessageChannel__c';

export default class Project_Table extends LightningElement {

ProjectName = '';
@track projects= [];

handleProjectName(event) {
this.ProjectName = event.detail.value;
}

handleFilter() {
if(!this.ProjectName) {
    // this.errorMsg = 'Please enter Project name to filter.';
    // this.projects = undefined;
    // return;
    
getProjects()
.then(results=>{
this.projects = results;
})
.catch(error=>{
this.dispatchEvent(
    new ShowToastEvent({
        title: 'Error',
        message: error.body.message,
        variant: 'error'
    })
);

}); 
}

filterProjects({ProjectName : this.ProjectName})
.then(result => {
    // result.forEach((record) => {
    //     record.ProjName = '/' + record.Id;
    // });

    this.projects = result;
    console.log(this.projects);
    
})
.catch(error => {
    this.projects = undefined;
    window.console.log('error =====> '+JSON.stringify(error));
    if(error) {
        this.errorMsg = error.body.message;
    }
}) 
}

@wire(MessageContext)
messageContext;
@track columns = [{
label: 'Secondary Project',
fieldName: 'Name',
type: 'text'
},
];

@wire(getProjects) wiredProjects(response){
if(response.data) {
this.projects = response.data;
this.Response= response;    
} else if (response.error) {
console.log(response.error);
}
}
get hasProject(){
return this.projects.length > 0 ? true : false;
}

handleSelect(event) {

var selectedRows = event.detail.selectedRows;
var selectedRowName;

if (selectedRows.length < 1)
{
 selectedRowName= 'Null';
}

else if (selectedRows.length > 1){

    // var selection= this.template.querySelector('lightning-datatable').getSelectedRows();
    // console.log(selection);
    // var el = this.template.querySelector('lightning-datatable');
    // el.selectedRows= el.selectedRows.slice(1);
    // selectedRows= selectedRows.slice(1);
    // selectedRowName = selectedRows[0].Name;

    this.template.querySelector('lightning-datatable').selectedRows= this.template.querySelector('lightning-datatable').selectedRows.slice(1);
    selectedRows= this.template.querySelector('lightning-datatable').getSelectedRows();
    selectedRowName= selectedRows[0].Name;
}

 else{
    selectedRowName = selectedRows[0].Name;
    //this.template.querySelector('lightning-datatable').selectedRows= [];
}

const payload = { publishedName: selectedRowName};
publish(this.messageContext, projectMessageChannel, payload);

this.dispatchEvent(
new CustomEvent ("projectSelected", {
detail: {Project_Name: selectedRowName} 
})
);

this.dispatchEvent(new CustomEvent('check'));
}

// publish(selectedRows)
// {
//     var selectedRowName= event.detail.selectedRows[0].Name; 
//     const payload = { publishedName: selectedRowName};
//     publish(this.messageContext, projectMessageChannel, payload);
// 

}