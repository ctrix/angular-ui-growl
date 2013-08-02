'use strict';

angular.module('angdevApp')
  .controller('MainCtrl', function ($scope, $growl) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma',
      '$me'
    ];

    $scope.classes = [
        'inverse',
        'danger',
        'warning',
        'success',
        'info',
        'primary'
    ];

    $scope.doClick = function(stick) {
        var rnd = parseInt(Math.random() * $scope.classes.length, 10);

        $growl.box('Class '+$scope.classes[rnd], 'UI.Growl in action', {
                class: $scope.classes[rnd],
                sticky: stick
        }).open();
    };


  });
