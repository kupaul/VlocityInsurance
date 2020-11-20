import { LightningElement } from 'lwc';

import { BaseState } from "vlocity_ins/baseState";

import template from "./testState.html";

export default class testState extends BaseState(LightningElement) {
render() {


        return template;
    }
}