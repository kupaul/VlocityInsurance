public class LatestOpenClaimOnAsset {
  public static void updateAssets (List<vlocity_ins__InsuranceClaim__c > newClaims){
        
        Set<Id> claimIds = new Set<Id>();
        for( vlocity_ins__InsuranceClaim__c cl: newClaims){
            claimIds.add(cl.Id);
        }
        
        List<vlocity_ins__InsuranceClaim__c > reorder = [select Id, vlocity_ins__PrimaryPolicyAssetId__c 
        from vlocity_ins__InsuranceClaim__c 
        where vlocity_ins__ClaimStatus__c = 'Open' and Id in :claimIds and vlocity_ins__PrimaryPolicyAssetId__c  != null  order by lastModifiedDate ];
        
        if(reorder.size()>0){
            Map<Id,vlocity_ins__InsuranceClaim__c> assetClaimMap = new Map<Id,vlocity_ins__InsuranceClaim__c>();
            
             for( vlocity_ins__InsuranceClaim__c c: newClaims){
                 assetClaimMap.put(c.vlocity_ins__PrimaryPolicyAssetId__c,c);
             }
            
             List<Asset> assetList = [select Id, Latest_Open_Claim__c from Asset where Id in :assetClaimMap.keySet()];
             
             if(assetList.size()>0){
                   for(Asset a : assetList){
                       a.Latest_Open_claim__c = assetClaimMap.get(a.Id).Id;
                   }
                   
                   update assetList;
                 
             }
            
        }
        
      
  }
}