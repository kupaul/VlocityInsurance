import { LightningElement } from 'lwc';
import { BaseState } from "vlocity_ins/baseState";
import cardActive from "./npArticles.html";
import { addInteraction, initInteraction, getDefaultTrackingData } from "vlocity_ins/utility";

export default class npArticles extends BaseState(LightningElement) {

    render() {
        return cardActive;
    }

    connectedCallback() {
        if(this.obj){
        let interactionData = getDefaultTrackingData();
        let eventData = {
            'TrackingService': 'Acuity',
            'TrackingEvent': 'View',
            'ContextId': this.obj.contextId,
            'ResourceId': this.obj.resourceId,
            'ScaledRawScore': this.obj.scaledRawScore,
            'CurrentMachine': this.obj.currentMachine,
            'TargetObjectType': this.obj.targetObjectType,
            'TargetObjectKey': this.obj.targetObjectKey
        };
        interactionData = { ...interactionData, ...eventData };
        addInteraction(interactionData);
        }
    }
    get firstAction() {
        if (this.actions && this.actions.length > 0) {
            return this.actions[0];
        }
    }

    dismissOffer(event) {
        let interactionData = getDefaultTrackingData();
        let eventData = {
            'TrackingService': 'Acuity',
            'TrackingEvent': 'Reject',
            'ContextId': this.obj.contextId,
            'ResourceId': this.obj.resourceId,
            'ScaledRawScore': this.obj.scaledRawScore,
            'CurrentMachine': this.obj.currentMachine,
            'TargetObjectType': this.obj.targetObjectType,
            'TargetObjectKey': this.obj.targetObjectKey
        };
        interactionData = { ...interactionData, ...eventData };
        addInteraction(interactionData);
        event.stopPropagation();
    }

    addTrackingEntry() {
        let interactionData = getDefaultTrackingData();
        let eventData = {
            'TrackingService': 'Acuity',
            'TrackingEvent': 'Accept',
            'ContextId': this.obj.contextId,
            'ResourceId': this.obj.resourceId,
            'ScaledRawScore': this.obj.scaledRawScore,
            'CurrentMachine': this.obj.currentMachine,
            'TargetObjectType': this.obj.targetObjectType,
            'TargetObjectKey': this.obj.targetObjectKey
        };
        interactionData = { ...interactionData, ...eventData };
        addInteraction(interactionData);

    }
    /* generating source url of the article image */
    get getImageUrl() {
        let imageId = null;
        if (this.obj && this.obj.attachment) {
            Object.keys(this.obj.attachment).forEach((key) => {
                if (!imageId) {
                    imageId = this.obj.attachment[key];
                }
            });
            return '/' + window.location.pathname.split('/')[1] + '/servlet/servlet.FileDownload?file=' + imageId;
        }
        return '';
    }
}