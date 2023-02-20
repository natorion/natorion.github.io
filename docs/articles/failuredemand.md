# Failure Demand vs. Value Demand and User Story vs. Defect

Discussions if an item in the backlog is an User Story or a Defect can get very heated. Especially if everybody is correct. A solution for this debate can be the application of the (Lean) services terms _[Failure Demand](http://en.wikipedia.org/wiki/Failure_demand)_ and _Feature Demand_.

## User Story

A new functionality which is not yet present in the system. Keep in mind that “new functionality” also means altering existing functionality if the “old functionality” worked as specified/documented. The functionality implemented by the User Story should always be considered for documentation. Examples:

*   A new workflow to be implemented
*   Changing the existing branding of the product

## Defect

An “old functionality” which is not working as specified/documented. So a Defect is a malfunction in the “How it is done” part (Code). This means the DevTeam is mainly responsible for that. Examples:

*   Clicking somewhere on the GUI and an exception is thrown (and this obviously is not documented behaviour)
*   Undocumented/Unspecified found in the functionality of the User Story AFTER the User Story was accepted.

## Failure Demand

Coming from service organizations. It is a “demand caused by a failure to do something or do something right for the customer”. In this context User Stories and Defects can be Failure Demand. Typical catch phrases are “The customer expected it that way.”. Normally customers will not pay a dime for meeting the Failure Demand. More info can be found [here](http://en.wikipedia.org/wiki/Failure_demand). The PO (“What is done”) is the one to control this as the is controlling releases and funnelling customer feedback. Examples:

*   The user expects needs some features so he can properly use the product (after buying it)
*   Clicking somewhere on the GUI and an exception is thrown (and this obviously is not documented behaviour)

## Value Demand

This is where the cash is coming from :-). So new stuff the customer is willing to pay for. That is the pro-active part of the POs duties. Find new features which have a high ROI. Regarding new functionality the border between Failure Demand and Value Demand can be changing, depending on the sales pitch etc. Examples:

*   A new WYSIWYG editor for paying customers.