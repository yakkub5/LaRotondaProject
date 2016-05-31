var fact = angular.module("factory", []);

fact.factory("factoryDb", function($firebaseArray){
  var ref = new Firebase("https://goingtotry.firebaseio.com/users");
  var appointments = $firebaseArray(ref);


  return {
      list: function(){
        return appointments;
      },
      //appointment is a empty array in controller line 38
      confirm: function(appointment){

      }
  };
})
