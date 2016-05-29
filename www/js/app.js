// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('starter', [
  'ionic',
   'ngRoute',
    'firebase',
    'ui.router',
    'control',
     'factory',
      'ui.calendar']);

app.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});

/*
app.config(function($routeProvider){
  $routeProvider
  .when("/", {
    templateUrl:"templates/main.html",
    controller:"listButtons"
  })
  .when("/user/select-appointment",{
    templateUrl:"templates/appointment.html",
    controller:"selectAppointment"
  })
  .when("/user/select-calendar", {
    templateUrl:"templates/calendar.html",
    controller:"selectCalendar"
  })
  .when("/user/services", {
    templateUrl:"templates/services.html",
    controller:"selectServices"
  })
  .when("/user/select-about", {
    templateUrl:"templates/about.html",
    controller:"selectAbout"
  })
  .otherwise({
    redirectTo:"/"
  });

})
*/
//angular.module('ui.calendar', [])

app.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('login', {
            url: '/login',
            templateUrl: 'templates/login.html'
            // controller: 'LoginController'
        })
        .state('appointment', {
            url: '/appointment',
            templateUrl: 'templates/appointment.html',
             controller: 'selectAppointment'
        })/*
        .state('calendar', {
          url: '/calendar',
          templateUrl: 'templates/calendar.html'
        })
        */
        .state('about', {
            url: '/about',
            templateUrl: 'templates/about.html'
            // controller: 'AboutController'
        })
        .state('main', {
            url: '/main',
            templateUrl: 'templates/main.html'
            // controller: 'MainController'
        })
        .state('services', {
            url: "/services",
            templateUrl: "templates/services.html"
            // controller: "UserController"
        })
        .state('home', {
    url: '/home',
    "abstract": true,
    templateUrl: 'templates/scrHome-content.html'
   })
   .state('calendar', {
    url: '/calendar',
  //  views: {
    // 'menuContent': {
      templateUrl: 'templates/scrCalendar.html',
      controller: 'CalendarController'
     //}
    //}
   });

    $urlRouterProvider.otherwise('/main');
});
