import { LightningElement,track,wire } from 'lwc';
import {NavigationMixin} from 'lightning/navigation';
import getUrgentTasks from '@salesforce/apex/getTaskController.getUrgentTasks';
export default class UrgentTask extends NavigationMixin(LightningElement) {
    @track
    urgentTasks=[];
    @track desc= false;
    @wire (getUrgentTasks) wiredTasks({data,error}){
        if(data) {
        this.urgentTasks = data;   
        console.log(data); 
        } else if (error) {
        console.log(error);
        }
   }

   handleClick(event){
    let recordId = event.target.name; 
    console.log(recordId);
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: recordId,
               objectApiName: 'Assigned_Task__c', 
                actionName: 'view'
            }
        });
    
    }

    /*RefreshU(){
        refreshApex(this.Response);
    }*/


    Reroute(){
        this[NavigationMixin.Navigate]({
            type: "standard__objectPage",
            attributes: {
                objectApiName: "Assigned_task__c",
                actionName: "list"
            }
    });
    }

    handleOnselect(event) {
        let selected = event.detail.value;  
        if(selected=='Name'){
        if(!this.desc){
        
        this.urgentTasks = JSON.parse(JSON.stringify(this.urgentTasks) ).sort( ( a, b ) => {
        console.log(a[selected]);
        return a['Name']>b['Name']? 1 : -1 ;
        
        });;
        this.desc= true;
        }
        else{
        this.urgentTasks = JSON.parse( JSON.stringify( this.urgentTasks) ).sort( ( a, b ) => {
        return a['Name']>b['Name']? -1 : 1 ;    
        });;
        this.desc = false;
        
        }
        }
    }
}