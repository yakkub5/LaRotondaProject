var control = angular.module("control", []);
var setDate = {};
var list = {};
var successData = {};

control.controller('AppointmentController', ['$scope', '$filter', '$firebaseArray',
 function($scope, $filter, $firebaseArray, factoryDb, $window) {
  $scope.eventSource = [];
  $scope.onSelect = function(start, end) {

    console.log("Event select fired");

    var startDate = $filter('date')(new Date(start - 1000 * 60 * 60 * 2), 'yyyy-MM-dd HH:mm');
    var endDate = $filter('date')(new Date(end - 1000 * 60 * 60 * 2), 'yyyy-MM-dd HH:mm');

    $scope.disableButton = false;
    console.log(startDate + endDate);
    setDate = {
      start: startDate,
      end: endDate
    };
  };

  $scope.media = null;

  $scope.playSound = function (sound) {

    if ($scope.media) {
      $scope.media.pause();
    };

    if(window.cordova){
      console.log("kviiik");
      ionic.Platform.ready(function (){

        var src = sound.file;
        if(ionic.Platform.is('andriod')) {
          src = '/mp3/sound.mp3';
        }
        $scope.media = new window.Media(src);
        $scope.media.play();
      });
    } else {
      $scope.media = new Audio();
      $scope.media.src = '/mp3/sound.mp3';
      $scope.media.load();
      $scope.media.play();
    };
  };

  list = $firebaseArray(ref.child("events/"));

  $scope.disableButton = true;

  this.event = {};

  $scope.success = [{
      email: "newValue.email",
      text: "newValue.text",
      allDay: "false",
      color: "#F44335.9",
      end: "this.endDate",
      start: "this.startDate",
      title: "newValue.name"
    }];

  this.startDate = setDate.start;
  this.endDate = setDate.end;

  this.addEvent = function(newValue){
    console.log(newValue);
    ref.child("events").push({
      email: newValue.email,
      text: newValue.text,
      allDay: false,
      color: "#F44336",
      end: this.endDate,
      start: this.startDate,
      title: newValue.name
    });
    this.startDate = {};
    this.endDate = {};
    $scope.playSound();
    console.log($scope.success);
    this.event = {};
  };

  $scope.successData = $scope.success[0];

  $scope.eventClick = function(event, allDay, jsEvent, view, $firebaseArray) {
   // alert("Event clicked");
  };


  $scope.uiConfig = {
   defaultView: 'agendaDay',
   disableDragging: true,
   allDaySlot: false,
   selectable: true,
   unselectAuto: true,
   selectHelper: true,
   editable: false,
   maxTime: "20:30:00",
   minTime: "10:00:00",
   eventDurationEditable: false, // disabling will show resize
   columnFormat: {
    week: 'dd-MM-yyyy',
    day: 'D-MMM-YYYY'
   },
   height: 380,// 380 - iPhone5, others 450
   maxTime: "20:30:00",
   minTime: "10:00:00",
   eventDurationEditable: false, // disabling will show resize
   columnFormat: {
    week: 'dd-MM-yyyy',
    day: 'D-MMM-YYYY'
   },
   titleFormat: {
    day: 'dd-MM-yyyy'
   },
   axisFormat: 'H:mm',
   weekends: false,//WEEKENDS OFF
   header: {
    left: 'prev',
    center: '',
    right: 'next'
   },
   select: $scope.onSelect,//onSelect
   eventClick: $scope.eventClick,
   events: list
  };
 }
]);
angular.module('ui.calendar', [])
.constant('uiCalendarConfig', {})
.controller('uiCalendarCtrl', ['$scope', '$timeout', function($scope, $timeout){

    var sourceSerialId = 1,
        eventSerialId = 1,
        sources = $scope.eventSources,
        extraEventSignature = $scope.calendarWatchEvent ? $scope.calendarWatchEvent : angular.noop,

        wrapFunctionWithScopeApply = function(functionToWrap){
            var wrapper;

            if (functionToWrap){
                wrapper = function(){
                    // This happens outside of angular context so we need to wrap it in a timeout which has an implied apply.
                    // In this way the function will be safely executed on the next digest.

                    var args = arguments;
                    $timeout(function(){
                        functionToWrap.apply(this, args);
                    });
                };
            }

            return wrapper;
        };

    this.eventsFingerprint = function(e) {
      if (!e.__uiCalId) {
        e.__uiCalId = eventSerialId++;
        }
      // This extracts all the information we need from the event. http://jsperf.com/angular-calendar-events-fingerprint/3
      return "" + e.__uiCalId + (e.id || '') + (e.title || '') + (e.url || '') + (+e.start || '') + (+e.end || '') +
        (e.allDay || '') + (e.className || '') + extraEventSignature(e) || '';
    };

    this.sourcesFingerprint = function(source) {
        return source.__id || (source.__id = sourceSerialId++);
    };

    this.allEvents = function() {

      // return sources.flatten(); but we don't have flatten
      var arraySources = [];
      for (var i = 0, srcLen = sources.length; i < srcLen; i++) {
console.log("hla");
        var source = sources[i];

          if (angular.isArray(source)) {
          // event source as array
          arraySources.push(source);
        } else if(angular.isObject(source) && angular.isArray(source.events)){
          // event source as object, ie extended form
          var extEvent = {};
          for(var key in source){
            if(key !== '_uiCalId' && key !== 'events'){
               extEvent[key] = source[key];
            }
          }
          for(var eI = 0;eI < source.events.length;eI++){
            angular.extend(source.events[eI],extEvent);

          }
          arraySources.push(source.events);
        }
      }

      return Array.prototype.concat.apply([], arraySources);
    };

    // Track changes in array by assigning id tokens to each element and watching the scope for changes in those tokens
    // arguments:
    //  arraySource array of function that returns array of objects to watch
    //  tokenFn function(object) that returns the token for a given object
    this.changeWatcher = function(arraySource, tokenFn) {
      var self;
      var getTokens = function() {
        var array = angular.isFunction(arraySource) ? arraySource() : arraySource;
        var result = [], token, el;
        for (var i = 0, n = array.length; i < n; i++) {
          el = array[i];
          token = tokenFn(el);
          map[token] = el;
          result.push(token);
        }
        return result;
      };
      // returns elements in that are in a but not in b
      // subtractAsSets([4, 5, 6], [4, 5, 7]) => [6]
      var subtractAsSets = function(a, b) {
        var result = [], inB = {}, i, n;
        for (i = 0, n = b.length; i < n; i++) {
          inB[b[i]] = true;
        }
        for (i = 0, n = a.length; i < n; i++) {
          if (!inB[a[i]]) {
            result.push(a[i]);
          }
        }
        return result;
      };

      // Map objects to tokens and vice-versa
      var map = {};

      var applyChanges = function(newTokens, oldTokens) {
        var i, n, el, token;
        var replacedTokens = {};
        var removedTokens = subtractAsSets(oldTokens, newTokens);
        for (i = 0, n = removedTokens.length; i < n; i++) {
          var removedToken = removedTokens[i];
          el = map[removedToken];
          delete map[removedToken];
          var newToken = tokenFn(el);
          // if the element wasn't removed but simply got a new token, its old token will be different from the current one
          if (newToken === removedToken) {
            self.onRemoved(el);
          } else {
            replacedTokens[newToken] = removedToken;
            self.onChanged(el);
          }
        }

        var addedTokens = subtractAsSets(newTokens, oldTokens);
        for (i = 0, n = addedTokens.length; i < n; i++) {
          token = addedTokens[i];
          el = map[token];
          if (!replacedTokens[token]) {
            self.onAdded(el);
          }
        }
      };
      return self = {
        subscribe: function(scope, onChanged) {
          scope.$watch(getTokens, function(newTokens, oldTokens) {
            if (!onChanged || onChanged(newTokens, oldTokens) !== false) {
              applyChanges(newTokens, oldTokens);
            }
          }, true);
        },
        onAdded: angular.noop,
        onChanged: angular.noop,
        onRemoved: angular.noop
      };
    };

    this.getFullCalendarConfig = function(calendarSettings, uiCalendarConfig){
        var config = {};

        angular.extend(config, uiCalendarConfig);
        angular.extend(config, calendarSettings);

        angular.forEach(config, function(value,key){
          if (typeof value === 'function'){
            config[key] = wrapFunctionWithScopeApply(config[key]);
          }
        });

        return config;
    };
}])
.directive('uiCalendar', ['uiCalendarConfig', '$locale', function(uiCalendarConfig, $locale) {
  // Configure to use locale names by default
  var tValues = function(data) {
    // convert {0: "Jan", 1: "Feb", ...} to ["Jan", "Feb", ...]
    var r, k;
    r = [];
    for (k in data) {
      r[k] = data[k];
//console.log(r[k] == "Sunday");
    }
    return r;
  };
  var dtf = $locale.DATETIME_FORMATS;
  uiCalendarConfig = angular.extend({
    monthNames: tValues(dtf.MONTH),
    monthNamesShort: tValues(dtf.SHORTMONTH),
    dayNames: tValues(dtf.DAY),
    dayNamesShort: tValues(dtf.SHORTDAY)
  }, uiCalendarConfig || {});
//console.log(uiCalendarConfig);
  return {
    restrict: 'A',
    scope: {eventSources:'=ngModel',calendarWatchEvent: '&'},
    controller: 'uiCalendarCtrl',
    link: function(scope, elm, attrs, controller) {

      var sources = scope.eventSources,
          sourcesChanged = false,
          eventSourcesWatcher = controller.changeWatcher(sources, controller.sourcesFingerprint),
          eventsWatcher = controller.changeWatcher(controller.allEvents, controller.eventsFingerprint),
          options = null;

      function getOptions(){
        var calendarSettings = attrs.uiCalendar ? scope.$parent.$eval(attrs.uiCalendar) : {},
            fullCalendarConfig;

        fullCalendarConfig = controller.getFullCalendarConfig(calendarSettings, uiCalendarConfig);
//console.log(fullCalendarConfig);
/*
var p;
for(var i in fullCalendarConfig){
//p = fullCalendarConfig[i];
  console.log("p "+fullCalendarConfig[i]);
}
*/
        options = { eventSources: sources };
        angular.extend(options, fullCalendarConfig);

        var options2 = {};
        for(var o in options){
          if(o !== 'eventSources'){
            options2[o] = options[o];
            //console.log(options2[o]);
          }
        }
        return JSON.stringify(options2);
      }

      scope.destroy = function(){
        if(attrs.calendar) {
          scope.calendar = scope.$parent[attrs.calendar] =  elm.html('');
        } else {
          scope.calendar = elm.html('');
        }
      };

      scope.init = function(){
        scope.calendar.fullCalendar(options);
      };

      eventSourcesWatcher.onAdded = function(source) {
        scope.calendar.fullCalendar('addEventSource', source);
        sourcesChanged = true;
      };

      eventSourcesWatcher.onRemoved = function(source) {
        scope.calendar.fullCalendar('removeEventSource', source);
        sourcesChanged = true;
      };

      eventsWatcher.onAdded = function(event) {
        scope.calendar.fullCalendar('renderEvent', event);
        console.log("onAdded");
      };

      eventsWatcher.onRemoved = function(event) {
        scope.calendar.fullCalendar('removeEvents', function(e) { return e === event; });
      };

      eventsWatcher.onChanged = function(event) {
        scope.calendar.fullCalendar('updateEvent', event);
        console.log("upadate");
      };

      eventSourcesWatcher.subscribe(scope);
      eventsWatcher.subscribe(scope, function(newTokens, oldTokens) {
        if (sourcesChanged === true) {
          sourcesChanged = false;
          // prevent incremental updates in this case
          return false;
        }
      });

      scope.$watch(getOptions, function(newO,oldO){
          scope.destroy();
          scope.init();
      });
    }
  };
}])
.directive('disableTap', function($timeout) {
 return {
   link: function() {

     $timeout(function() {
       var tab = document.getElementsByClassName('fc-widget-content');

       for (i = 0; i < tab.length; ++i) {
  tab[i].setAttribute('data-tap-disabled', 'true')
   console.log(tab[i]);
}
        },500);
   }
 };

});


control.controller("selectAppointment", function($scope, factoryDb, $firebaseArray) {
  console.log("Appointments");
  $scope.title = "Appointments";
  $scope.appointments = factoryDb.list();
  $scope.deleteTask = function(item){
    $scope.appointments.splice(item,1);
      console.log("hola" +item);
  };
  console.log($scope.appointments);
  $scope.eventSource = [];
  $scope.onSelect = function(start, end) {
  };

  list = $firebaseArray(ref.child("events/"));


  $scope.eventClick = function(event, allDay, jsEvent, view, $firebaseArray) {
   // alert("Event clicked");
  };
  $scope.uiConfig = {
   defaultView: 'month',
   disableDragging: true,
   allDaySlot: false,
   selectable: false,
   unselectAuto: true,
   selectHelper: true,
   editable: false,
   maxTime: "18:00:00",
   minTime: "09:00:00",
   eventDurationEditable: false, // disabling will show resize
   columnFormat: {
    week: 'dd-MM-yyyy',
    day: 'D-MMM-YYYY'
   },
   height: 250,
   maxTime: "18:00:00",
   minTime: "09:00:00",
   eventDurationEditable: false, // disabling will show resize
   columnFormat: {
    week: 'dd-MM-yyyy',
    day: 'D-MMM-YYYY'
   },
   titleFormat: {
    day: 'dd-MM-yyyy'
   },
   axisFormat: 'H:mm',
   weekends: false,
   header: {
    left: 'prev',
    center: '',
    right: 'next'
   },
   select: $scope.onSelect,
   eventClick: $scope.eventClick,
   events: list
  };
});

