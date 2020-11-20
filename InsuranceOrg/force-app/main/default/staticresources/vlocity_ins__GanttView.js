(function(){
  var fileNsPrefix = (function() {
    'use strict';
    var scripts = document.getElementsByTagName('script');
    var lastScript = scripts[scripts.length - 1];
    var scriptName = lastScript.src;
    var parts = scriptName.split('/');
    var partsLength = parts.length - 1;
    var thisScript = parts[partsLength--];
    if (thisScript === "") {
      thisScript = parts[partsLength--];
    }

    // Fix to handle cases where js files are inside zip files
    // https://dev-card.na31.visual.force.com/resource/1509484368000/dev_card__cardframework_core_assets/latest/cardframework.js

    //fix for finding nsPrefix in subpaths and subdomains
    if (scriptName.indexOf('__') != -1) {
      while(thisScript.indexOf('__') == -1 && partsLength >= 0) {
        thisScript = parts[partsLength];
        partsLength--;
      }
    }

    var lowerCasePrefix = thisScript.indexOf('__') == -1 ? '' : thisScript.substring(0, thisScript.indexOf('__') + 2);
    //check for the cached namespace first
    lowerCasePrefix = lowerCasePrefix === '' && localStorage.getItem('nsPrefix') ? localStorage.getItem('nsPrefix'): lowerCasePrefix;
    
    if(lowerCasePrefix !== ''){
        lowerCasePrefix = /__$/.test(lowerCasePrefix) ? lowerCasePrefix : lowerCasePrefix + '__';
    }
    if (lowerCasePrefix.length === 0) {
      return function() {
        //then check if the app has put a namespace and take that one as it is newer
        lowerCasePrefix = window.nsPrefix ? window.nsPrefix: lowerCasePrefix;
        //add the underscore if it doesn't have them    
        if(lowerCasePrefix !== ""){
            lowerCasePrefix = /__$/.test(lowerCasePrefix) ? lowerCasePrefix : lowerCasePrefix + '__';
        }  
        return lowerCasePrefix;
      };
    } else {
      var resolvedNs = null;
      return function() {
        if (resolvedNs) {
          return resolvedNs;
        }
        // hack to make scan SF objects for the correct case
        try {
          var tofind = lowerCasePrefix.replace('__', '');
          var name;
          var scanObjectForNs = function(object, alreadySeen) {
            if (object && object !== window && alreadySeen.indexOf(object) == -1) {
                alreadySeen.push(object);
                Object.keys(object).forEach(function(key) {
                  if (key === 'ns') {
                    // do ns test
                    if (typeof object[key] === 'string' && object[key].toLowerCase() === tofind) {
                      name = object[key] + '__';
                      return false;
                    }
                  }
                  if (Object.prototype.toString.call(object[key]) === '[object Array]') {
                    object[key].forEach(function(value) {
                      var result = scanObjectForNs(value, alreadySeen);
                      if (result) {
                          name = result;
                          return false;
                      }
                    });
                  } else if (typeof object[key] == 'object') {
                    var result = scanObjectForNs(object[key], alreadySeen);
                    if (result) {
                        name = result;
                        return false;
                    }
                  }
                  if (name) {
                    return false;
                  }
                });
                if (name) {
                  return name;
                }
            };
          }
          if(typeof Visualforce !== 'undefined') { //inside VF
            scanObjectForNs(Visualforce.remoting.Manager.providers, []);  
          } else {
            return lowerCasePrefix;
          }
          if (name) {
            return resolvedNs = name;
          } else {
            return resolvedNs = lowerCasePrefix;
          }
        } catch (e) {
          return lowerCasePrefix;
        }
      };
    }
  })();

  var fileNsPrefixDot = function() {
    var prefix = fileNsPrefix();
    if (prefix.length > 1) {
      return prefix.replace('__', '.');
    } else {
      return prefix;
    }
  };(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
var module = angular.module('vloc.ganttView', ['vlocity', 
                                               'gantt',
                                               'gantt.sortable',
                                               'gantt.movable',
                                               'gantt.drawtask',
                                               'gantt.tooltips',
                                               'gantt.bounds',
                                               'gantt.progress',
                                               'gantt.table',
                                               'gantt.tree',
                                               'gantt.groups',
                                               'gantt.resizeSensor'
                                               ])
    .config(['remoteActionsProvider','$compileProvider', function(remoteActionsProvider, $compileProvider) {
        remoteActionsProvider.setRemoteActions(window.remoteActions || {});
        $compileProvider.debugInfoEnabled(true); // Remove debug info (angularJS >= 1.3)
    }]);

module.constant('config', {
                grid_width: 200,
                grid_height: 142,
                header_height: 30,
                item_margin_x: 10,
                item_margin_top_y: 40,
                item_margin_bottom_y: 20,
                item_padding_x: 10,
                item_padding_y: 10,
                grid_padding_left: 90,
                label_font_size: 12,
                max_label_len: 6,
                dep_margin_y: 5
            });

require('./modules/ganttview/controller/GanttViewController.js');
require('./modules/ganttview/factory/commetd.js');
require('./modules/ganttview/directive/svg.js');

},{"./modules/ganttview/controller/GanttViewController.js":2,"./modules/ganttview/directive/svg.js":3,"./modules/ganttview/factory/commetd.js":4}],2:[function(require,module,exports){
var Grid = require ('../layout/layout.js');

//angular.module('vloc.ganttView').controller('GanttViewController', function($scope, config, id, cometd, remoteActions, $interval, taskTypes ) {
angular.module('vloc.ganttView').controller('GanttViewController', ['$scope', 'config', 'id', 'cometd', 'remoteActions', '$interval', 'taskTypes', 'ganttUtils', '$timeout', '$log', 'GanttObjectModel','Sample', 'ganttMouseOffset', 'ganttDebounce', 'moment', function($scope,config, id, cometd,remoteActions, $interval,taskTypes, utils , $timeout, $log,ObjectModel,Sample, mouseOffset , debounce, moment) {

	'use strict';

    $scope.orchestrationPlan = {
        items: [],
        deps: []
    };
    $scope.zoomVar = 100;
    $scope.scaleVal = 1;
   
    // Processes plan from server
    function processPlan (orchestrationPlan) 
    {
        console.log ('Orchestration plan from the server', orchestrationPlan, Date.now());

        var swimlanes = orchestrationPlan.swimlanes,
            items = orchestrationPlan.items;

        var grid = new Grid();

        var swimlanesIdx = {};

        var i;

        for (i = 0; i < swimlanes.length; i++) {
            grid.addSwimlane (swimlanes[i].planDefId,
                            swimlanes[i].planDefName,
                            swimlanes[i].orderId,
                            swimlanes[i].orderName,
                            swimlanes[i].showOrder);
        }

        for (i = 0; i < items.length; i++) {
            var item = grid.addItem(items[i].id, grid.getSwimlane (items[i].planDefId, items[i].orderId), items[i].name, items[i].type, items[i].state);
            /*
            item.additionalId = items[i].additionalId;
            item.additionalName = items[i].additionalName;

            var deps = items[i].deps;

            for (var j = 0; j < deps.length; j++) {
                grid.addDependency (items[i].id, deps[j]);
            }
            */

        }

        //grid.layout ();

        $scope.orchestrationPlan.items = grid.items;
        $scope.orchestrationPlan.swimlanes = grid.swimlanes;
        $scope.orchestrationPlan.calendarInfo = orchestrationPlan.calendarInfo;
        //$scope.orchestrationPlan.deps = grid.dependencies;
    }

    $scope.getOrchestrationPlan = function() {
        console.log (id);

        remoteActions.getOrchestrationPlan (id).then(function(orchestrationPlan) {
            console.log ('Loaded orchestration plan', $scope.orchestrationPlan);
            
            //debugger;
            // FIXME: An attempt to fix race condition
            processPlan(orchestrationPlan);
            
            
            //gantt view 
            
            if(window.ganttView)
			{
            	debugger;
				$scope.headersFormats = { 
						  year  	: 'YYYY',
						  month 	: 'MMM YYYY', 
						  week		: 'ww',
						  day		: 'D', 
						  hour		: 'HH', 
						  minute 	: 'mm',
						  second	: 'ss'//'HH:mm'
				};
				$scope.headers = ['month', 'day'];
				$scope.timeFrames = angular.copy($scope.options.timeFrames);
				$scope.dateFrames = {
										weekend: {
					                         evaluator: function(date) { 
					                             return date.isoWeekday() === 6 || date.isoWeekday() === 7;
					                         },
					                         targets: ['weekend']
					                    }
									};
				
				$scope.data = $scope.formJSON(orchestrationPlan);
				var currentDate = new Date();
			    var nextDate = new Date();
			    var prevDate = new Date();
			    
			    var next = currentDate.getMonth()==11? 0: currentDate.getMonth()+1;
			    nextDate.setMonth(next);
			    
			    
			    var prev = currentDate.getMonth() == 0? 11: (currentDate.getMonth()-1);
			    prevDate.setMonth(prev);
			    $scope.fromDate = prevDate;
			    $scope.toDate = nextDate;
			 } //end if window.ganttView
		});//remote action ends
	}; //getOrchestrationPlan ends
	
	$scope.processHolidays =function(orchestrationPlan){
		var holidays;
		if(orchestrationPlan.calendarInfo)
		{
			holidays = orchestrationPlan.calendarInfo.holidays;
			for(var i=0; i<holidays.length; i++)
			{
				holidays[i].ActivityDate = new Date(holidays[i].ActivityDate);
				holidays[i].ActivityDate = holidays[i].ActivityDate.getFullYear() + '-'+(parseInt(holidays[i].ActivityDate.getMonth())+1)+'-'+holidays[i].ActivityDate.getDate();
				//XOM555 s
				var startTimeInMinutes,endTimeInMinutes, tempHoliday, holidayStart, holidayEnd; 
				if(!holidays[i].IsAllDay)
				{
					tempHoliday 		= holidays[i].ActivityDate;
					startTimeInMinutes  = holidays[i].StartTimeInMinutes;
					endTimeInMinutes  	= holidays[i].EndTimeInMinutes;
					holidayStart = moment(holidays[i].ActivityDate).add(startTimeInMinutes,'minutes');
					holidayEnd   = moment(holidays[i].ActivityDate).add(endTimeInMinutes,'minutes');
					$scope.dateFrames['partialHoliday_'+i] = {
							start		: holidayStart,
							end  		: holidayEnd,
							targets		: ['closed']
					}
				}
				else
				{
					$scope.dateFrames['holiday_'+i] = { 
							date: moment(holidays[i].ActivityDate, 'YYYY-MM-DD'),
							targets: ['holiday']
					};
				}
			}
				//XOM555 e
				console.log('$scope.dateFrames: '+$scope.dateFrames);
				//$scope.options.myDateFrames = $scope.dateFrames;
		}
	};
	
	$scope.formJSON = function(orchestrationPlan)
	{
		$scope.processHolidays(orchestrationPlan);
		//forming the json s
				//DESC: loop on MainTaskObjects - MainTaskObj = {name:'orderNum/FrLine', tasks[] =[Subtasks]} where Subtasks = {name:planDefName, content, from, to, color,progress, movable:false}

				$scope.gvMainTaskArray = [];
				var planDefItemMap = {};//collect all items with given pdef value into single entry with key=pdef
				//Var $scope.gvSubtask represents the box on timeline; This is reused for each pdef encountered
				$scope.gvSubtask = {
					name	:'',
					id		:'',
					from	:'',
					to		:'',
					movable : false,
					color	:'#00a7e1',
					content : '<i class="fa fa-cog" ng-click="scope.handleTaskIconClick(task.model)"></i> {{task.model.name}}',
					progress:100
				};
				$scope.gvTask = {
					name: '', 
					tasks:[],
					id: '',
					content: '<span ng-click="scope.handleTaskIconClick(row.model)">{{row.model.id}}</span>'
				}; //represents the pdef on side-pane or tree view; Contains the gvSubtask in tasks field
				
				for(var i=0; i<orchestrationPlan.items.length; i++)//create planDefItemMap...collect all items with given pdef value into single entry with key=pdef
				{
					var item = orchestrationPlan.items[i];
					item.startDate = Date.parse(item.startDate); //parsing string to Date
					//var tempDate, tempVar;
					//tempDate = new Date(item.dueDate);
					//tempVar = tempDate.getDate()+1; 
					//tempDate.setDate(tempVar);
					item.dueDate = Date.parse(item.dueDate);	 //parsing string to Date
					planDefItemMap[item.planDefId] = planDefItemMap[item.planDefId]!=null? planDefItemMap[item.planDefId]:[];
					planDefItemMap[item.planDefId].push(item);
				}

				//collected all items in swimlane (all items belonging to same plan def) ..Now find the start and due date for each pdef(key) in this map
				for(var i=0; i<orchestrationPlan.swimlanes.length;i++) //creates the rows corresponding to pdefs in gantt chart
				{
					var planDefIdKey = orchestrationPlan.swimlanes[i].planDefId;
					var orchitems = planDefItemMap[planDefIdKey];
					var minStartDate = orchitems[i]!=null? orchitems[i].startDate:null;
					var maxDueDate   = orchitems[i]!=null? orchitems[i].dueDate:null;
					for(var j=1; j<orchitems.length; j++)
					{
						minStartDate = (orchitems[j].startDate<minStartDate)? orchitems[j].startDate:minStartDate;
						maxDueDate   = (orchitems[j].dueDate>maxDueDate)? orchitems[j].dueDate: maxDueDate;
					}
					minStartDate = new Date(minStartDate).valueOf();
					maxDueDate = new Date(maxDueDate).valueOf();

					var gvSubtask = angular.copy($scope.gvSubtask);//represents the box on timeline
					gvSubtask.name = orchestrationPlan.swimlanes[i].planDefName;
					gvSubtask.id   = orchestrationPlan.swimlanes[i].planDefId;
					gvSubtask.from = minStartDate;
					gvSubtask.to = maxDueDate;

					var gvTask  = angular.copy($scope.gvTask); //represents the left side label appearing in tree ; Each gvTask(pdef) is a task which appears on new row. the tasks field of gvTask will have the actual details of pdef(represented as box on timeline)
					gvTask.name = planDefIdKey;
					gvTask.id = orchestrationPlan.swimlanes[i].planDefName;
					gvTask.tasks.push(gvSubtask);
					$scope.gvMainTaskArray.push(gvTask);
				}

				//form the tree with parent as order and pdefs as subtask
				$scope.gvOrder = {
					name:'',
					children:[]
				};
				$scope.orderIdNameMap ={};
				$scope.taskMap = {};  //key=orderId(::taskId) and Value: swimlane array:[swimlane objs belonging to an order]
				for(var i=0; i<orchestrationPlan.swimlanes.length; i++)
				{
					var swimlane = orchestrationPlan.swimlanes[i];
					var swimlaneOrderId = orchestrationPlan.swimlanes[i].orderId;
					$scope.taskMap[swimlaneOrderId] = $scope.taskMap[swimlaneOrderId] != null ? $scope.taskMap[swimlaneOrderId] : [];
					$scope.taskMap[swimlaneOrderId].push(swimlane.planDefId);
					$scope.orderIdNameMap[swimlaneOrderId] = orchestrationPlan.swimlanes[i].orderName;
				}
				var orderIds =  Object.keys($scope.taskMap);
				for(var i=0; i<orderIds.length; i++)
				{
					var orderId       = orderIds[i];
					var orderChildren = $scope.taskMap[orderId];
					var gvOrder       = angular.copy($scope.gvOrder);
					gvOrder.name      = $scope.orderIdNameMap[orderId];
					gvOrder.children  = orderChildren;
					$scope.gvMainTaskArray.push(gvOrder);
				}
				console.log('$scope.gvMainTaskArray: '+$scope.gvMainTaskArray);
				return $scope.gvMainTaskArray;
	//forming the json e
	}
	//formJSON e
	$scope.changeHeaders = function(){
		//debugger;
		$scope.headersFormats.day = 'D';
		$scope.headersFormats.hour ='HH';
		$scope.headersFormats.minute ='mm';
		switch($scope.options.scale){
		case 'year'  : {
							$scope.headers = ['year'];
							break;
					   }
		case 'month' : {
							$scope.headers = ['month'];
							break;
					   }
		case 'week'	 : {
							$scope.headers = ['month', 'week'];
							break;
					   };
		case 'day'   : {
							$scope.headers = ["month","day"];//$scope.headers = ["month","week","day"];
							break;
		 			   };
		case 'hour'  : {
							$scope.headersFormats.day = 'DD MMM YYYY';
							$scope.headers = ["day","hour"];
							break;
			 		   }; 
		case 'second': {
							$scope.headersFormats.minute = 'DD MMM YYYY HH:mm:ss';
							$scope.headers = ["minute","second"];
							break;
					   };
		default: 	   {
							//$scope.headers = ["month","week","day","hour"];
							//$scope.headersFormats.day = 'DD MMM YYYY';
							$scope.headersFormats.hour = 'DD MMM YYYY HH:mm:ss';
							$scope.headers = ["hour","minute"];
							break;
				  		} 
		}//switch
	}
	//ng-way s
	
	var objectModel;
	var dataToRemove;
	$scope.scaleOptions = ['minute', '5 minutes', 'hour', 'day', 'week', 'month', 'year'];
	$scope.workModeOptions = ['cropped', 'hidden', 'visible'];
	$scope.columnMagnetOptions = ['column', '1 minute','15 minutes',  '30 minutes', '1 hour', '3 hours'];
	$scope.options = {
			  mode: 'custom',
			  scale: 'day',
			  sortMode: undefined,
			  sideMode: 'Tree',
			  daily: false,
			  maxHeight: false,
			  width: true, //false //118se scroll issue 556
			  zoom: 1,
			  columns: [
				'model.name',
				'from',
				'to'],
			  treeTableColumns: [
				'from',
				'to'],
			  columnsHeaders: {
				'model.name' : 'Name',
				'from': 'From',
				'to': 'To'
			  },
			  columnsClasses: {
				'model.name' : 'gantt-column-name',
				'from': 'gantt-column-from',
				'to': 'gantt-column-to'
			  },
			  columnsFormatters: {
				'from': function(from) {
				  return from !== undefined ? from.format('lll') : undefined;
				},
				'to': function(to) {
				  return to !== undefined ? to.format('lll') : undefined;
				}
			  },
			  treeHeaderContent: '<i class="fa fa-align-justify"></i> {{getHeader()}}',
			  columnsHeaderContents: {
				'model.name': '<i class="fa fa-align-justify"></i> {{getHeader()}}',
				'from': '<i class="fa fa-calendar"></i> {{getHeader()}}',
				'to': '<i class="fa fa-calendar"></i> {{getHeader()}}'
			  },
			  autoExpand: 'none',
			  taskOutOfRange: 'truncate',
			  fromDate: moment(null),
			  toDate: undefined,
			  rowContent: '<i class="fa fa-align-justify"></i>{{row.model.name}}',
			  taskContent : '<i class="fa fa-tasks"></i> {{task.model.name}}',
			  allowSideResizing: true,
			  labelsEnabled: true,
			  currentDate: 'column',
			  currentDateValue: new Date(),
			  draw: false,
			  readOnly: false,
			  groupDisplayMode: 'group',
			  filterTask: '',
			  filterRow: '',
			  timeFrames: {
					'day': {
								  start: moment('00:00',
												'HH:mm'),
								  end: moment('00:00',
											  'HH:mm'),
								  working: true,
								  default: true
							},
					/*'noon': {
								  start: moment('12:00',
												'HH:mm'),
								  end: moment('13:30',
											  'HH:mm'),
								  working: false,
								  default: true
							},*/
					'weekend':{
									working: false,
									color:'grey'
							  },
					'holiday':{
								  working: false,
								  color: 'red',
								  classes: [
									'gantt-timeframe-holiday']
							  },
				    'closed' :{ ////XOM555 added 'closed' 
				    	 		  magnet: false, 
				    	 		  working: false,
				    	 		  color: 'red',
				    	 		  classes: ['gantt-timeframe-holiday']
                              }
				  },
				  dateFrames: {
									'weekend': {
									  evaluator: function(date) {
										return date.isoWeekday() === 6 || date.isoWeekday() === 7;
									  },
									  targets: [
										'weekend']
									}
				  },
			  timeFramesNonWorkingMode: 'visible',
			  timeFramesWorkingMode:'visible',
			  columnMagnet: '15 minutes',
			  timeFramesMagnet: true,
			  canDraw: function(event) {
				var isLeftMouseButton = event.button === 0 || event.button === 1;
				return $scope.options.draw && !$scope.options.readOnly && isLeftMouseButton;
			  },
			  drawTaskFactory: function() {
				return {
				  id: utils.randomUuid(),
				  // Unique id of the task.
				  name: 'Drawn task',
				  // Name shown on top of each task.
				  color: '#12abe0' // Color of the task in HEX format (Optional).
				};
			  },
			  api: function(api) {
				// API Object is used to control methods and events from angular-gantt.
				$scope.api = api;
				api.core.on.ready($scope,
								  function() {
				  // Log various events to console
				  api.scroll.on.scroll($scope,
									   logScrollEvent);
				  api.core.on.ready($scope,
									logReadyEvent);
				  api.data.on.remove($scope,
									 addEventName('data.on.remove',
												  logDataEvent));
				  api.data.on.load($scope,
								   addEventName('data.on.load',
												logDataEvent));
				  api.data.on.clear($scope,
									addEventName('data.on.clear',
												 logDataEvent));
				  api.tasks.on.add($scope,
								   addEventName('tasks.on.add',
												logTaskEvent));
				  api.tasks.on.change($scope,
									  addEventName('tasks.on.change',
												   logTaskEvent));
				  api.tasks.on.rowChange($scope,
										 addEventName('tasks.on.rowChange',
													  logTaskEvent));
				  api.tasks.on.remove($scope,
									  addEventName('tasks.on.remove',
												   logTaskEvent));
				  if (api.tasks.on.moveBegin) {
					api.tasks.on.moveBegin($scope,
										   addEventName('tasks.on.moveBegin',
														logTaskEvent));
					api.tasks.on.moveEnd($scope,
										 addEventName('tasks.on.moveEnd',
													  logTaskEvent));
					api.tasks.on.resizeBegin($scope,
											 addEventName('tasks.on.resizeBegin',
														  logTaskEvent));
					api.tasks.on.resizeEnd($scope,
										   addEventName('tasks.on.resizeEnd',
														logTaskEvent));
				  }
				  api.rows.on.add($scope,
								  addEventName('rows.on.add',
											   logRowEvent));
				  api.rows.on.change($scope,
									 addEventName('rows.on.change',
												  logRowEvent));
				  api.rows.on.move($scope,
								   addEventName('rows.on.move',
												logRowEvent));
				  api.rows.on.remove($scope,
									 addEventName('rows.on.remove',
												  logRowEvent));
				  api.side.on.resizeBegin($scope,
										  addEventName('labels.on.resizeBegin',
													   logLabelsEvent));
				  api.side.on.resizeEnd($scope,
										addEventName('labels.on.resizeEnd',
													 logLabelsEvent));
				  api.timespans.on.add($scope,
									   addEventName('timespans.on.add',
													logTimespanEvent));
				  api.columns.on.generate($scope,
										  logColumnsGenerateEvent);
				  api.rows.on.filter($scope,
									 logRowsFilterEvent);
				  api.tasks.on.filter($scope,
									  logTasksFilterEvent);
				  api.data.on.change($scope,
									 function(newData) {
					
				  });
				  // When gantt is ready, load data.
				  // `data` attribute could have been used too.
				  $scope.load();
				  // Add some DOM events
				  api.directives.on.new($scope,
										function(directiveName,
												  directiveScope,
												  element) {
					if (directiveName === 'ganttTask') {
					  element.bind('click',
								   function(event) {
						event.stopPropagation();
						logTaskEvent('task-click',
									 directiveScope.task);
					  });
					  element.bind('mousedown touchstart',
								   function(event) {
						event.stopPropagation();
						$scope.live.row = directiveScope.task.row.model;
						if (directiveScope.task.originalModel !== undefined) {
						  $scope.live.task = directiveScope.task.originalModel;
						} else {
						  $scope.live.task = directiveScope.task.model;
						}
						$scope.$digest();
					  });
					} else if (directiveName === 'ganttRow') {
					  element.bind('click',
								   function(event) {
						event.stopPropagation();
						logRowEvent('row-click',
									directiveScope.row);
					  });
					  element.bind('mousedown touchstart',
								   function(event) {
						event.stopPropagation();
						$scope.live.row = directiveScope.row.model;
						$scope.$digest();
					  });
					} else if (directiveName === 'ganttRowLabel') {
					  element.bind('click',
								   function() {
						logRowEvent('row-label-click',
									directiveScope.row);
					  });
					  element.bind('mousedown touchstart',
								   function() {
						$scope.live.row = directiveScope.row.model;
						$scope.$digest();
					  });
					}
				  });
				  api.tasks.on.rowChange($scope,
										 function(task) {
					$scope.live.row = task.row.model;
				  });
				  objectModel = new ObjectModel(api);
				});
			  }
			};
	//options e
	
	
	
	$scope.handleTaskIconClick = function(taskModel) {
		console.log('Icon from ' + taskModel.name + ' task has been clicked.');
	};
	
	$scope.handleRowIconClick = function(rowModel) {
		console.log('Icon from ' + rowModel.name + ' row has been clicked.');
	};
	
	$scope.expandAll = function() {
		$scope.api.tree.expandAll();
	};
	
	$scope.collapseAll = function() {
		$scope.api.tree.collapseAll();
	};
	
	$scope.$watch('options.sideMode', function(newValue, oldValue) {
		if (newValue !== oldValue) {
			$scope.api.side.setWidth(undefined);
			$timeout(function() {
				$scope.api.columns.refresh();
			});
		}
	});
	
	$scope.canAutoWidth = function(scale) {
		debugger;
		if (scale.match(/.*?hour.*?/) || scale.match(/.*?minute.*?/)) {
			return false; 
		}
		return true;
	};
	
	$scope.getColumnWidth = function(widthEnabled, scale, zoom) {
		debugger;
		if (!widthEnabled && $scope.canAutoWidth(scale)) {
			return undefined;
		}
		
		if (scale.match(/.*?day.*?/)) {
			return 40 * zoom;//return 800 * zoom; //118se scroll issue 556
		}
		
		if (scale.match(/.*?week.*?/)) {
			return 150 * zoom;
		}
	
		if (scale.match(/.*?month.*?/)) {
			return 300 * zoom;
		}
	
		if (scale.match(/.*?quarter.*?/)) {
			return 500 * zoom;
		}
	
		if (scale.match(/.*?year.*?/)) {
			return 800 * zoom;
		}
		return 40 * zoom;;
	};
	
	// Reload data action
	$scope.load = function() {
		$scope.data = $scope.gvMainTaskArray;//Sample.getSampleData();
		dataToRemove = undefined;
		$scope.timespans = Sample.getSampleTimespans();
	};
	
	$scope.reload = function() {
		$scope.load();
	};
	
	// Remove data action
	$scope.remove = function() {
		$scope.api.data.remove(dataToRemove);
	};
	
	// Clear data action
	$scope.clear = function() {
		$scope.data = [];
	};
	
	
	// Visual two way binding.
	$scope.live = {};
	
	var debounceValue = 1000;
	
	var listenTaskJson = debounce(function(taskJson) {
		if (taskJson !== undefined) {
			var task = angular.fromJson(taskJson);
			objectModel.cleanTask(task);
			var model = $scope.live.task;
			angular.extend(model, task);
		}
	}, debounceValue);
	$scope.$watch('live.taskJson', listenTaskJson);
	
	var listenRowJson = debounce(function(rowJson) {
		if (rowJson !== undefined) {
			var row = angular.fromJson(rowJson);
			objectModel.cleanRow(row);
			var tasks = row.tasks;
	
			delete row.tasks;
			var rowModel = $scope.live.row;
	
			angular.extend(rowModel, row);
	
			var newTasks = {};
			var i, l;
	
			if (tasks !== undefined) {
				for (i = 0, l = tasks.length; i < l; i++) {
					objectModel.cleanTask(tasks[i]);
				}
	
				for (i = 0, l = tasks.length; i < l; i++) {
					newTasks[tasks[i].id] = tasks[i];
				}
	
				if (rowModel.tasks === undefined) {
					rowModel.tasks = [];
				}
				for (i = rowModel.tasks.length - 1; i >= 0; i--) {
					var existingTask = rowModel.tasks[i];
					var newTask = newTasks[existingTask.id];
					if (newTask === undefined) {
						rowModel.tasks.splice(i, 1);
					} else {
						objectModel.cleanTask(newTask);
						angular.extend(existingTask, newTask);
						delete newTasks[existingTask.id];
					}
				}
			} else {
				delete rowModel.tasks;
			}
	
			angular.forEach(newTasks, function(newTask) {
				rowModel.tasks.push(newTask);
			});
		}
	}, debounceValue);
	$scope.$watch('live.rowJson', listenRowJson);
	
	$scope.$watchCollection('live.task', function(task) {
		$scope.live.taskJson = angular.toJson(task, true);
		$scope.live.rowJson = angular.toJson($scope.live.row, true);
	});
	
	$scope.$watchCollection('live.row', function(row) {
		$scope.live.rowJson = angular.toJson(row, true);
		if (row !== undefined && row.tasks !== undefined && row.tasks.indexOf($scope.live.task) < 0) {
			$scope.live.task = row.tasks[0];
		}
	});
	
	$scope.$watchCollection('live.row.tasks', function() {
		$scope.live.rowJson = angular.toJson($scope.live.row, true);
	});
	
	// Event handler
	var logScrollEvent = function(left, date, direction) {
		if (date !== undefined) {
			$log.info('[Event] api.on.scroll: ' + left + ', ' + (date === undefined ? 'undefined' : date.format()) + ', ' + direction);
		}
	};
	
	// Event handler
	var logDataEvent = function(eventName) {
		$log.info('[Event] ' + eventName);
	};
	
	// Event handler
	var logTaskEvent = function(eventName, task) {
		$log.info('[Event] ' + eventName + ': ' + task.model.name);
	};
	
	// Event handler
	var logRowEvent = function(eventName, row) {
		$log.info('[Event] ' + eventName + ': ' + row.model.name);
	};
	
	// Event handler
	var logTimespanEvent = function(eventName, timespan) {
		$log.info('[Event] ' + eventName + ': ' + timespan.model.name);
	};
	
	// Event handler
	var logLabelsEvent = function(eventName, width) {
		$log.info('[Event] ' + eventName + ': ' + width);
	};
	
	// Event handler
	var logColumnsGenerateEvent = function(columns, headers) {
		$log.info('[Event] ' + 'columns.on.generate' + ': ' + columns.length + ' column(s), ' + headers.length + ' header(s)');
	};
	
	// Event handler
	var logRowsFilterEvent = function(rows, filteredRows) {
		$log.info('[Event] rows.on.filter: ' + filteredRows.length + '/' + rows.length + ' rows displayed.');
	};
	
	// Event handler
	var logTasksFilterEvent = function(tasks, filteredTasks) {
		$log.info('[Event] tasks.on.filter: ' + filteredTasks.length + '/' + tasks.length + ' tasks displayed.');
	};
	
	// Event handler
	var logReadyEvent = function() {
		$log.info('[Event] core.on.ready');
	};
	
	// Event utility function
	var addEventName = function(eventName, func) {
		return function(data) {
			return func(eventName, data);
		};
	};
	
	//the ng-way e
	
	
	
	
	
	
	
	
    $scope.getCanvasWidth = function (swimlanes) {
        if (!swimlanes || swimlanes.length === 0) {
            return 100;
        }

        return (swimlanes[0].grid.max_x + 1) * config.grid_width + 2*config.grid_padding_left;
    };

    $scope.getCanvasHeight = function (swimlanes) {
        var height = 0;

        if (!swimlanes) {
            return 100;
        }

        for (var i = 0; i < swimlanes.length; i++) {
            height += $scope.getSwimlaneHeight(swimlanes[i]);
        }

        return height;
    };
    
    // Fetch the initial plan
    //$scope.getOrchestrationPlan();
}]);
//});

angular.module('vloc.ganttView')
.service('Sample', function Sample() {
    return {
        getSampleData: function() {
            return [
						
                    ];
        },
        getSampleTimespans: function() {
            return [
                   
                ];
        }
        //getsamples
    }; //return
});

    

},{"../layout/layout.js":7}],3:[function(require,module,exports){
// Hack to work around anguler/WebKit bug
angular.module('vloc.ganttView')
    .directive('ngX', function() {
        return function(scope, element, attrs) {
            scope.$watch(attrs.ngX, function(value) {
                element.attr('x', value);
            });
        };
    })
    .directive('ngY', function() {
        return function(scope, element, attrs) {
            scope.$watch(attrs.ngY, function(value) {
                element.attr('y', value);
            });
        };
    })
    .directive('ngX1', function() {
        return function(scope, element, attrs) {
            scope.$watch(attrs.ngX1, function(value) {
                element.attr('x1', value);
            });
        };
    })
    .directive('ngY1', function() {
        return function(scope, element, attrs) {
            scope.$watch(attrs.ngY1, function(value) {
                element.attr('y1', value);
            });
        };
    })
    .directive('ngX2', function() {
        return function(scope, element, attrs) {
            scope.$watch(attrs.ngX2, function(value) {
                element.attr('x2', value);
            });
        };
    })
    .directive('ngY2', function() {
        return function(scope, element, attrs) {
            scope.$watch(attrs.ngY2, function(value) {
                element.attr('y2', value);
            });
        };
    })
    .directive('ngWidth', function() {
        return function(scope, element, attrs) {
            scope.$watch(attrs.ngWidth, function(value) {
                element.attr('width', value);
            });
        };
    })
    .directive('ngHeight', function() {
        return function(scope, element, attrs) {
            scope.$watch(attrs.ngHeight, function(value) {
                element.attr('height', value);
            });
        };
    });

},{}],4:[function(require,module,exports){
// Factory implementation for cometd
// Depends on JQuery and JQuery.Cometd
// sessionId is a constant with current session
angular.module('vloc.ganttView').factory('cometd', function($rootScope, sessionId) {
    var cometd = $.cometd;

    // Configure cometd
    cometd.configure({
        url: window.location.protocol + '//' + window.location.hostname + '/cometd/24.0/',
        requestHeaders: {Authorization: 'OAuth ' + sessionId},
        logLevel: 'info'
    });

    // Add a listener for the handshake *TODO* what should be done if message fails ?
    cometd.addListener('/meta/handshake', function(message) { console.log(message); });

    // Handshake with the server
    cometd.handshake();

    return {
        addListener: function(channel, scope, callback) {
            cometd.addListener(channel, scope, function() {
                var args = arguments;
                $rootScope.$apply(function() {
                    callback.apply(cometd, args);
                });
            });
        },

        removeListener: function(subscription) {
            cometd.removeListener(subscription);
        },

        subscribe: function(channel, scope, callback, subscribeProps) {
            cometd.subscribe(channel, scope, function() {
                var args = arguments;
                console.log ('Cometd:receive', args);
                $rootScope.$apply(function() {
                    callback.apply(cometd, args);
                });
            }, subscribeProps);
        },

        unsubscribe: function(subscription, unsubscribeProps) {
            cometd.unsubscribe(subscription, unsubscribeProps);
        },

        publish: function(channel, content, publishProps, publishCallback) {
            cometd.publish(channel, content, publishProps, function() {
                var args = arguments;
                $rootScope.$apply(function() {
                    publishCallback.apply(cometd, args);
                });
            });
        },

        disconnect: function(sync, disconnectProps) {
            cometd.disconnect(sync, disconnectProps);
        },

        batch: function(scope, callback) {
            cometd.batch(scope, function() {
                var args = arguments;
                $rootScope.$apply(function() {
                    callback.apply(cometd, args);
                });
            });
        }
    };
});

},{}],5:[function(require,module,exports){
var BinaryHeap = function(comp) {

    'use strict';

    // default to max heap if comparator not provided
    comp = comp || function(a, b) {
        return a > b;
    };

    var arr = [];

    var swap = function(a, b) {
        var temp = arr[a];
        arr[a] = arr[b];
        arr[b] = temp;
    };

    var bubbleDown = function(pos) {
        var left = 2 * pos + 1;
        var right = left + 1;
        var largest = pos;

        if (left < arr.length && comp(arr[left], arr[largest])) {
            largest = left;
        }

        if (right < arr.length && comp(arr[right], arr[largest])) {
            largest = right;
        }

        if (largest != pos) {
            swap(largest, pos);
            bubbleDown(largest);
        }
    };

    var bubbleUp = function(pos) {
        if (pos <= 0) {
            return;
        }

        var parent = Math.floor((pos - 1) / 2);

        if (comp(arr[pos], arr[parent])) {
            swap(pos, parent);
            bubbleUp(parent);
        }
    };

    var that = {};

    this.isEmpty = function () {
        return arr.length === 0;
    };

    this.pop = function() {

        if (arr.length === 0) {
            throw new Error('pop() called on emtpy binary heap');
        }

        var value = arr[0];
        var last = arr.length - 1;

        arr[0] = arr[last];
        arr.length = last;

        if (last > 0) {
            bubbleDown(0);
        }

        return value;
    };

    this.push = function(value) {
        arr.push(value);
        bubbleUp(arr.length - 1);
    };

    this.size = function() {
        return arr.length;
    };

};

module.exports = BinaryHeap;

},{}],6:[function(require,module,exports){
// Simple greedy algorithm for swimlanes sorting
// To approach this task we use the following approach:
// 1. We build an unoriented fully connected weighted graph.
// 2. Nodes are swimlanes.
// 3. Edges correspond to links between swimlanes.
// 4. Weights on edges are number of links between the corresponding swimlines. The weight can be zero
// 5. We assume that 0th swimline corresponds to end-to-end and should stay in place
// 6. We want to find a maximum cost path starting from 0th node and passing all nodes, i.e. that's a classic TSP problem
// 7. To simplify the things we will use a greedy algorithm as the fastest one
// 8. We use a matrix to represent the graph

// Graph with n nodes
function Graph (n) {

    'use strict';

    this.n = n;
    this.matrix = new Array(n * n);

    // Put a negative number to the diagonal so we never go to themselves
    for (var i = 0; i < n; i++) {
        for (var j = 0; j < n; j++) {

            if (i == j) {
                this.matrix[i * n + j] = -1;
            } else {
                this.matrix[i * n+ j] = 0;
            }
        }
    }

    this.get = function (i, j) {
        return this.matrix[i * n + j];
    };

    this.set = function (i, j, w) {
        // Matrix is symmetric
        this.matrix[i * n + j] = w;
        this.matrix[i + j * n] = w;
    };

    // Increments value a i, j
    // Should not be used for i==j
    this.incr = function (i, j) {

        if (i == j) {
            return;
        }

        // Matrix is symmetric
        this.matrix[i * n + j]++;
        this.matrix[i + j * n]++;
    };

    this.calculateMaxPath = function () {

        if (this.n == 1) {
            return [0];
        }

        var res = [];

        var visitedElements = {};

        var currentElement = 0;

        var cnt = 0;

        while (true) {

            cnt++;

            res.push(currentElement);
            visitedElements[currentElement] = 1;

            //console.log('Current element', currentElement, visitedElements);

            var maxIdx = -1;
            var max = -1;

            var offset = currentElement * n;

            // Find the max unvisited
            for (var i = 0; i < this.n; i++) {

                if (!visitedElements[i]) {
                    // Only consider unvisited elements

                    var w = this.matrix[offset + i];

                    if (w > max) {
                        max = w;
                        maxIdx = i;
                    }

                }

            }

            if (maxIdx == -1) {
                // Did not find any unvisited
                // Break the cycle
                break;
            }

            currentElement = maxIdx;

        }

        return res;

    };

}

module.exports = Graph;

},{}],7:[function(require,module,exports){
var Graph = require('./graph.js');
var SymmetricMatrix = require('./matrix.js');
var BinaryHeap = require('./bheap.js');

// Utility function not to require the whole lodash
function forEach(m, f) {

    'use strict';

    for (var k in m) {
        if (m.hasOwnProperty(k)) {
            f(k, m[k]);
        }
    }
}

function Item(id, swimlane, name, type, state) {

    'use strict';

    this.id = id;
    this.swimlane = swimlane;
    this.name = name;
    this.x = -1;
    this.y = -1;
    this.dependencies = [];
    this.dependents = [];

    // isProcessed is used in topo sort
    this.isProcessed = false;

    // isLayedOut is used in layouting
    this.isLayedOut = false;
    this.state = state;
    this.type = type;

    // Upper index: lower incoming/outging dependencies - upper incoming/outgoing dependencies
    // Items with lower index will be put upper in the swimline
    this.upperIndex = 0;

    // Index in swimlane items
    this.swimlaneIdx = swimlane.items.length;

    swimlane.items.push(this);
}

function Dependency(id, itemId, dependsOnId) {
    this.itemId = itemId;
    this.dependsOnId = dependsOnId;
    this.item = null;
    this.dependsOn = null;
    this.id = 'd' + id;
    //this.segments = [];
}

function Swimlane(grid, idx, planDefId, planDefName, orderId, orderName) {
    this.grid = grid;
    this.idx = idx;
    this.y = -1;
    this.max_x = -1;
    this.height = 0;
    this.planDefId = planDefId;
    this.planDefName = planDefName;
    this.orderId = orderId;
    this.orderName = orderName;
    this.items = [];
}

function Grid() {

    this.items = [];
    this.itemsIdx = {};
    this.dependencies = [];
    this.swimlanes = [];
    this.swimlanesIdx = {};
    this.max_x = 0;
    this.depsIdx = 0;

    function getSwimlaneId(planDefId, orderId) {
        return planDefId + ':' + orderId;
    }

    this.addSwimlane = function(planDefId, planDefName, orderId, orderName, showOrder) {
        var swimlaneId = getSwimlaneId(planDefId, orderId);
        var swimlane = this.swimlanesIdx[swimlaneId];

        if (!swimlane) {
            swimlane = new Swimlane(this, this.swimlanes.length, planDefId, planDefName, orderId, orderName);
            swimlane.showOrder = showOrder;
            this.swimlanesIdx[swimlaneId] = swimlane;
            this.swimlanes.push(swimlane);
        }

        return swimlane;
    };

    this.getSwimlane = function (planDefId, orderId) {
        var id = getSwimlaneId(planDefId, orderId);
        return this.swimlanesIdx[id];
    };

    this.addItem = function (id, swimlane, name, type, state) {
        var item = this.itemsIdx[id] = new Item(id, swimlane, name, type, state);
        this.items.push(item);
        return item;
    };

    this.getItem = function (id) {
        return this.itemsIdx[id];
    };

    this.addDependency = function (itemId, dependsOnId) {
        this.dependencies.push(new Dependency(this.depsIdx++, itemId, dependsOnId));
    };

    // Lays out items on the grid
    this.layout = function () {

        if (this.swimlanes.length === 0) {
            // Safeguard for empty response
            return;
        }
        
        // Sort swimlines by name
        this.swimlanes.sort(function(a, b) {
            var aName = a.orderName+'_'+a.planDefName;
            var bName = b.orderName+'_'+b.planDefName;
            
            /*
            if (a.showOrder != null) {
                aName = a.showOrder +'_'+aName;
            }
 
            if (b.showOrder != null) {
                bName = b.showOrder+'_'+bName;
            }
            */
            
            if (a.showOrder != null) {
                aName = a.showOrder +'_'+aName;
            }
            else{
            	aName = 'z_' + aName;
            }
 
            if (b.showOrder != null) {
                bName = b.showOrder + '_'+bName;
            }
            else{
            	bName = 'z_' + bName;
            }
            
            if (aName > bName) {
                return 1;
            } else if (aName < bName) {
                return -1;
            } else {
                return 0;
            }
 
        });
        var itemsIdx = this.itemsIdx;
        var graph = new Graph (this.swimlanes.length);

        //// console.log ('Layout items ', itemsIdx);
        //
        // console.log ('Layout 0', Date.now());

        // Resolve dependencies
        this.dependencies.forEach (function(dep) {

            var item = itemsIdx[dep.itemId];
            var dependsOn = itemsIdx[dep.dependsOnId];

            if (!item) {
                throw 'Can\'t resolve an item ' + item;
            }

            if (!dependsOn) {
                throw 'Can\'t resolve an item ' + dependsOn;
            }

            item.dependencies.push(dep);
            dependsOn.dependents.push(dep);

            dep.item = item;
            dep.dependsOn = dependsOn;

        });

        // console.log ('Layout 1', Date.now());

        var workingSet = {};

        // Locate items without any dependencies, they will be an initial working set
        // And will be placed into column 0
        forEach (itemsIdx, function (id, item) {

            if (!item.dependencies.length) {
                workingSet[item.id] = item;
            } else {
                // Iterate through dependencies and calculate swimlanes adjacency matrix

                var deps = item.dependencies;
                var itemSwimlaneIdx = item.swimlane.idx;

                for (var i = 0; i < deps.length; i++) {

                    //// console.log ('Deps', deps[i]);

                    var depSwimlaneIdx = deps[i].dependsOn.swimlane.idx;

                    if (itemSwimlaneIdx != depSwimlaneIdx) {
                        graph.incr(itemSwimlaneIdx, depSwimlaneIdx);
                    }

                }

            }

        });

        // Now iterating till the no more items are in the working set

        var newWorkingSet = {};
        var round = 0;

        // Utility function checking of dependency is satisfied
        function isDepedencySatisfied(dep) {
            return dep.dependsOn.isProcessed;
        }

        // Process item and put all resolved dependencies into the new working set
        function processItem(id, item) {
            //// console.log ('processItem', id, item);
            if (item.isProcessed) {
                // Cycle is detected
                throw new Error('Cycle is detected for item with id=' + item.id);
            }

            item.x = round;

            item.isProcessed = true;

            item.dependents.forEach (function(itemDep) {

                var candidate = itemDep.item;

                if (candidate.dependencies.every(isDepedencySatisfied)) {
                    newWorkingSet[candidate.id] = candidate;
                }

            });

        }

        // Cycle invariant:
        // - All items in the working set is unprocessed (otherwise, there is a cycle)
        // - All items in the working set have all of the dependencies processed
        while (Object.keys(workingSet).length > 0) {

            forEach (workingSet, processItem);

            workingSet = newWorkingSet;
            newWorkingSet = {};
            round++;

        }

        // Now lets calculate swimlanes ordering
        //var swimlanesOrder = graph.calculateMaxPath();

        var y = 0;

        var upperSwimlanes = {};

        // And calculate Y based on swimlanes ordering
        for (var i = 0; i < this.swimlanes.length; i++) {

            var swimlane = this.swimlanes[i];

            swimlane.y = y;

            var swimlaneItems = swimlane.items;

            var runMatrix = new SymmetricMatrix(swimlaneItems.length);

            var orderedItems = new BinaryHeap (function(item1, item2) {

                return (item1.x < item2.x) ||
                        ((item1.x == item2.x) && (item1.upperIndex < item2.upperIndex));

            });

            for (var j = 0; j < swimlaneItems.length; j++) {

                var swimlaneItem = swimlaneItems[j];

                if (swimlaneItem.x > swimlane.max_x) {
                    swimlane.max_x = swimlaneItem.x;
                }

                if (swimlane.max_x > this.max_x) {
                    this.max_x = swimlane.max_x;
                }

                var k;

                // Calculate runs between items and incoing/outgoing links from the top
                for (k = 0; k < swimlaneItem.dependents.length; k++) {

                    if (swimlaneItem.swimlane.idx == swimlaneItem.dependents[k].item.swimlane.idx) {
                        // The same swimlane
                        runMatrix.set(j, swimlaneItem.dependents[k].item.swimlaneIdx, swimlaneItem.dependents[k].item.x - swimlaneItem.x);
                    } else if (upperSwimlanes[swimlaneItem.dependents[k].item.swimlane.idx]) {
                        swimlaneItem.upperIndex--;
                    } else {
                        swimlaneItem.upperIndex++;
                    }

                }

                // Calculate incoing/outgoing links from the top
                for (k = 0; k < swimlaneItem.dependencies.length; k++) {

                    if (upperSwimlanes[swimlaneItem.dependencies[k].dependsOn.swimlane.idx]) {
                        swimlaneItem.upperIndex--;
                    } else {
                        swimlaneItem.upperIndex++;
                    }

                }

                orderedItems.push(swimlaneItem);
            }

            var yBefore = y;

            // Now swimlines are sorted in x,upperIndex order
            while (!orderedItems.isEmpty()) {

                var item = orderedItems.pop();

                if (item.isLayedOut) {
                    continue;
                }

                item.y = y;
                item.isLayedOut = true;

                //// console.log ('Layout: Item', item);

                var currentItemIdx = item.swimlaneIdx;

                while (true) {

                    var max = -1;
                    var longestRunItemIdx = -1;

                    for (var jj = 0; jj < swimlaneItems.length; jj++) {

                        if (!swimlaneItems[jj].isLayedOut) {

                            var run = runMatrix.get(currentItemIdx, jj);

                            // There is a dependency
                            if (run > 0) {

                                if (run > max) {
                                    max = run;
                                    longestRunItemIdx = jj;
                                }

                            }

                        }

                    }

                    if (longestRunItemIdx < 0) {
                        // Did not find any runs, laying out the next line
                        break;
                    }

                    swimlaneItems[longestRunItemIdx].y = y;
                    swimlaneItems[longestRunItemIdx].isLayedOut = true;

                    currentItemIdx = longestRunItemIdx;

                }

                y++;

            }

            swimlane.height = y - yBefore;

            upperSwimlanes[i] = 1;

        }

    };

}

module.exports = Grid;

},{"./bheap.js":5,"./graph.js":6,"./matrix.js":8}],8:[function(require,module,exports){
function SymmetricMatrix (n) {

    'use strict';

    this.n = n;

    var n2 = n * n;

    var matrix = this.matrix = new Array(n2);

    for (var i = 0; i < n2; i++) {
        matrix[i] = 0;
    }

    this.set = function(i, j, w) {
        this.matrix[i * this.n + j] = w;
    };

    this.get = function(i, j) {
        return this.matrix[i * this.n + j];
    };

    this.findMax = function(i) {

        var offset = i * n;
        var maxJ = -1;
        var max = -1;

        for (var j = 0; j < this.n; j++) {

            if (this.matrix[offset + j] > max) {
                max = this.matrix[offset + j];
                maxJ = j;
            }

        }

        return maxJ;

    };

}

module.exports = SymmetricMatrix;

},{}]},{},[1]);
})();
