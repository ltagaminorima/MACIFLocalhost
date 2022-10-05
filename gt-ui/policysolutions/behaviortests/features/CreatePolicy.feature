Feature: Create a Policy
@CreatePolicy
Scenario: Create a Personal Auto Policy
Given Login to PC
When Create <Line of Business> Policy
Then Verify if submission was created

Examples:
        | Line of Business     |
        | Vehicule Particulier |
