<?xml version="1.0" encoding="UTF-8"?>
<Workflow xmlns="http://soap.sforce.com/2006/04/metadata">
    <fieldUpdates>
        <fullName>vlocity_ins__UpdateFTE</fullName>
        <field>vlocity_ins__FTE__c</field>
        <formula>1</formula>
        <name>UpdateFTE</name>
        <notifyAssignee>false</notifyAssignee>
        <operation>Formula</operation>
        <protected>false</protected>
    </fieldUpdates>
    <rules>
        <fullName>vlocity_ins__UpdateFTE</fullName>
        <actions>
            <name>vlocity_ins__UpdateFTE</name>
            <type>FieldUpdate</type>
        </actions>
        <active>true</active>
        <criteriaItems>
            <field>vlocity_ins__GroupCensusMember__c.vlocity_ins__FTE__c</field>
            <operation>equals</operation>
        </criteriaItems>
        <criteriaItems>
            <field>vlocity_ins__GroupCensusMember__c.vlocity_ins__MemberType__c</field>
            <operation>equals</operation>
            <value>Full Time</value>
        </criteriaItems>
        <triggerType>onCreateOrTriggeringUpdate</triggerType>
    </rules>
</Workflow>
