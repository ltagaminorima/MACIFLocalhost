"use strict";
const {Given, When, Then} = require("@cucumber/cucumber");
import { onApp } from "../../../../gt-ui/pageregistry/onApp.js";
import { SubmissionScenario } from "../../scenarios/SubmissionScenario.js";

let onPCApp = new onApp("PC");
let submissionScenario = new SubmissionScenario();

Given(/^Login to PC/, async function() {
    await onPCApp.loginWithUser('su','gw');
    console.log("login PC");
});

When(/^Create (.*) Policy/, async function(t, stepArguments) {   
    let LOB = stepArguments[0];      
    await submissionScenario.CreateMobilitySubmission(LOB);     
});

Then(/^Verify if submission was created/, async function() {
    await submissionScenario.VerifySubmissionIsCreated();
});


