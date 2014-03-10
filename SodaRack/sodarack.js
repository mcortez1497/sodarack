var app = angular.module('sodaRack', []);


app.controller("SodaRackController", function($scope) {
	$scope.stations =[];
	$scope.stationAssociations = {};

	$scope.addStation = function() {
		if (isValidStation($scope.station)) {
			$scope.stations.push($scope.station);
			$scope.stationAssociations[this.station] = []; 
			$scope.station = "";
		}
	}
	$scope.removeStation = function() {
		var stationName = this.station;

		delete $scope.stationAssociations[stationName];
		$scope.stations.splice($scope.stations.indexOf(stationName), 1);

		angular.forEach($scope.flavorAssociations, function(association) { 
			if (association.indexOf(stationName) > -1) {
				association.splice(association.indexOf(stationName), 1);
			}
		})
	}


	$scope.flavors =[];
	$scope.flavorAssociations = {};

	$scope.addFlavor = function() {
		if (isValidFlavor($scope.flavor)) {
			$scope.flavors.push($scope.flavor);
			$scope.flavorAssociations[this.flavor]	= [];
			$scope.flavor = "";
		}
	}
	$scope.removeFlavor = function() {
		var flavorName = this.flavor;

		$scope.flavors.splice($scope.flavors.indexOf(flavorName), 1);
		delete $scope.flavorAssociations[flavorName];

		angular.forEach($scope.stationAssociations, function(association) { 
			if (association.indexOf(flavorName) > -1) {
				association.splice(association.indexOf(flavorName), 1);
			}
		})
	}


	$scope.stationCreateMessage = "";
	$scope.flavorCreateMessage = "";

	function isValidStation(station) {
		if (station.length > 20) {
			$scope.stationCreateMessage = "Max size is 20 characters";
			return false;
		} else 
		if ($scope.stations.indexOf(station) > -1) {
			$scope.stationCreateMessage = "Station already exists";
			return false;
		} else {
			$scope.stationCreateMessage = "";
			return true;
		}
	}
	function isValidFlavor(flavor) {
		if (flavor.length > 20) {
			$scope.flavorCreateMessage = "Max size is 20 characters";
			return false;
		} else 
		if ($scope.flavors.indexOf(flavor) > -1) {
			$scope.flavorCreateMessage = "Flavor already exists";
			return false;
		} else {
			$scope.flavorCreateMessage = "";
			return true;
		}
	}
})

app.controller("AssociationController", function($scope) {
	$scope.edit = false;

	$scope.toggleAssociation = function(station, flavor) {

		toggleStationAssociation(station, flavor);
		toggleFlavorAssociation(flavor, station);

		function toggleStationAssociation(key, value) {
		    var index = $scope.stationAssociations[key].indexOf(value);

		    if (index > -1) { 
		      $scope.stationAssociations[key].splice(index, 1);
		    } else {
		      $scope.stationAssociations[key].push(value);
		    }
		} 

		function toggleFlavorAssociation(key, value) {
		    var index = $scope.flavorAssociations[key].indexOf(value);

		    if (index > -1) { 
		      $scope.flavorAssociations[key].splice(index, 1);
		    } else {
		      $scope.flavorAssociations[key].push(value);
		    }
		}
	}
})
app.directive("stationView", function() {
	return {
		restrict: 'E',
		scope: true,
		template: 	'<div class="panel panel-default">' +
						'<div class="panel-heading">' +
							'<span class="h2">{{ stationName | uppercase }}</span>' + 
							'<button type="button" class="btn btn-default pull-right" toggle="edit" toggle-off-text="Associate Flavors" toggle-on-text="Finish"></button>' +
						'</div>' +
						'<div class="panel-body">' +
							'<associations-view associations="associatedFlavors" ng-show="!edit"></associations-view>' +
							'<options-view options="flavors" associations="associatedFlavors" association-key="{{ stationName }}" association-toggle="toggleAssociation(station, flavor)" ng-show="edit"></options-view>' +
						'</div>' +
					'</div>'

	};
});
app.directive("flavorView", function() {
	return {
		restrict: 'E',
		scope: true,
		template: 	'<div class="panel panel-default">' +
						'<div class="panel-heading">' +
							'<span class="h2">{{ flavorName | uppercase }}</span>' + 
							'<button type="button" class="btn btn-default pull-right" toggle="edit" toggle-off-text="Associate Stations" toggle-on-text="Finish"></button>' +
						'</div>' +
						'<div class="panel-body">' +
							'<associations-view associations="associatedStations" ng-show="!edit"></associations-view>' + 
							'<options-view options="stations" associations="associatedStations" association-key="{{ flavorName }}" association-toggle="toggleAssociation(flavor, station)" ng-show="edit"></options-view>' + 
						'</div>' +
					'</div>'

	};
});

app.directive("associationsView", function() {
	return {
		restrict: 'E',
		scope: {
			associations: '='
		},
		template: 	'<div>' +
						'<span class="reminder" ng-if="associations.length == 0">Click the \'Associate\' button to add associations.</span>' +
						'<ul>' +
							'<li ng-repeat="association in associations | orderBy: \'toString()\'">' +
								'<span>{{ association }}</span>' +
							'</li>' +
						'</ul>' +
	  		  		'</div>'
	} 
});

app.directive("optionsView", function() {
	return {
		restrict: 'E',
		scope: {
			options: '=',
			associations: '=',
			associationKey: '@',
			associationToggle: '&'
		},
		template: 	'<div>' +
						'<span class="reminder" ng-if="options.length == 0">Create some options first!</span>' +
						'<label ng-repeat="option in options | orderBy: \'toString()\'">' +
							'<input type="checkbox" value="{{ option }}" ng-checked="associations.indexOf(option) > -1" ng-click="associationToggle({station: associationKey, flavor: option})">' +
							'{{ option }}' +
						'</label>' +
					'</div>'
	}
});

app.directive("toggle", function() {
	return {
		restrict: 'A',
		scope: {
			toggle: '=',
			toggleOnText: '@',
			toggleOffText: '@'
		},
		link: function(scope, elem, attrs) {
			elem.click(function() {
				scope.$apply(function() {
					scope.toggle = !scope.toggle;
				})
			})

			scope.$watch("toggle", function() {
				if (scope.toggle) {
					elem.text(scope.toggleOnText);
				} else {
					elem.text(scope.toggleOffText);
				}
			})
		}
	}
})
