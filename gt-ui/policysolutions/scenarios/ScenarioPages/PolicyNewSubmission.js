import { PcfButton, PcfSelectInput, PcfTextInput } from "@gtui/gt-ui-framework";
import { t } from "testcafe";
import { Panels } from "./Panels";
import PolicyData from "../../utils/PolicyData";
import { PolicyMenuTabBar } from "./PolicyMenuTabBar";

const pcPanels = new Panels();
export class PolicyNewSubmission {        

    async SelectProduct(LOB) {        
       let productNameCell = pcPanels.centerpanel.component.find("td[id$=-Name_Cell]").withExactText(LOB);
       await PcfButton(productNameCell.sibling("td[id$=-Select]").find("div.gw-LinkWidget[id$=-addSubmission]")).click();       
    }

    async CreateSubmission(LOB) {
        await this.PolicyInfo();                
        //switch case per lob
        switch(LOB) {
            case "Vehicule Particulier": 
                await this.VehiculeParticulier();
                await this.VehiculeParticulierDriver();
                break;
            case "Deux-Roues (ang)": 
                //Add actions here
                break;
            case "Voiturette (ang)": 
                //Add actions here
                break;
            case "Garantie Accident (ang)": 
                //Add actions here
                break;
            default:
                break;
        }
        await this.Coverages();
        await this.Condition();        
        await this.QuotingSubmission();              
    }

    async PolicyInfo() {
        PolicyData.AccountforPersonalAuto.accountName = await pcPanels.centerpanel.component.find("div.gw-InfoBarElementWidget[id$=-AccountName]").find(".gw-infoValue").innerText;
        //Take note of submission number since we can't issue the policy here in localhost
        let submissionNumber = await pcPanels.westpanel.component.find(".gw-Wizard--Title").innerText;
        PolicyData.SubmissionNumber = submissionNumber.split(" ")[1];
        console.log("sub #: " + PolicyData.SubmissionNumber);
        await PcfButton(pcPanels.centerpanel.component.find("div.gw-BooleanRadioValueWidget[id$=-AntecedentsConcurrenceSelectorId_MCF]").find(".gw-label--inner").withExactText(PolicyData.Antecedentsconcurrence)).click();
        await PcfButton(pcPanels.centerpanel.component.find("div.gw-WizardButtonWidget[id$=-Next]")).click();
        console.log("Policy Info has been updated.");
    }

    async VehiculeParticulier() {
        await PcfTextInput(pcPanels.centerpanel.component.find("div.gw-TextValueWidget[id$=-immatriculation]")).setValue(PolicyData.VehiculeParticulierSubmissionDetails.Immatriculation);
        await PcfButton(pcPanels.centerpanel.component.find("div.gw-ImageButtonWidget[id$=-SelectpickerVechicleBrandModeleYear]")).click();
        await PcfSelectInput(pcPanels.centerpanel.component.find("div.gw-ExpressionRangeValueWidget[id$=-searchCriteriaBrand]")).selectOptionByLabel(PolicyData.VehiculeParticulierSubmissionDetails.Marque);
        await PcfTextInput(pcPanels.centerpanel.component.find("div.gw-TextValueWidget[id$=-searchCriteriaYear]")).setValue(PolicyData.VehiculeParticulierSubmissionDetails.Annee);
        await t.pressKey("tab");
        await PcfSelectInput(pcPanels.centerpanel.component.find("div.gw-ExpressionRangeValueWidget[id$=-searchCriteriaModel]")).selectOptionByLabel(PolicyData.VehiculeParticulierSubmissionDetails.Modele);
        await PcfButton(pcPanels.centerpanel.component.find("div.gw-LinkWidget[id$=-Search]")).click();
        await PcfButton(pcPanels.centerpanel.component.find("td[id$=-rowVehicleBrand_Cell]").withExactText(PolicyData.VehiculeParticulierSubmissionDetails.Marque).sibling("td[id$=-VPSelectVehicleResultsPanelSet-0-1]").find("div.gw-SelectorCellValueWidget[id$=-_Select]")).click();
        await PcfButton(pcPanels.centerpanel.component.find("div.gw-RangeRadioValueWidget[id$=-InformationFinancementId]").find(".gw-label--inner").withExactText(PolicyData.VehiculeParticulierSubmissionDetails.Financement)).click();
        await PcfSelectInput(pcPanels.centerpanel.component.find("div.gw-TypeKeyValueWidget[id$=-ImmatriculationCountry]")).selectOptionByLabel(PolicyData.VehiculeParticulierSubmissionDetails.PaysdeProvence);
        await PcfButton(pcPanels.centerpanel.component.find("div.gw-WizardButtonWidget[id$=-Next]")).click(); 
        console.log("vehicle has been added.");   
    }

    async VehiculeParticulierDriver() {
        await PcfButton(pcPanels.centerpanel.component.find("div.gw-AddButtonWidget[id$=-addDriver]")).click();
        await PcfButton(pcPanels.centerpanel.component.find("div.gw-AddMenuItemWidget[id$=-AccountContact]").find(".gw-label").withExactText(PolicyData.AccountforPersonalAuto.accountName)).click();
        await PcfSelectInput(pcPanels.centerpanel.component.find("div.gw-ExpressionRangeValueWidget[id$=-LicenseType]")).selectOptionByLabel(PolicyData.VehiculeParticulierSubmissionDetails.LicenseType);
        await PcfTextInput(pcPanels.centerpanel.component.find("div.gw-DateValueWidget[id$=-LicenseDate]")).setValue(PolicyData.VehiculeParticulierSubmissionDetails.LicenseDate);
        await PcfSelectInput(pcPanels.centerpanel.component.find("div.gw-ExpressionRangeValueWidget[id$=-LicenseTypology]")).selectOptionByLabel(PolicyData.VehiculeParticulierSubmissionDetails.LicenseLearningMode);        
        await PcfSelectInput(pcPanels.centerpanel.component.find("div.gw-ExpressionRangeValueWidget[id$=-DriverActivity]")).selectOptionByLabel(PolicyData.VehiculeParticulierSubmissionDetails.ActiveConducteur);
        await PcfSelectInput(pcPanels.centerpanel.component.find("div.gw-ExpressionRangeValueWidget[id$=-VehiculeUseDisplay]")).selectOptionByLabel(PolicyData.VehiculeParticulierSubmissionDetails.UsageofVehicle);
        await PcfButton(pcPanels.centerpanel.component.find("div.gw-BooleanRadioValueWidget[id$=-annulationPermis_Ext]").find(".gw-label--inner").withExactText(PolicyData.VehiculeParticulierSubmissionDetails.LicenseInvalidation)).click();
        await PcfButton(pcPanels.centerpanel.component.find("div.gw-BooleanRadioValueWidget[id$=-annulationContrat_Ext]").find(".gw-label--inner").withExactText(PolicyData.VehiculeParticulierSubmissionDetails.LicenseTermination)).click();
        await PcfButton(pcPanels.centerpanel.component.find("div.gw-CardTabWidget[id$=-antecedentConducteurTab]")).click();
        await PcfSelectInput(pcPanels.centerpanel.component.find("div.gw-ExpressionRangeValueWidget[id$=-antecedentAssuranceAutoGlobaux_Ext]")).selectOptionByLabel(PolicyData.VehiculeParticulierSubmissionDetails.DriverHistoryConducteurPrincipal);
        /**Note Additional fields appears depends on Novice Neutralization value 
          Kindly update this for additional fields actions on the near future */
        await PcfSelectInput(pcPanels.centerpanel.component.find("div.gw-ExpressionRangeValueWidget[id$=-neutralisationNovice]")).selectOptionByLabel(PolicyData.VehiculeParticulierSubmissionDetails.DriverHistoryNoviceNeuralization);
        await PcfTextInput(pcPanels.centerpanel.component.find("div.gw-TextValueWidget[id$=-nombreAccidentResponsable]")).setValue(PolicyData.VehiculeParticulierSubmissionDetails.DriverHistoryAccident);
        await PcfTextInput(pcPanels.centerpanel.component.find("div.gw-TextValueWidget[id$=-nombreSinistreVol]")).setValue(PolicyData.VehiculeParticulierSubmissionDetails.DriverHistoryTheft);
        await PcfTextInput(pcPanels.centerpanel.component.find("div.gw-TextValueWidget[id$=-nombreSinistreBG]")).setValue(PolicyData.VehiculeParticulierSubmissionDetails.DriverHistoryBreakage);
        await PcfTextInput(pcPanels.centerpanel.component.find("div.gw-TextValueWidget[id$=-coefficientBonusMalus]")).setValue(PolicyData.VehiculeParticulierSubmissionDetails.DriverHistoryCoefficient);
        await PcfTextInput(pcPanels.centerpanel.component.find("div.gw-TextValueWidget[id$=-nombreJourAssurance]")).setValue(PolicyData.VehiculeParticulierSubmissionDetails.DriverHistoryNoInsuranceDays);
        await PcfButton(pcPanels.centerpanel.component.find("div.gw-WizardButtonWidget[id$=-Next]")).click(); 
        console.log("driver has been added.");        
    }

    async Coverages() {
       await PcfSelectInput(pcPanels.centerpanel.component.find("div.gw-ExpressionRangeValueWidget[id$=-OfferingSelection]")).selectOptionByLabel(PolicyData.CoverageOfferingSelection);
       await PcfButton(pcPanels.centerpanel.component.find("div.gw-WizardButtonWidget[id$=-Next]")).click(); 
       console.log("Coverage has been selected.");
    }

    async Condition() {
        await PcfSelectInput(pcPanels.centerpanel.component.find("div.gw-TypeKeyValueWidget[id$=-TypeFractionnement]")).selectOptionByLabel(PolicyData.ConditionFrequementPayment);
        await PcfButton(pcPanels.centerpanel.component.find("div.gw-WizardButtonWidget[id$=-Next]")).click();
        let warningMessage = pcPanels.centerpanel.component.find("div.gw-message[id$=-msgs-0-0]");
        if (warningMessage.exists) {
            await PcfButton(pcPanels.centerpanel.component.find("div.gw-WizardButtonWidget[id$=-Next]")).click();
        }
        console.log("Condition has been selected.");
     }     

     async QuotingSubmission() {
        await PcfButton(pcPanels.centerpanel.component.find("div.gw-WizardButtonWidget[id$=-Next]")).click(); 
        await PcfButton(pcPanels.centerpanel.component.find("div.gw-ToolbarButtonWidget[id$=-Quote]")).click(); 
        
        let RiskAnalysisRequired = pcPanels.centerpanel.component.find("div.gw-TitleBarWidget[id$=-PreQuoteIssueTitle]");
        if(RiskAnalysisRequired.exists) {
            await PcfButton(pcPanels.centerpanel.component.find("div.gw-ToolbarButtonWidget[id$=-DetailsButton]")).click();
            await this.RiskAnalysis();            
        }        
     }

     async RiskAnalysis() { 
        let specialApprove = pcPanels.centerpanel.component.find("div.gw-LinkWidget[id$=-SpecialApprove]");
        if (specialApprove.exists) {        
            let specialApproveCount = await specialApprove.count - 1;
            for (let i=0; i <= specialApproveCount; i++) {
                await PcfButton(specialApprove).click();
                await PcfSelectInput(pcPanels.centerpanel.component.find("div.gw-TypeKeyValueWidget[id$=-MotifApprobation]")).selectNthOption(1);    
                //Converting the textareavaluewidget to pcfSelectInput doesn't work in text area fields             
                await t.typeText(pcPanels.centerpanel.component.find("div.gw-TextAreaValueWidget[id$=-MotifDecision]"),PolicyData.RiskAnalysisReason);                                                
                await PcfButton(pcPanels.centerpanel.component.find("div.gw-ToolbarButtonWidget[id$=-Update]")).click();                
            }
        }
        console.log("Risk Analysis completed.");    
     }

     async ValidateSubmission() {
        let submissionNumber = await pcPanels.westpanel.component.find(".gw-Wizard--Title").innerText;
        if (submissionNumber == PolicyData.submissionNumber) {
            console.log("Submission has been found.");
        }
        else {
            console.log("Submission not found!");
        }
     }
}