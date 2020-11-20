				angular.module('fieldLookupUI',['parameters'])
                	.factory('fieldLookupService', function($rootScope, ParametersFactory){
                		var factory = {};
	                    factory.getObjectFieldsDescribe = function(objectNames) {
                            var deferred = new j$.Deferred();
                            
                            var parameters = {};
		                	parameters['methodName'] =  'getObjectFieldsDescribe';
		                	parameters['objectNames'] = objectNames;
		                				
		                    var remoteOptions ={};
		                    remoteOptions['apexType'] =  ParametersFactory.getClassType();
		                	remoteOptions['parameters'] =  JSON.stringify(parameters);
		                    
							Visualforce.remoting.Manager.invokeAction( 
		                                    ParametersFactory.getRemoteInvokeMethod(),
		                                    remoteOptions, 
		                                   	function(result){  
				                                $rootScope.$apply(function(){ 
				                                    var sresult =[];
				                                    if ( result){
				                                        sresult = angular.fromJson(result); 
				                                    }
				                                    deferred.resolve(sresult);  
				
				                                });  
				                            },
		                                    {buffer: false, escape: false}); 
                            
                            return deferred.promise();  
	                    };
	                    
	                    factory.getModalData = function(fieldName, sourceObjectType) {
                            var deferred = new j$.Deferred();
                            
                            var parameters = {};
		                	parameters['methodName'] =  'getModalData';
		                	parameters['fieldName'] = fieldName;
		                	parameters['sourceObjectType'] = sourceObjectType;
		                				
		                    var remoteOptions ={};
		                    remoteOptions['apexType'] =  ParametersFactory.getClassType();
		                	remoteOptions['parameters'] =  JSON.stringify(parameters);
		                    
							Visualforce.remoting.Manager.invokeAction( 
		                                    ParametersFactory.getRemoteInvokeMethod(),
		                                    remoteOptions, 
		                                   	function(result){  
				                                $rootScope.$apply(function(){ 
				                                    var sresult =[];
				                                    if ( result){
				                                        sresult = angular.fromJson(result); 
				                                    }
				                                    deferred.resolve(sresult);  
				
				                                });  
				                            },
		                                    {buffer: false, escape: false}); 
                            return deferred.promise();  
	                    };
	                    factory.parseFields = function (selectedFields) {
							var fieldName = [];
							var fieldType = null;
							var numberOfFields = selectedFields.length;
							var lastReferenceObject = null;
							for (i = 0; i < numberOfFields; i++) {
								var fieldInfo = selectedFields[i];
								if(fieldInfo.type === 'reference'){
									lastReferenceObject = fieldInfo.referenceTo[0];
									
								}
								// if it's a reference field and there is an element after it
								if(fieldInfo.type === 'reference' && i < numberOfFields - 1){
									if(fieldInfo.name.indexOf('__c') !== -1){
										fieldName.push(fieldInfo.name.replace('__c','__r'));
										
									}else{
										fieldName.push(fieldInfo.name.substring(0,fieldInfo.name.length-2));
										
									}
								} else {
									fieldName.push(fieldInfo.name);
									
								}
								fieldType = fieldInfo.type;
								
							}
							var fullFieldName = '';
							for (i = 0; i < fieldName.length; i++) { 
								fullFieldName += fieldName[i];
								if(i !==  fieldName.length-1){
									fullFieldName += '.';
									
								}
								
							} 
							retVal = {};
							retVal.fullFieldName = fullFieldName;
							retVal.fieldType = fieldType;
							retVal.lastReferenceObject = lastReferenceObject;
							return retVal;

						};
	                    return factory;
                	})
		   			.directive('fieldLookup',function(fieldLookupService, ParametersFactory){
		   				return {
		   					restrict: 'E',
		   					templateUrl: 'fieldLookup.html',
		   					scope: {
		   						objectName: '=',
		   						fieldName: '=',
		   						selectedFields: '='
		   					},
		   					link: function(scope, element, attrs){
								scope.init = function(){
									if(scope.fieldName){
										fieldLookupService.getModalData(scope.fieldName, scope.objectName).then(function(result){
											scope.objectNameToFieldDescribes = result.objectNameToFieldDescribes;
											for(var objectName in scope.objectNameToFieldDescribes){
												scope.objectNameToFields[objectName] = {};
												for(i = 0; i < scope.objectNameToFieldDescribes[objectName].length; i++){
													scope.objectNameToFields[objectName][scope.objectNameToFieldDescribes[objectName][i].name] = scope.objectNameToFieldDescribes[objectName][i];
													
												}
											}
											
											// build the required data for the modal
											// has to be done in the client side to allow for proper binding of the selected option
											var sourceFields = scope.fieldName.split('.');
											var sourceFieldsLength = sourceFields.length;
											scope.nextReferenceObject = null;
											//normalize the field names;
											for(i=0; i < sourceFieldsLength; i++){
												if(sourceFields[i].indexOf('__r') !== -1){
													sourceFields[i] = sourceFields[i].replace('__r','__c');
													
												} else {
													if(i < sourceFieldsLength - 1){
														sourceFields[i] += 'Id';
														
													}
					
												}
					
											}
											
											for (i = 0; i < sourceFieldsLength; i++) {
												var fieldName = sourceFields[i];
												//initialize first elemet
												if(i === 0){
													scope.selectedFields.push(scope.objectNameToFields[scope.objectName][fieldName]); 
													scope.fieldSets[counter++] = scope.objectNameToFieldDescribes[scope.objectName];
					
												} else {
													scope.selectedFields.push(scope.objectNameToFields[scope.nextReferenceObject][fieldName]); 
													scope.fieldSets[counter++] = scope.objectNameToFieldDescribes[scope.nextReferenceObject];
					
												}
												// save the next reference object name
												if(scope.selectedFields[i].type == 'reference'){
													scope.nextReferenceObject = scope.selectedFields[i].referenceTo;
												} else {
													scope.nextReferenceObject = null;
					
												}
												
											}
											scope.$apply();
										})
									} else {
										fieldLookupService.getObjectFieldsDescribe([scope.objectName]).then(function(result){
											scope.fieldSets[0] = result.objectNameToFieldDescribes[scope.objectName];
											scope.objectNameToFieldDescribes[scope.objectName] = scope.fieldSets[0];
											fieldsList = scope.fieldSets[0] ;
											for (i = 0; i < fieldsList.length; i++) { 
												scope.objectNameToFields[scope.objectName][fieldsList[i].name] = fieldsList[i];
												
											}
											scope.$apply();
										})
										
									}
								}
								scope.populateNextTable = function(parentIndex, selectedField){
									//clear the following lists to the selected one
									if(scope.fieldSets.length > 1){
										var startIndex = parentIndex + 1;
									    scope.selectedFields.splice(startIndex, scope.fieldSets.length);
									    scope.fieldSets.splice(startIndex, scope.fieldSets.length);
									    
									}
									
									if(selectedField.type === 'reference'){
										if(!scope.objectNameToFields.hasOwnProperty(selectedField.referenceTo[0])){
											nextIndex = parentIndex + 1;
											scope.fieldSets[nextIndex] = [];

											scope.displayWaitDialog(parentIndex);		
											fieldLookupService.getObjectFieldsDescribe([selectedField.referenceTo[0]]).then(function(result){
												var fields = result.objectNameToFieldDescribes[selectedField.referenceTo[0]];
												scope.objectNameToFields[selectedField.referenceTo[0]] = {};
												scope.objectNameToFieldDescribes[selectedField.referenceTo[0]] = fields;
												for (j = 0; j < fields.length; j++) { 
													scope.objectNameToFields[selectedField.referenceTo[0]][fields[j].name] = fields[j];
													
												}
												
												scope.fieldSets[++parentIndex] = scope.objectNameToFieldDescribes[selectedField.referenceTo[0]] ;
												scope.removeWaitDialog();
												scope.$apply();
											})
											
										} else {
											scope.fieldSets[++parentIndex] = scope.objectNameToFieldDescribes[selectedField.referenceTo[0]];
											scope.$apply();
										}
										
									}
									
								}

								scope.displayWaitDialog = function(parentIndex){
									var over = j$('<div id="overlay">' +
											            '<img id="loading" src="'+ParametersFactory.getLoadingImg()+'">' +
											            '</div>');
									var div = j$('.fieldsContainer-' + parentIndex);
									over.css('top', div.position().top);
									over.css('left', div.position().left+188);
							        j$(over).appendTo(div);

								}

								scope.removeWaitDialog = function(){
									j$('#overlay').remove();
								}
								
								
								scope.fieldSets = [];
								scope.objectNameToFields = {};
								scope.objectNameToFields[scope.objectName] = {};
								scope.objectNameToFieldDescribes = {};
								var counter = 0;
								scope.init();
		   					
		   					}
		   					
		   				}
		   			
		   			});