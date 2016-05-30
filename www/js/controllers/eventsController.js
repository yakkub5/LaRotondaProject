

app.controller('eventsController', function($scope, $firebaseArray){

	var list = $firebaseArray(ref.child("events/"));

    $scope.list = list;

	console.log(list);
	
	this.event = {};

	this.addEvent = function(newValue){
	  console.log(newValue);
	  this.event = {};
	  ref.child("events").push({
	    name: newValue.name,
		date: newValue.name2,
		lol: newValue.email
	  });
	};
});