import {LightningElement,api,wire,track} from 'lwc';
import {loadScript} from 'lightning/platformResourceLoader';
import ChartJS from '@salesforce/resourceUrl/ChartJS';
import ChartJS_Outlabel from '@salesforce/resourceUrl/ChartJS_Outlabel';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import getProjects from '@salesforce/apex/ChartController.getProjects';
import {
subscribe,
unsubscribe,
APPLICATION_SCOPE,
MessageContext,
} from 'lightning/messageService';
import projectMessageChannel from '@salesforce/messageChannel/projectMessageChannel__c';

export default class DisplayChart extends LightningElement {

subscription = null;
@track dataSet;
@api chartjsInitialized = false;

loadProject(publishedId){
getProjects({projectId: publishedId})
.then(results=>{
this.dataSet = results;
console.log(this.dataSet);
console.log(results);
this.Initializechartjs();
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

renderedCallback() {
if (this.chartjsInitialized) {
return;
}
this.chartjsInitialized = true;

Promise.all([
    loadScript(this, ChartJS),

    loadScript(this, ChartJS_Outlabel)
])
.then(() => {
    console.log('Loaded');
})
.catch(error => {
    console.log(error.message)
    this.dispatchEvent(
        new ShowToastEvent({
            title: 'Error loading chartJs',
            message: error.message,
            variant: 'error'
        })
    );
});

}

@track count= false;
Initializechartjs() {
var ctx = this.template.querySelector(".pie-chart").getContext('2d');
var piechart;
piechart = new Chart(ctx, {
type: 'pie',
data: {
    labels: ['Tasks In Progress','Tasks Completed', 'Tasks Approved'],
    datasets: [{
        label: 'count',
        data: [this.dataSet[0].Number_of_Tasks_Assigned__c - this.dataSet[0].Number_of_Tasks_Completed__c - this.dataSet[0].Number_of_Tasks_Approved__c, this.dataSet[0].Number_of_Tasks_Completed__c, this.dataSet[0].Number_of_Tasks_Approved__c],
        backgroundColor: ["#FFD700", "#2ECC40", "#0074D9"]

    }]
},
    // plugins: [{

    //     tooltip: {
    //         enabled: true
    //     },
    //     title: {
    //         display: true,
    //         text: 'Project Progress',
    //         padding: {
    //             top: 10,
    //             bottom: 30
    //         }
    //     },
    //     outlabels: {
    //         text: '%l %p',
    //         color: 'white',
    //         stretch: 20,
    //         font: {
    //             resizable: true,
    //             minSize: 12,
    //             maxSize: 18
    //         }
    //         }
    // }]

    options: {
        title: {
            display: true,
            text: 'Project Progress',
        },
        outlabels: {
                    text: '%l %p',
                    color: 'white',
                    stretch: 20,
                    font: {
                        resizable: true,
                        minSize: 12,
                        maxSize: 18
                    }
                },
        legend: {
            display: true,
            position: 'bottom',
            fullWidth: false,
            onClick: () => {},
            labels: {
            //   generateLabels: (chart) => {
            //      return pieOptions.legendLeft(chart);
            //    }
            }
        },
        rotation: 3.9,
        },
        plugins: [{
        beforeInit: function(chart, options) {
            console.log('yolo');
        }
        }]

});
//piechart.destroy();
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
const publishedId = message.publishedId;
if (publishedId != 'Null'){
this.loadProject(publishedId);
}

else{
this.dataset= null;
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