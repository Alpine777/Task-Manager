import { LightningElement,track,wire,api} from 'lwc';
import getProjects from '@salesforce/apex/ProjectController.getProjects';

export default class CheckErrorTable extends LightningElement {

@track projects = [];
@track columns = [{
label: 'Error Check',
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

if (selectedRows.length > 1){
var el = this.template.querySelector('lightning-datatable');
    el.selectedRows= el.selectedRows.slice(1);
    selectedRows = el.selectedRows;
    event.preventDefault();
    console.log('New Row Selection');
}

else{
console.log('Row selection');
}
}    
}
