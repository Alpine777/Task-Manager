import { LightningElement,track,wire,api} from 'lwc';
import getProjects from '@salesforce/apex/ProjectController.getProjects';
import filterProjects from '@salesforce/apex/ProjectFilterController.retrieveProjects';
import { publish, MessageContext } from 'lightning/messageService';
import projectMessageChannel from '@salesforce/messageChannel/projectMessageChannel__c';

export default class Project_Table extends LightningElement {

@track projects= [];
@track newProjects= [];
// ProjectName = '';

// handleProjectName(event) {
//   this.ProjectName = event.detail.value;
//   }
  
//   handleFilter() {
//   if(!this.ProjectName) {
//       // this.errorMsg = 'Please enter Project name to filter.';
//       // this.projects = undefined;
//       // return;
      
//   getProjects()
//   .then(results=>{
//   this.projects = results;
//   })
//   .catch(error=>{
//   this.dispatchEvent(
//       new ShowToastEvent({
//           title: 'Error',
//           message: error.body.message,
//           variant: 'error'
//       })
//   );
  
//   }); 
//   }
  
//   filterProjects({ProjectName : this.ProjectName})
//   .then(result => {
//       // result.forEach((record) => {
//       //     record.ProjName = '/' + record.Id;
//       // });
  
//       this.projects = result;
//       console.log(this.projects);
      
//   })
//   .catch(error => {
//       this.projects = undefined;
//       window.console.log('error =====> '+JSON.stringify(error));
//       if(error) {
//           this.errorMsg = error.body.message;
//       }
//   }) 
//   }

@wire(MessageContext)
messageContext;
@track columns = [{
label: 'Project',
fieldName: 'Name',
type: 'text',
//typeAttributes: {label: { fieldName: 'Name' }, target: '_blank'}
},
//{ type: 'action', typeAttributes: { rowActions: actions } }
];

// @wire(getProjects) wiredProjects(response){
// if(response.data) {
// this.projects = response.data;
//
// this.Response= response;    
// } else if (response.error) {
// console.log(response.error);
// }
// }

// Object.assign(this.newProjects,this.projects);
// console.log('HI',JSON.stringify(this.newProjects));
// this.newProjects.forEach(function(item){
//   item.linkName = '/' + item.Id;
//   });


// }

connectedCallback(){
  getProjects().then(results=>{
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
//@track count= 0;
get hasProject(){
return this.projects.length > 0 ? true : false;
}

handleSelect(event) {

var selectedRows = event.detail.selectedRows;
var selectedRowId;

console.log(event.detail);

if (selectedRows.length < 1)
{
  selectedRowId = 'Null';
}

else if (selectedRows.length > 1)
{  
  this.template.querySelector('lightning-datatable').selectedRows= this.template.querySelector('lightning-datatable').selectedRows.slice(1);
  selectedRows= this.template.querySelector('lightning-datatable').getSelectedRows();
  selectedRowId= selectedRows[0].Id;

}

  else{
    selectedRowId= selectedRows[0].Id;
    }

const payload = { publishedId: selectedRowId};
//const payload= () =>  'Hello';
publish(this.messageContext, projectMessageChannel, payload);


this.dispatchEvent(
  new CustomEvent ("recordSelected", {
    detail: {recId: selectedRowId} 
  })
);



}

}