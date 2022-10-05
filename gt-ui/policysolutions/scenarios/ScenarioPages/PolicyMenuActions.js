import { PcfComponent } from "@gtui/gt-ui-framework";
import { t } from "testcafe";
export class PolicyMenuActions {
    
    menuActions = PcfComponent("#AccountFile-AccountFileMenuActions");

    async NewSubmission() {
        await this.menuActions.click();
        await t.click(this.menuActions.component.find("div.gw-MenuItemWidget[id$=-AccountFileMenuActions_NewSubmission]"));
    }
}