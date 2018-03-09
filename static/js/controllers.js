var ConsoleModule = angular.module('ConsoleModule', ['ngRoute']);

ConsoleModule.config(['$routeProvider', '$locationProvider', '$sceDelegateProvider', '$httpProvider',
  function($routeProvider, $locationProvider, $sceDelegateProvider, $httpProvider) {
    $routeProvider.when('/', {
      templateUrl: '/partials/Byzip.html',
      controller: 'wcontroller',
      controllerAs: 'wcontroller'
    });
  }
]);

ConsoleModule.controller('wcontroller', ['$scope', '$http', '$routeParams', '$timeout', '$sce',
  function($scope, $http, $routeParams, $timeout, $sce) {

    $scope.city = "";
    $scope.weather = "";
    $scope.inputHistory = [];
    $scope.clientId = "ye@metlife.co.jp";

    var cleanDisplay = function() {
      //$scope.zip = "";
      $scope.city = "";
      $scope.weather = "";
      $scope.zipTime = "";
      $scope.colorStyle = "";
    };

    $scope.zipUpdate = function() {
      var value = $scope.zip || "";
      if (value.length === 5) {
        $http({
          method: "GET",
          url: '/api/v1/getWeather?zip=' + value + '&clientId=' + $scope.clientId
        }).then(function(response) {
          $scope.city = response.data.city;
          $scope.weather = response.data.weather;
          $scope.zipTime = response.data.zipTime;
          $scope.colorStyle = response.data.colorStyle;
          if ($scope.colorStyle === '') {
            $scope.inputHistory.push({
              'zip': value,
              'city': $scope.city,
              'weather': $scope.weather,
              'zipTime': $scope.zipTime
            });
            console.log($scope.inputHistory);
          }
        });
      } else {
        cleanDisplay();
      }
    };

    $scope.clientChange = function() {
      console.log('New Client is ' + $scope.clientId);
      if ($scope.clientId === "") {
        console.error('Invalid Client ID');
        $scope.clientId = 'ye@metlife.co.jp';
        return;
      }
      cleanDisplay();
      $scope.zip = "";
      $scope.reloadHistory();
    };

    $scope.isHistoryEmpty = function() {
      return $scope.inputHistory.length == 0;
    };

    $scope.reloadHistory = function() {
      $http({
        method: "GET",
        url: '/api/v1/getHistory?clientId=' + $scope.clientId
      }).then(function(response) {
        $scope.inputHistory = response.data || [];
      });
    };

  }
]);
