app.controller('phone-con', function($scope) {
    $scope.phoneName = Math.floor(Math.random() * 999999999).toString(32).toUpperCase();
    $scope.user = false;
    $scope.role = false;
    socket.emit('newPhone', $scope.phoneName)
    socket.on('regPhone', function(phone) {
            if($scope.phoneName ==phone.name ){
            	$scope.user = phone.u;
            	$scope.role=phone.role;
            	$scope.$apply();
            }
    });
    $scope.showInf = function(n){
    	if(!n){
    		bootbox.alert('Enter this automatically-generated phone code for either the cyclic or collective on the desktop site.')
    	}else if(n==1){
    		bootbox.alert('The game code corresponds to the particular "instance" of the desktop site your phone is connected with.')
    	}else{
    		bootbox.alert('If set to collective, your phone controls average blade angle. If set to cyclic, your phone controls, generally speaking, the direction of the craft.')
    	}
    }
})
