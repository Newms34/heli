app.controller('planecon', function($scope,contFact) {
    $scope.m = {
        x: 0,
        y: 0
    }
    $scope.elev = 0;
    $scope.rud = 0;
    $scope.leftAil = 0;
    $scope.rightAil = 0;
    $scope.throt = 0;
    $scope.propRot = 0;
    $scope.moveMode = true;
    contFact.cylMaker(15,15,5,'#prop-cyl-anchor',{x:0,y:0,z:-10},{x:90,y:0,z:0},false,{h:0,s:0,v:20})
    window.onmousemove = function(e) {
        if ($scope.moveMode) {
            $scope.m.x = e.x || e.clientX;
            $scope.m.y = e.y || e.clientY;
        }else{
        	$scope.elev= 60*(((e.y||e.clientY)/$(document).height())-.5); 
        	$scope.rud= -60*(((e.x||e.clientX)/$(document).width())-.5);
        	$scope.leftAil= 30*(((e.x||e.clientX)/$(document).width())-.5);
        	$scope.rightAil= -30*(((e.x||e.clientX)/$(document).width())-.5);
        }
        $scope.$digest();
    }
    window.onkeydown = function(e) {
        if (e.which == 83) {
            $scope.moveMode = !$scope.moveMode;
        }
        //q:81, a:65
        else if(e.which==81 && $scope.throt<98){
        	$scope.throt+=2;
        }else if(e.which=65 && $scope.throt>2){
        	$scope.throt-=2;
        }
    }
    var engine = setInterval(function(){
    	$scope.propRot+=$scope.throt;
    	// document.querySelector('#prop-shaft');
    	$scope.$digest();
    },40)

})
