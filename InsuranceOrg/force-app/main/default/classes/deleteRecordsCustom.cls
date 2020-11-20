global with sharing class deleteRecordsCustom implements vlocity_ins.VlocityOpenInterface {
         global Boolean invokeMethod(String methodName,
                                Map<String,Object> inputs,
                                Map<String,Object> output,
                                Map<String,Object> options) {
                                   if(methodName == 'deleteQuote' || methodName.containsIgnoreCase('deleteQuote')){
                                   deleteQuote(inputs);
                                   }
                                   return true;
                                }
                                
                                void deletequote(Map<String,Object> inputs){
                                String Id;
                                system.debug('id=='+inputs);
                                if(inputs.containsKey('Id')){
                                Id = (string)inputs.get('Id');
                                }
                                List<Quote> qList = [Select Id from Quote where Id =:Id];
                                delete qList;
                                
                                }
                           
}