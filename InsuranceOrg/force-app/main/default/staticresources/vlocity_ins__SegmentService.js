				function getSegments(objectId,categoryCode,pagenum,pagesize,callback)
			   	{ 
			   	  	Visualforce.remoting.Manager.invokeAction( 
						  			'SegmentDisplayController.getSegments',
						  			 objectId,categoryCode,pagenum,pagesize,"",callback,
					         		{escape: false}  ); 
				} 
		   	  	function querySegments(query ,catcode,callback)
			   	{ 	
			   	  	Visualforce.remoting.Manager.invokeAction( 
						  			'SegmentDisplayController.querySegments',
						  			 query,catcode,callback,
					         		{escape: false}  );  
				}		   	  	
				function getCategories(objectType,callback)
			   	{ 	
			   	  	Visualforce.remoting.Manager.invokeAction( 
						  			'SegmentDisplayController.getCategories',
						  			 objectType,callback,
					         		{escape: false}  );  
				}
				function getCategoriesFromObjectId(objectId, callback)
				{
					Visualforce.remoting.Manager.invokeAction( 
						  			'SegmentDisplayController.getCategoriesFromObjectId',
						  			 objectId,callback,
					         		{escape: false}  );  
				}  
		        var segmentSdkModule = angular.module('segmentsSDKModule',[]);
		        segmentSdkModule.factory('segmentsService',function($q,$rootScope){  
		        	var factory = {};  
		        	factory.getData = function(objectId,categoryCode){  
					        var deferred = $q.defer();  
					        getSegments(objectId,categoryCode,1,100,function(result){  
						        $rootScope.$apply(function(){  
						        	deferred.resolve(result);  
					        	});  
					        });  
				        	return deferred.promise;  
			       	};
			       	factory.searchSegments = function(query,catcode) {
			       			var deferred = $q.defer();
					        querySegments(query,catcode,function(result){  
						        $rootScope.$apply(function(){ 
						        	var sresult ;
						        	if ( result){
						        		sresult = angular.fromJson(result); 
						        	}
						        	deferred.resolve(sresult);  

					        	});  
					        });  
				        	return deferred.promise;  
			       	};

			       	factory.getCategories = function(objType) {
			       			var deferred = $q.defer();
					        getCategories(objType,function(result){  
						        $rootScope.$apply(function(){ 
						        	var sresult = angular.fromJson(result);
						        	deferred.resolve(sresult);  
					        	});  
					        });  
				        	return deferred.promise;  
			       	};
			       	
			       	factory.getCategoriesFromObjectId = function(objId) {
			       			var deferred = $q.defer();
					        getCategoriesFromObjectId(objId,function(result){  
						        $rootScope.$apply(function(){ 
						        	var sresult = angular.fromJson(result);
						        	deferred.resolve(sresult);  
					        	});  
					        });  
				        	return deferred.promise;  
			       	};

		       		return factory;  
		     	});  
