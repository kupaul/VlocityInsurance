/**
 * PromiseQueueFactory to run promises in sequential form
 * @dependency on $q
 * @return all the functions necessary to mantain the queue
 * TODO: add priority and function caching
 */
angular.module("vlocity")
.factory('PromiseQueueFactory', function($q, $log) {
    $log = $log.getInstance('CardFramework: PromiseQueueFactory');
    var ttl = 5000;
    var tasks = [];
    var count = 0;
    var isPromiseLike = function (obj) { return obj && angular.isFunction(obj.then); };
    var alreadyExecuting = false;

    function getNextTask() {
        var currentTask = tasks.shift();//pop the first one from the array
        return currentTask;
    }

    function cacheTask(cachePromise, promiseKey) {
        $log.debug('caching '+promiseKey+' - ',cachePromise);
        promiseKey = promiseKey || Date.now(); //for caching in a later version
        return promiseCache({
            key: promiseKey,
            promise: cachePromise,
            ttl: ttl,
            expireOnFailure: function(request) {
              return request.status !== 200;
            }
        });
    }

    function executeTask() {
        $log.debug('calling execute task');
        if(alreadyExecuting){ return; }
        var prevPromise;
        var error = new Error();
        var task = getNextTask();
        if(task) {
            alreadyExecuting = true;
            var key = task.key;
            var success = task.task.success || task.task;
            var fail = task.task.fail;
            var notify = task.task.notify;
            var nextPromise;

            try {
                task.task().then(function(data){
                    //$log.debug(data);
                    $log.debug('task key '+key+' completed');
                    task.done = true;
                    alreadyExecuting = false;
                    executeTask();
                    return data;
                }, function(error){
                    $log.debug('task key '+key+' error ',error);
                    task.done = true;
                    task.error = true;
                    alreadyExecuting = false;
                    executeTask();
                });
            } catch (e) {
                $log.error('error executing task ',task, e);
                task.done = true;
                task.error = true;
                alreadyExecuting = false;
                executeTask();
            }

        }else {
            alreadyExecuting = false;
        }
    }

    function wrapPromiseFunction(p, args) {
        return function() {
          var deferred = $q.defer();
          args = Array.isArray(args)? args: [args];
           p.apply(null, args).then(
             function(data){
               deferred.resolve('resolved wrapped function');
             },
             function(){
               deferred.reject('bad wrapped function');
             }
           );
           return deferred.promise;
        };
    }

    function compareTasks(task1,task2) {
        if (task1.priority < task2.priority) {
            return -1;
        }
        if (task1.priority > task2.priority) {
            return 1;
        }
        return 0;
    }

    return {
        cacheFunction: function(cachePromise, promiseKey) {
            return cacheTask(cachePromise, promiseKey);
        },
        executeTasks: function(){
            count = 0;
            executeTask();
        },
        getTasks: function(){
            return tasks;
        },
        addTask: function(p, args, options){

            //if no key present then timestamp it
            var task = {
                'task': wrapPromiseFunction(p, args)
            };
            if(options) {
                task.key = options.key || Date.now();
                task.priority = options.priority || 1; //default priority
                task.unique = options.unique || false;
            } else {
                task.key = Date.now();
                task.priority = 1; //default priority
                task.unique = false;
            }
            if(task.unique){
                var index = tasks.map(function(t) { return t.key; }).indexOf(task.key);
                if(index > -1){ //remove old function that shares the same key
                    tasks.splice(index, 1);
                }
            }
            tasks.push(task);
            tasks.sort(compareTasks);
            $log.debug('added task ',task);
        },
        nextTask: function(){
            return tasks[0];
        },
        clearTasks: function(){
            tasks = [];
        },
        wrapFunction: function(p, args) {
          return wrapPromiseFunction(p, args);
        }
    };
})