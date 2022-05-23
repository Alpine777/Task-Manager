import { LightningElement,track,wire } from 'lwc';
//import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import getName from '@salesforce/apex/ProjectController.getName';
import getNewProjectName from '@salesforce/apex/ProjectController.getNewProjectName';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
// import { reduceErrors } from 'c/ldsUtils';
import {
    subscribe,
    unsubscribe,
    APPLICATION_SCOPE,
    MessageContext,
} from 'lightning/messageService';
import projectMessageChannel from '@salesforce/messageChannel/projectMessageChannel__c';
// import NAME_FIELD from '@salesforce/schema/Project__c.Name';
// const fields = [
//     NAME_FIELD];

export default class ProjectDisplay extends LightningElement {
    subscription = null;
    //publishedId;
    @track data;
    @track dataSet;

    // @wire(getRecord, { recordId: '$publishedId', fields })
    // wiredRecord({ error, data }) {
    //     if (error) {
    //         this.dispatchToast(error);
    //     } else if (data) {
    //         fields.forEach(
    //             (item) => (this[item.fieldApiName] = getFieldValue(data, item))
    //         );
    //     }
    // }

    loadName(publishedId){
        (publishedId == 'Null') ? this.handleDataNull():
        getName({projectId: publishedId})
        .then(results=>{
            this.data = JSON.stringify(results);
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

    loadProjectName(publishedName){
        (publishedName== 'Null')? this.handleDataSetNull():
        getNewProjectName({projectName: publishedName})
        .then(results=>{
            this.dataSet = JSON.stringify(results);
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

    handleDataNull(){
        this.data = 'No value selected';
    }

    handleDataSetNull(){
        this.dataSet = 'No value selected';
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

    @track Wrapper={
    publishedId:'Null',
    publishedName: 'Null'};

    // Handler for message received by component
    handleMessage(message) {

        var Wrapper= this.Wrapper;

        if (typeof(message.publishedName) != 'undefined'){
        Wrapper.publishedName= message.publishedName;
        }

        if (typeof(message.publishedId) != 'undefined'){
        Wrapper.publishedId= message.publishedId;
        }

        this.loadProjectName(Wrapper.publishedName);
        this.loadName(Wrapper.publishedId);
    }

    handlePublishedName
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