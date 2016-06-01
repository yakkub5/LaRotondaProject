var fact = angular.module("factory", []);

fact.factory("factoryDb", function($firebaseArray){
  var ref = new Firebase("https://larotonda.firebaseio.com/");
  var appointments = $firebaseArray(ref.child("events/"));


  return {
      list: function(){
        return appointments;
      },
      //appointment is a empty array in controller line 38
      confirm: function(appointment){
      }
  };
})