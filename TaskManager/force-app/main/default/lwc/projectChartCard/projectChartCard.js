import { LightningElement,track,wire} from 'lwc';
import getProjects from '@salesforce/apex/ChartController.getProjects';
import {
    subscribe,
    unsubscribe,
    APPLICATION_SCOPE,
    MessageContext,
} from 'lightning/messageService';
import projectMessageChannel from '@salesforce/messageChannel/projectMessageChannel__c';
export default class ProjectChartCard extends LightningElement {

    @track Project_Name;
    @track data;

    loadProjectName(publishedId){
        getProjects({projectId: publishedId})
        .then(results=>{
            this.data = results;
            this.Project_Name = this.data[0].Name;
           console.log(this.Project_Name); 
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

    @wire(MessageContext)
    messageContext;

    // Encapsulate logic for Lightning message service subscribe and unsubsubscribe
    subscribeToMessageChannel() {
        if (!this.subscription) {
            this.subscription = subscribe(
                this.messageContext,
                projectMessageChannel,
                (message) => this.handleMessage(message),
                { scope: APPLICATION_SCOPE }
            );
        }
    }

    unsubscribeToMessageChannel() {
        unsubscribe(this.subscription);
        this.subscription = null;
    }

    // Handler for message received by component
    handleMessage(message) {
        
        if (message.publishedId != 'Null'){
        const publishedId = message.publishedId;
        this.loadProjectName(publishedId);
        }
        
         else{
             this.Project_Name= 'Empty Selection';
        }
    }

    // Standard lifecycle hooks used to subscribe and unsubsubscribe to the message channel
    connectedCallback() {
        this.subscribeToMessageChannel();
    }

    disconnectedCallback() {
        this.unsubscribeToMessageChannel();
    }

    // Helper
    dispatchToast(error) {
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Error loading contact',
                message: reduceErrors(error).join(', '),
                variant: 'error',
            })
        );
    }
}