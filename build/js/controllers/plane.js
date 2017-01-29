app.controller('planecon', function($scope, contFact) {
    $scope.m = {
        x: 0,
        y: 0
    }
    $scope.elev = 0;
    $scope.rud = 0;
    $scope.leftAil = 0;
    $scope.rightAil = 0;
    $scope.groundDisp = {
        x: 0,
        y: 0
    };
    $scope.worldRot = {
        x: 0,
        y: 0,
        z: 0
    };
    $scope.throt = 0;
    $scope.propRot = 0;
    $scope.user = Math.floor(Math.random() * 999999999).toString(32); //randomly chosen username

    $scope.moveMode = true;
    //cylinder for the prop
    contFact.cylMaker(15, 15, 5, '#prop-cyl-anchor', { x: 2, y: 2, z: -10 }, { x: 90, y: 0, z: 0 }, false, { h: 0, s: 0, v: 20 })
        //right leg
    contFact.cylMaker(15, 60, 7, '.fuse-panel:nth-of-type(1)', { x: 30, y: 0, z: -15 }, { x: 0, y: 30, z: 70 }, false);
    contFact.cylMaker(15, 60, 7, '.fuse-panel:nth-of-type(1)', { x: 30, y: 60, z: -15 }, { x: 0, y: 30, z: 110 }, false);
    //left leg
    contFact.cylMaker(15, 60, 7, '.fuse-panel:nth-of-type(2)', { x: 70, y: 0, z: -15 }, { x: 0, y: 150, z: 70 }, false);
    contFact.cylMaker(15, 60, 7, '.fuse-panel:nth-of-type(2)', { x: 70, y: 60, z: -15 }, { x: 0, y: 150, z: 110 }, false);

    //right wheel
    contFact.cylMaker(15, 7, 45, '#whl-right', { x: 0, y: 0, z: 25 }, { x: 90, y: 0, z: 0 }, true, { h: 0, s: 0, v: 20 });

    //left wheel
    var testMode = false;
    contFact.cylMaker(15, 7, 45, '#whl-left', { x: 0, y: 0, z: 25 }, { x: 90, y: 0, z: 0 }, true, { h: 0, s: 0, v: 20 });
    window.onmousemove = function(e) {
        if ($scope.moveMode && !$scope.phoneId) {
            $scope.m.x = e.x || e.clientX;
            $scope.m.y = e.y || e.clientY;
        } else if (!$scope.phoneId || testMode) {
            $scope.elev = 60 * (((e.y || e.clientY) / $(document).height()) - .5);
            $scope.rud = -60 * (((e.x || e.clientX) / $(document).width()) - .5);
            $scope.leftAil = 30 * (((e.x || e.clientX) / $(document).width()) - .5);
            $scope.rightAil = -30 * (((e.x || e.clientX) / $(document).width()) - .5);
        } else {
            $scope.throt = 200 * (1 - ((e.y || e.clientY) / $(document).height()));
        }
        $scope.$digest();
    }
    window.onkeydown = function(e) {
        if (e.which == 83) {
            $scope.moveMode = !$scope.moveMode;
        }
        //q:81, a:65
        else if (e.which == 81 && $scope.throt < 198) {
            $scope.throt += 2;
        } else if (e.which = 65 && $scope.throt > 2) {
            $scope.throt -= 2;
        }
    }
    var engine = setInterval(function() {
        //main timer
        $scope.propRot += $scope.throt;
        $scope.propRot = $scope.propRot % 360; //prevent overflow!
        $scope.groundDisp.y -= $scope.throt / 10;
        $scope.handleSurfaces();
        $scope.$digest();
    }, 40)
    $scope.explCode = function() {
        bootbox.confirm({
            title: "Phone ID Code &#128241;",
            message: "The Phone ID Code &#128241; links one particular smartphone with one particular instance of this demo. Each phone code can only be used once. A new code can be obtained by visiting daveheligame.herokuapp.com on your phone. Your phone will be used as a joystick.<hr/>",
            buttons: {
                confirm: {
                    label: 'Okay',
                    className: 'btn-primary'
                }
            },
            callback: function(result) {
                console.log('This was logged in the callback: ' + result);
            }
        });
    };
    $scope.testCodeTimer = null;
    $scope.testPhone = function() {
        if ($scope.testCodeTimer) clearInterval($scope.testCodeTimer);
        $scope.testCodeTimer = setTimeout(function() {
            console.log('sending out', $scope.phoneIdCand);
            socket.emit('checkPhone', { code: $scope.phoneIdCand });
        }, 500)
    }
    socket.on('phoneCheckResult', function(r) {
        console.log(r);
        $scope.phoneValid = r.valid;
        $scope.$digest();
    })
    $scope.submitCode = function() {
        socket.emit('registerPhones', { joy: $scope.phoneIdCand, desk: $scope.user })
        $scope.phoneId = $scope.phoneIdCand;
        document.querySelector('#plane-main').style.transform = 'translateZ(-100px) rotateX(90deg) rotateY(180deg)'
    };
    $scope.handleSurfaces = function() {
        //surfaces range from 0-35 in either direction
        $scope.worldRot.x+=$scope.elev/35;
        $scope.worldRot.y+=$scope.rightAil/35;
        $scope.worldRot.z+=$scope.rud/35;
        $scope.$digest();
    };
    socket.on('oriToDesk', function(ori) {
        if (ori.u == $scope.user) {
            //ori cmd is for this instance;
            if (ori.r == 'joy') {
                $scope.elev = (.5 * ori.x);
                $scope.rud = 0 - (.5 * ori.z);
                $scope.leftAil = 0 - (.5 * ori.y);
                $scope.rightAil = (.5 * ori.y);
                $scope.$digest();
            }
           
            $scope.$apply();
        }
    });
})
