var app = angular.module('myApp', [], ['ui.bootstrap']);
var app = angular.module('myApp', ['ngRoute']);
app.config(function($routeProvider) {
    $routeProvider

        .when('/gallery', {
        templateUrl: 'gallery.html',
        controller: 'FirstController'
    })
    
    .when('/empdata', {
        templateUrl: 'empdata.html',
        controller: 'SecondController'
    })

    .when('/resto', {
        templateUrl: 'resto.html',
        controller: 'ThirdController'
    })

    .otherwise({
        redirectTo: '/'
    })
    
    app.controller("FirstController",function($scope)

    {
        $scope.pic1 = "images/img-2.jpeg";
        $scope.pic2 = "images/img-3.jpeg";
    
    });
});




app.controller('SecondController', function($scope, $http) {
    $http.get('http://localhost:8000/users')
        .success(function(response) {
            $scope.names = response.Employee;
        });
});

app.controller('ThirdController', function($scope, $http) {
    $http.get('https://shipra1212.github.io/singlepage/roster1.json')
        .success(function(response) {
            $scope.names = response.Employee;
            $scope.rowlimit = 6;
        });
});