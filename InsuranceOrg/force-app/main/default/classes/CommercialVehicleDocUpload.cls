global with sharing class CommercialVehicleDocUpload {
    
public Blob csvFileBody{get;set;}
public string csvAsString{get;set;}
public String[] csvFileLines{get;set;}
public List<CommercialVehicle__c> vehicleList{get;set;}

public CommercialVehicleDocUpload(){
    csvFileLines = new String[]{};
        vehicleList = New List<CommercialVehicle__c>(); 
}
    
private void importCSVFile(){
try{
// Read CSV file body and store it in variable
csvAsString = csvFileBody.toString();
// Split CSV String to lines
csvFileLines = csvAsString.split('\n');
// Iterate CSV file lines and retrieve one column at a time.
for(Integer i=1; i < csvFileLines.size(); i++){
CommercialVehicle__c vehicleObj = new CommercialVehicle__c() ;
String[] csvRecordData = csvFileLines[i].split(',');
vehicleObj.Vehicle_Type__c = csvRecordData[0] ;
vehicleObj.Year__c = csvRecordData[1];
vehicleObj.Make__c = csvRecordData[2];
vehicleObj.Model__c = csvRecordData[3];
vehicleObj.Trim__c = csvRecordData[4];
vehicleObj.Body_Type__c = csvRecordData[5];
vehicleObj.Owenership_Type__c = csvRecordData[6];
vehicleObj.Color__c = csvRecordData[7];
vehicleObj.VIN__c = csvRecordData[8];
vehicleObj.License_State__c = csvRecordData[9];
vehicleObj.License_Plate__c = csvRecordData[10];
vehicleObj.Garage_Postal_Code__c = csvRecordData[11];
vehicleObj.Annual_Milage__c = csvRecordData[12];
vehicleObj.Radius_of_Operation__c = csvRecordData[13];
vehicleObj.Condition__c = csvRecordData[14];
vehicleList.add(vehicleObj);
}
// if all correct then insert Account into Org
if(vehicleList.size()>0)
{
insert vehicleList;
}
}
catch (Exception e)
{
ApexPages.Message errorMessage = new ApexPages.Message(ApexPages.severity.ERROR,'An error has occured while importing data into Salesforce. Please make sure input csv file is correct');
ApexPages.addMessage(errorMessage);
}
}

private String CovertToJson() {
List<CommercialVehicle__c> VehList =[select Vehicle_Type__c,Year__c, Make__c, Model__c,Trim__c,Body_Type__c,
                                         Owenership_Type__c,Color__c,VIN__c,License_State__c,License_Plate__c,
                                         Garage_Postal_Code__c,Annual_Milage__c,Radius_of_Operation__c,Condition__c
                                         from CommercialVehicle__c];
List<CommercialVehicleBuilder> CommVehiucleBuList = new List<CommercialVehicleBuilder>();
    for(CommercialVehicle__c veh:VehList) {
      CommercialVehicleBuilder  commVehBu = new CommercialVehicleBuilder();
      commVehBu.VehicleType = veh.Vehicle_Type__c;
      commVehBu.Year = veh.Year__c;
      commVehBu.Make = veh.Make__c;
      commVehBu.Model = veh.Model__c;
      commVehBu.Trim = veh.Trim__c;
      commVehBU.BodyType = veh.Body_Type__c;
      commVehBu.OwenershipType = veh.Owenership_Type__c;
      commVehBu.Color = veh.Color__c;
      commVehBu.VIN = veh.VIN__c;
      commVehBu.LicenseState = veh.License_State__c;
      commVehBu.LicensePlate = veh.License_Plate__c;
      commVehBu.GaragePostalCode = veh.Garage_Postal_Code__c;
      commVehBu.AnnualMilage = veh.Annual_Milage__c;
      commVehBu.RadiusofOperation = veh.Radius_of_Operation__c;
      commVehBu.Condition = veh.Condition__c;
      CommVehiucleBuList.add(commVehBu);
    }
String strJSON = JSON.serialize(CommVehiucleBuList);    
return strJSON;      
} 
    
global String uploadCSVFileAndConvertToJSON() {
 importCSVFile();
 String result = CovertToJson();
 return result;
}    

}