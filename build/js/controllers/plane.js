app.controller('planecon', function($scope) {
    $scope.m = {
        x: 0,
        y: 0
    }
    $scope.elev = 0;
    $scope.rud = 0;
    $scope.leftAil = 0;
    $scope.rightAil = 0;
    $scope.moveMode = true;
    window.onmousemove = function(e) {
        if ($scope.moveMode) {
            $scope.m.x = e.x || e.clientX;
            $scope.m.y = e.y || e.clientY;
        }else{
        	$scope.elev= 60*(((e.y||e.clientY)/$(document).height())-.5); 
        	$scope.rud= -60*(((e.x||e.clientX)/$(document).width())-.5);
        	$scope.leftAil= 60*(((e.x||e.clientX)/$(document).width())-.5);
        	$scope.rightAil= -60*(((e.x||e.clientX)/$(document).width())-.5);
        }
        $scope.$digest();
    }
    window.onkeyup = function(e) {
        if (e.which == 83) {
            $scope.moveMode = !$scope.moveMode;
        }
    }
})
