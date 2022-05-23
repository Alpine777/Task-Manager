import { LightningElement,api,track,wire} from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import {loadStyle} from 'lightning/platformResourceLoader';
import toDoListCss from '@salesforce/resourceUrl/toDoListCss';
import getTasks from '@salesforce/apex/getTaskController.getTasks';
import deletePersonalTask from '@salesforce/apex/getTaskController.deletePersonalTask';
import { publish, MessageContext } from 'lightning/messageService';
import recordSelected from '@salesforce/messageChannel/projectMessageChannel__c';
import {refreshApex} from '@salesforce/apex';
export default class TodoList extends NavigationMixin(LightningElement) {
renderedCallback() {

Promise.all([
loadStyle( this, toDoListCss )
]).then(() => {
    console.log( 'Files loaded' );
})
.catch(error => {
    console.log( error.body.message );
});

}
@track desc= false;
@track descP= false;
@track todoTasks=[];
@track priorities = 
{
'High' : 0, 
'Normal' : 1,
'Low' : 2,
}

/**
 * Return true if todoTasks exists
 */
get hasTodos(){
return this.todoTasks.length > 0 ? true : false;
}
get color(){

return 'Completed';
}
//Method 2
@wire (getTasks) wiredTasks(response){
if(response.data) {
this.todoTasks = response.data;
console.log(JSON.stringify(this.todoTasks));
this.Response= response;    
} else if (response.error) {
console.log(response.error);
}
}

@wire(MessageContext)
messageContext;

deleteTask(event){
//let todoTasks= this.todoTasks;
//let todoTaskIndex;
let idToDelete = event.target.name;

/*for(let i=0; i<todoTasks.length; i++) {
if(idToDelete === todoTasks[i].Id) {
todoTaskIndex = i;
}
}

todoTasks.splice(todoTaskIndex,1);
*/
deletePersonalTask({ptId:idToDelete}) 
.then(() => {
this.todoTasks = this.todoTasks.filter(function(todoTask) {
return todoTask.Id != idToDelete;
}, this);
})
.catch(error =>{
window.console.log('Unable to delete record due to ' + error.body.message);
});
}

/*viewTask(event){
let id = event.target.name;
this[NavigationMixin.Navigate]({
type: 'standard__recordPage',
attributes: {
recordId: id,
objectApiName: 'Personal_Task__c',
actionName: 'view'
}
});
}*/

addTask(event){

this[NavigationMixin.Navigate]({
type: 'standard__objectPage',
attributes: {
objectApiName: 'Personal_Task__c',
actionName: 'new'
}
});
}

Refresh(){
refreshApex(this.Response);
}

handleClick(event){
const payload = { recordId: event.target.contact.Id };

publish(this.messageContext, recordSelected, payload);
/*let id = event.target.name; 
console.log(id);
this[NavigationMixin.Navigate]({
    type: 'standard__recordPage',
    attributes: {
        recordId: id,
        objectApiName: 'Personal_Task__c', // objectApiName is optional
        actionName: 'view'
    }
});*/

}

handleOnselect(event) {
let selected = event.detail.value;  
let priorities= this.priorities;
if(selected=='Name'){
if(!this.desc){

this.todoTasks = JSON.parse(JSON.stringify(this.todoTasks) ).sort( ( a, b ) => {
console.log(a[selected]);
return a['Name']>b['Name']? 1 : -1 ;

});;
this.desc= true;
}
else{
this.todoTasks = JSON.parse( JSON.stringify( this.todoTasks) ).sort( ( a, b ) => {
return a['Name']>b['Name']? -1 : 1 ;    
});;
this.desc = false;

}
}

else{
console.log();       
if(!this.descP){
this.todoTasks = JSON.parse( JSON.stringify(this.todoTasks) ).sort( ( a, b ) => {
console.log(a[selected]);
return priorities[a[selected]] > priorities[b[selected]]? 1 : -1;

});;
this.descP= true;
}
else{
this.todoTasks = JSON.parse( JSON.stringify( this.todoTasks) ).sort( ( a, b ) => {
return priorities[a[selected]] > priorities[b[selected]] ? -1 : 1;  
});;
this.descP = false;

}
}

}


}