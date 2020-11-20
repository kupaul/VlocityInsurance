				angular.module('attributeLookupUI',['parameters'])
                	.factory('attributeLookupService', function($rootScope, ParametersFactory){
                		var factory = {};
	                    factory.getAttributes = function(categoryCode) {
                            var deferred = new j$.Deferred();
                            
                            var parameters = {};
		                	parameters['methodName'] =  'getAttributes';
		                	parameters['categoryCode'] = categoryCode;
		                				
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
	                    
	                    factory.getAttributesModalData = function(fieldName) {
                            var deferred = new j$.Deferred();
                            
                            var parameters = {};
		                	parameters['methodName'] =  'getAttributesModalData';
		                	parameters['fieldName'] = fieldName;
		                				
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
	                    factory.parseFields = function (selected) {
							
							console.log(selected.category);
							console.log(selected.attribute);
							retVal = {};
							retVal.fullFieldName = selected.category.Name 
													+ ':' + selected.category[ParametersFactory.getNsPrefix() + 'Code__c'] 
													+ '.' + selected.attribute.Name
													+ ':' + selected.attribute[ParametersFactory.getNsPrefix() + 'Code__c'] ;
							retVal.fieldType = '';
							return retVal;

						};
	                    return factory;
                	})
		   			.directive('attributeLookup',function(attributeLookupService, ParametersFactory){
		   				return {
		   					restrict: 'E',
		   					templateUrl: 'attributeLookup.html',
		   					scope: {
		   						fieldName: '=',
		   						selected: '='
		   					},
		   					link: function(scope, element){
								scope.init = function(){
									attributeLookupService.getAttributesModalData(scope.fieldName).then(function(result){
										console.log('result.attributeCategoriesList');
										console.log(result.attributeCategoriesList);
										console.log('result.attributesList');
										console.log(result.attributesList);
										scope.attributeCategoriesList = result.attributeCategoriesList;
										scope.attributesList = result.attributesList;
										
										if(scope.fieldName){
											var categoryInfo = scope.fieldName.split('.')[0];
											var attrInfo = scope.fieldName.split('.')[1];
											var categoryCode = categoryInfo.substring(categoryInfo.indexOf(':') + 1,categoryInfo.length);
											var attributeCode = attrInfo.substring(attrInfo.indexOf(':') + 1,attrInfo.length);
											for(i=0; i < scope.attributeCategoriesList.length; i++){
												console.log('categoryCode');
												console.log(scope.attributeCategoriesList[i][ParametersFactory.getNsPrefix() + 'Code__c']);
												
												
												if(scope.attributeCategoriesList[i][ParametersFactory.getNsPrefix() + 'Code__c'] === categoryCode){
													scope.selected.category = scope.attributeCategoriesList[i];
													
												} 
					
											}
											for(i=0; i < scope.attributesList.length; i++){
												console.log('attributeName');
												console.log(scope.attributesList[i].Name);
												if(scope.attributesList[i][ParametersFactory.getNsPrefix() + 'Code__c'] === attributeCode){
													scope.selected.attribute = scope.attributesList[i];
													
												} 
					
											}
										} 
									
										scope.$apply();
									})
									
								}
								scope.populateAttributes = function(){
									attributeLookupService.getAttributes(scope.selected.category[ParametersFactory.getNsPrefix() + 'Code__c']).then(function(result){
										console.log('result.attributesList');
										console.log(result.attributesList);
										scope.attributesList = result.attributesList;
									
										scope.$apply();
									})
									
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
								console.log('scope');
								console.log(scope);
								scope.attributeCategoriesList = [];
								scope.attributesList = [];
								scope.objectNameToFields = {};
								scope.objectNameToFields[scope.objectName] = {};
								scope.objectNameToFieldDescribes = {};
								var counter = 0;
								scope.init();
		   					
		   					}
		   					
		   				}
		   			
		   			});