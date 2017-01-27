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
    //cylinder for the prop
    contFact.cylMaker(15,15,5,'#prop-cyl-anchor',{x:2,y:2,z:-10},{x:90,y:0,z:0},false,{h:0,s:0,v:20})
    //right leg
    contFact.cylMaker(15,60,7,'.fuse-panel:nth-of-type(1)',{x:30,y:0,z:-15},{x:0,y:30,z:70},false);
    contFact.cylMaker(15,60,7,'.fuse-panel:nth-of-type(1)',{x:30,y:60,z:-15},{x:0,y:30,z:110},false);
    //left leg
    contFact.cylMaker(15,60,7,'.fuse-panel:nth-of-type(2)',{x:70,y:0,z:-15},{x:0,y:150,z:70},false);
    contFact.cylMaker(15,60,7,'.fuse-panel:nth-of-type(2)',{x:70,y:60,z:-15},{x:0,y:150,z:110},false);

    //right wheel
    contFact.cylMaker(15,7,45,'#whl-right',{x:0,y:0,z:25},{x:90,y:0,z:0},true,{h:0,s:0,v:20});

    //left wheel
    contFact.cylMaker(15,7,45,'#whl-left',{x:0,y:0,z:25},{x:90,y:0,z:0},true,{h:0,s:0,v:20});
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
    	$scope.propRot = $scope.propRot%360;//prevent overflow!
    	// document.querySelector('#prop-shaft');
    	$scope.$digest();
    },40)

})
