import { PolicyMenuTabBar } from "./ScenarioPages/PolicyMenuTabBar";
import { PolicyMenuActions } from "./ScenarioPages/PolicyMenuActions";
import { PolicyNewSubmission } from "./ScenarioPages/PolicyNewSubmission";

const policyMenuTabBar = new PolicyMenuTabBar();
const policyMenuActions = new PolicyMenuActions();
const policyNewSubmission = new PolicyNewSubmission();

export class SubmissionScenario {
    async CreateMobilitySubmission(LOB) {
        await policyMenuTabBar.SearchForAccount();
        await policyMenuActions.NewSubmission();
        await policyNewSubmission.SelectProduct(LOB);  
        await policyNewSubmission.CreateSubmission(LOB);
    }

    async VerifySubmissionIsCreated() {
        await policyMenuTabBar.SearchForSubmission();
        await policyNewSubmission.ValidateSubmission();
    }
}