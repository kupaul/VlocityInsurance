// Nov 18 workaround for Smartcard Open Claim feature
trigger UpdateLatestOpenClaimOnAsset on vlocity_ins__InsuranceClaim__c (after update) {
   LatestOpenClaimOnAsset.updateAssets(trigger.new);

}