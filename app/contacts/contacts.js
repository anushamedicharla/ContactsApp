'use strict';

angular.module('myContactsApp.contacts', ['ngRoute','firebase'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/contacts', {
    templateUrl: 'contacts/contacts.html',
    controller: 'contactsCtrl'
  });
}])

.controller('contactsCtrl', ['$scope','$firebaseArray', function($scope,$firebaseArray) {
	//Initialize database
	var rootRef = firebase.database().ref();
	var contactRef = rootRef.child('contacts');

	//retrieve contacts
	$scope.contacts = $firebaseArray(contactRef);

	$scope.showAddForm = function(){
		$scope.addFormShow = true;
	}

	$scope.showEditForm = function(contact){
		$scope.editFormShow = true;

		$scope.id 				= contact.$id;
		$scope.name 			= contact.name;
		$scope.email 			= contact.email;
		$scope.company 			= contact.company;
		$scope.mobile_phone 	= contact.phones[0].mobile;
		$scope.home_phone 		= contact.phones[0].home;
		$scope.work_phone 		= contact.phones[0].work;
		$scope.street_address 	= contact.address[0].street_address;
		$scope.city 			= contact.address[0].city;
		$scope.state 			= contact.address[0].state;
		$scope.zipcode 			= contact.address[0].zipcode;
	}

	//Hide Forms
	$scope.hide = function(){
		$scope.addFormShow 	= false;
		$scope.contactShow 	= false;
		$scope.editFormShow = false;
	}

	//Submit contact form
	$scope.addFormSubmit = function(){
		console.log("Adding contact...");
		//Assign values
			if($scope.name){ var name = $scope.name; } else { var name = null; }
			if($scope.email){ var email = $scope.email; } else { var email = null; }
			if($scope.company){ var company = $scope.company; } else { var company = null; }
			if($scope.mobile_phone){ var mobile_phone = $scope.mobile_phone; } else { var mobile_phone = null; }
			if($scope.home_phone){ var home_phone = $scope.home_phone; } else { var home_phone = null; }
			if($scope.work_phone){ var work_phone = $scope.work_phone; } else { var work_phone = null; }
			if($scope.street_address){ var street_address = $scope.street_address; } else { var street_address = null; }
			if($scope.city){ var city = $scope.city; } else { var city = null; }
			if($scope.state){ var state = $scope.state; } else { var state = null; }
			if($scope.zipcode){ var zipcode = $scope.zipcode; } else { var zipcode = null; }

		//Build Object
		$scope.contacts.$add({
			name: name,
			email: email,
			company: company,
			phones: [
				{
					mobile: mobile_phone,
					home: home_phone, 
					work: work_phone
				}
			],
			address: [
				{
					street_address: street_address,
					city: city,
					state: state,
					zipcode: zipcode
				}
			],

		}).then(function(contactRef){
			var id = contactRef.key;
			console.log("Added contact with id: " + id);

			//Clear Form
			clearFields();


			//Hide Form
			$scope.addFormShow = false;

			//Send Message
			$scope.msg = "Contact Added";
		});
	}

	//Edit a contact form 
	$scope.editFormSubmit = function(){
		console.log('Updating Contact...');

		//Get contact ID
		var id = $scope.id;

		//Get Record
		var record = $scope.contacts.$getRecord(id);

		//Assign Values
		record.name						 	= $scope.name;  						
		record.email						= $scope.email;
		record.company						= $scope.company;
		record.phones[0].mobile				= $scope.mobile_phone;
		record.phones[0].home				= $scope.home_phone;
		record.phones[0].work				= $scope.work_phone;
		record.address[0].street_address	= $scope.street_address;
		record.address[0].city				= $scope.city;
		record.address[0].state				= $scope.state;
		record.address[0].zipcode			= $scope.zipcode;

		//Save contact details
		$scope.contacts.$save(record).then(function(contactRef){
			console.log('Saved to id: ' + contactRef.key);
		});

		//Clear Fields
		clearFields();

		//Hide edit form
		$scope.editFormShow = false;

		//Message
		$scope.msg = "Contact Updated";

	}

	//Showing a contact details
	$scope.showContact = function(contact){
		console.log("Getting contact informarion...");

		$scope.name 			= contact.name;
		$scope.email 			= contact.email;
		$scope.company 			= contact.company;
		$scope.mobile_phone 	= contact.phones[0].mobile;
		$scope.home_phone 		= contact.phones[0].home;
		$scope.work_phone 		= contact.phones[0].work;
		$scope.street_address 	= contact.address[0].street_address;
		$scope.city 			= contact.address[0].city;
		$scope.state 			= contact.address[0].state;
		$scope.zipcode 			= contact.address[0].zipcode;

		$scope.contactShow = true;
	}

	//Deleting a contact
	$scope.removeContact = function(contact){
		console.log("Removing contact...");

		$scope.contacts.$remove(contact);

		$scope.msg = "Contact Deleted";
	}

	//Clearing Fields
	function clearFields(){
		console.log("Clearing all fields...");

		$scope.name = '';
		$scope.email = '';
		$scope.company = '';
		$scope.mobile_phone = '';
		$scope.home_phone = '';
		$scope.work_phone = '';
		$scope.street_address = '';
		$scope.city = '';
		$scope.state = '';
		$scope.zipcode = '';
	}

}]);