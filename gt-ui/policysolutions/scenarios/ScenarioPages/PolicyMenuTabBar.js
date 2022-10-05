import { PcfComponent } from "@gtui/gt-ui-framework";
import { t } from "testcafe";
import PolicyData from "../../utils/PolicyData.js";

export class PolicyMenuTabBar {
    
    AccountTabBar = PcfComponent("#TabBar-AccountTab");
    PolicyTabBar = PcfComponent("#TabBar-PolicyTab");

    async SearchForAccount() {    
        await t.click(this.AccountTabBar.component.find("div.gw-action--expand-button"));
        await t.typeText(this.AccountTabBar.component.find("div.gw-SearchItemValueWidget[id$=-AccountTab_AccountNumberSearchItem]"),PolicyData.AccountforPersonalAuto.accountNumber);
        await t.click(this.AccountTabBar.component.find("div.gw-SearchItemButtonWidget[id$=-AccountTab_AccountNumberSearchItem_Button]"));
    }
    
    async SearchForSubmission() {
        await t.click(this.PolicyTabBar.component.find("div.gw-action--expand-button"));
        await t.typeText(this.PolicyTabBar.component.find("div.gw-SearchItemValueWidget[id$=-PolicyTab_SubmissionNumberSearchItem]"),PolicyData.SubmissionNumber);
        await t.click(this.PolicyTabBar.component.find("div.gw-SearchItemButtonWidget[id$=-PolicyTab_SubmissionNumberSearchItem_Button]"));
    }
}