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

        /*
        appointments.$add({
          name:appointment,
          email:appointment,
          date: appointment
        });
        */
        /*
        appointments.$add({
          name:$scope.appointment.name,
          email:$scope.appointment.email,
          date:$scope.appointment.date
        });
        */
      }
  };
});
