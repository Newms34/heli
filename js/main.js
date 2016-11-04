var app = angular.module('heli', []).controller('helicon', function($scope, $compile) {
    $scope.shaftCurRot = 0;

    $scope.currEngSpeed = 0; //out of 200;
    $scope.rotX = 0;
    $scope.rotZ = 0;
    $scope.tiltFB = 0;
    $scope.tiltRL = 0;
    $scope.curBladeRot = 0;
    $scope.cylRez = 15; //global (sorta) attribute that specifies cylinder resolution: how many vertical segments per cylinder
    $scope.cylMaker = function(h, w, p, t, o, e, c) {
        //height, width, parent(selector), translation, rotation (orientation), capped(boolean)
        var cylCon = document.createElement('div');
        cylCon.className = 'cyl-con';
        document.querySelector(p).appendChild(cylCon);
        //cylinder-specific vars
        var rotAmt = 360 / $scope.cylRez;
        var segw = (Math.PI * w * rotAmt / 360) + 1;
        for (var i = 0; i < $scope.cylRez; i++) {
            var newSeg = document.createElement('div');
            newSeg.className = 'cyl-seg';
            if (c) {
                newSeg.style.background = 'hsl(' + c.h + ',' + c.s + '%,' + ((c.v - 15) + (30 * Math.abs(i - ($scope.cylRez / 2)) / ($scope.cylRez / 2))) + '%)'
            } else {
                newSeg.style.background = 'hsl(0,0%,' + (40 + (30 * Math.abs(i - ($scope.cylRez / 2)) / ($scope.cylRez / 2))) + '%)'
            }
            newSeg.style.width = segw + 'px';
            newSeg.style.height = h + 'px';
            newSeg.style.transform = 'rotateY(' + (rotAmt * i) + 'deg) translateZ(' + (w / 2) + 'px) translateY(' + (h / 2) + 'px)';
            cylCon.appendChild(newSeg);
            if (e == true) {
                var newTop = document.createElement('div');
                newTop.className = 'cyl-cap';
                if (c) {
                    newTop.style.borderTop = (w / 2) + 'px solid hsl(' + c.h + ',' + c.s + '%,' + ((c.v - 15) + (30 * Math.abs(i - ($scope.cylRez / 2)) / ($scope.cylRez / 2))) + '%)'
                } else {
                    newTop.style.borderTop = (w / 2) + 'px solid hsl(0,0%,' + (30 + (30 * Math.abs(i - ($scope.cylRez / 2)) / ($scope.cylRez / 2))) + '%)';
                }
                newTop.style.borderLeft = (segw / 2) + 'px solid transparent';
                newTop.style.borderRight = (segw / 2) + 'px solid transparent';
                newTop.style.transform = 'rotateX(-90deg)'
                $(newSeg).append(newTop);
                var newBottom = document.createElement('div');
                newBottom.className = 'cyl-cap';
                if (c) {
                    newBottom.style.borderTop = (w / 2) + 'px solid hsl(' + c.h + ',' + c.s + '%,' + ((c.v - 15) + (30 * Math.abs(i - ($scope.cylRez / 2)) / ($scope.cylRez / 2))) + '%)'
                } else {
                    newBottom.style.borderTop = (w / 2) + 'px solid hsl(0,0%,' + (30 + (30 * Math.abs(i - ($scope.cylRez / 2)) / ($scope.cylRez / 2))) + '%)';
                }
                newBottom.style.borderLeft = (segw / 2) + 'px solid transparent';
                newBottom.style.borderRight = (segw / 2) + 'px solid transparent';
                newBottom.style.transform = 'rotateX(-90deg) translateZ(' + h + 'px)';
                $(newSeg).append(newBottom);
            }
        }
        //as a last step, we move the parent. Note that rotation happens AFTER translation.
        $(p).css({ 'transform': 'translateX(' + t.x + 'px) translateY(' + t.y + 'px) translateZ(' + t.z + 'px) rotateX(' + o.x + 'deg) rotateY(' + o.y + 'deg) rotateZ(' + o.z + 'deg)' })
    };
    $scope.rectMaker = function(h, w, p, t, o, c, b) {
        //#rekt
        //rectangles are a lot simpler than cylinders
        var rek = document.createElement('div');
        rek.style.background = c ? c : 'hsl(0,0%,50%)'; //use c as color or default color
        rek.style.height = h + 'px';
        rek.style.width = w + 'px';
        $(p).append(rek);
        if (!b) {
            //if its not a blade, apply transform. Otherwise, let inline styles take over
            $(p).css({ 'transform': 'translateX(' + t.x + 'px) translateY(' + t.y + 'px) translateZ(' + t.z + 'px) rotateX(' + o.x + 'deg) rotateY(' + o.y + 'deg) rotateZ(' + o.z + 'deg)' });
        }
    };
    $scope.cylMaker(240, 7, '#main-shaft', { x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 }, false);
    $scope.cylMaker(7, 60, '#upper-swash', { x: -6, y: 180, z: 0 }, { x: 0, y: 0, z: 0 }, true);
    $scope.cylMaker(25, 80, '#rotor-hub', { x: -7, y: 105, z: 2 }, { x: 0, y: 0, z: 0 }, true, { h: 0, s: 0, v: 10 });
    $scope.cylMaker(7, 60, '#lower-swash', { x: -6, y: 0, z: 0 }, { x: 0, y: 0, z: 0 }, true);
    $scope.cylMaker(65, 3, '#c-r-f', { x: 31, y: -6, z: 0 }, { x: 0, y: 0, z: 0 }, false, { h: 0, s: 0, v: 10 });
    $scope.cylMaker(65, 3, '#c-r-b', { x: -19, y: -6, z: 0 }, { x: 0, y: 0, z: 0 }, false, { h: 0, s: 0, v: 10 });
    $scope.cylMaker(65, 3, '#c-r-l', { x: 6, y: -6, z: 25 }, { x: 0, y: 0, z: 0 }, false, { h: 0, s: 0, v: 10 });
    $scope.cylMaker(65, 3, '#c-r-r', { x: 6, y: -6, z: -25 }, { x: 0, y: 0, z: 0 }, false, { h: 0, s: 0, v: 10 });

    $scope.rectMaker(25, 1200, '#m-b-f', { x: 0, y: -5, z: 0 }, { x: 0, y: 0, z: 0 }, 'linear-gradient(to left, yellow, yellow 2%, black 2%)', true);
    $scope.rectMaker(25, 1200, '#m-b-b', { x: 0, y: -5, z: 0 }, { x: 0, y: 0, z: 0 }, 'linear-gradient(to left, yellow, yellow 2%, black 2%)', true)
    $scope.rectMaker(25, 1200, '#m-b-r', { x: 0, y: -5, z: 0 }, { x: 0, y: 0, z: 0 }, 'linear-gradient(to left, yellow, yellow 2%, black 2%)', true)
    $scope.rectMaker(25, 1200, '#m-b-l', { x: 0, y: -5, z: 0 }, { x: 0, y: 0, z: 0 }, 'linear-gradient(to left, yellow, yellow 2%, black 2%)', true)
    $scope.rotsOn = true;
    window.onmousemove = function(e) {
        if ($scope.rotsOn) {
            $scope.rotX = e.x;
            $scope.rotZ = e.y;
            $scope.$apply();
        }
    };
    $scope.engOn = false;
    window.onkeydown = function(e) {
        if (e.which == 83) {
            $scope.rotsOn = !$scope.rotsOn;
        } else if (e.which == 69) {
            $scope.engOn = !$scope.engOn;
            if ($scope.engOn) {
                $scope.spinny();
            }
        } else if (e.which == 81 && $scope.currEngSpeed < 195) {
            $scope.currEngSpeed += 2;
        } else if (e.which == 90 && $scope.currEngSpeed > 5) {
            $scope.currEngSpeed -= 2;
        } else if (e.which == 88 && $scope.curBladeRot > 62) {
            $scope.curBladeRot -= 2
        } else if (e.which == 87 && $scope.curBladeRot < 90) {
            $scope.curBladeRot += 2
        } else if (e.which == 73 && $scope.tiltFB < 15) {
            e.preventDefault();
            $scope.tiltFB++;
        } else if (e.which == 75 && $scope.tiltFB > -15) {
            e.preventDefault();
            $scope.tiltFB--;
        } else if (e.which == 74 && $scope.tiltRL < 15) {
            e.preventDefault();
            $scope.tiltRL++;
        } else if (e.which == 76 && $scope.tiltRL > -15) {
            e.preventDefault();
            $scope.tiltRL--;
        }
    }
    $scope.getFBAngle = function() {
        return ($scope.tiltFB * Math.cos($scope.shaftCurRot * Math.PI / 180)) - ($scope.tiltRL * Math.sin($scope.shaftCurRot * Math.PI / 180));
    }

    $scope.getRLAngle = function() {
        // console.log('GETRLANGLE: raw tiltFB',$scope.tiltFB,'raw tiltRL',$scope.tiltRL,'cos',Math.cos(($scope.shaftCurRot) * Math.PI / 180),'sin',Math.sin(($scope.shaftCurRot) * Math.PI / 180),'calced tilt fb',($scope.tiltFB * Math.cos($scope.shaftCurRot * Math.PI / 180)) + ($scope.tiltRL * Math.sin($scope.shaftCurRot * Math.PI / 180)),'calced tilt rl',($scope.tiltFB * Math.sin(($scope.shaftCurRot) * Math.PI / 180)) + ($scope.tiltRL * Math.cos(($scope.shaftCurRot) * Math.PI / 180)),'rot',$scope.shaftCurRot%360)
        return ($scope.tiltFB * Math.sin(($scope.shaftCurRot) * Math.PI / 180)) + ($scope.tiltRL * Math.cos(($scope.shaftCurRot) * Math.PI / 180));
    }
    $scope.spinny = function() {
        setTimeout(function() {
            $scope.shaftCurRot += $scope.currEngSpeed;
            $scope.$apply();
            if ($scope.engOn) {
                $scope.spinny();
            }
        }, 50)
    };
    $scope.getRodHeight = function(n) {
        //heh, rod
        n = parseInt(n);
        var ang = 0 - 6 - Math.cos(($scope.shaftCurRot + n) * Math.PI / 180) * (40 * Math.sin(($scope.tiltFB) * Math.PI / 180));
        ang += 0 - 6 - Math.cos(($scope.shaftCurRot + n + 90) * Math.PI / 180) * (40 * Math.sin(($scope.tiltRL) * Math.PI / 180));
        return ang;
    };
    $scope.getBladeAng = function(n) {
        var ang = Math.cos(($scope.shaftCurRot + n) * Math.PI / 180) * (40 * Math.sin(($scope.tiltFB) * Math.PI / 180));
        ang += Math.cos(($scope.shaftCurRot + n + 90) * Math.PI / 180) * (40 * Math.sin(($scope.tiltRL) * Math.PI / 180));
        //ang is now displacement of parent rod. now we need to convert this to a percentage of max rot
        var maxDisp = 2 * Math.max(Math.abs((40 * Math.sin(($scope.tiltRL) * Math.PI / 180))), Math.abs((40 * Math.sin(($scope.tiltFB) * Math.PI / 180))));
        ang += maxDisp / 2;
        if (n == 0) {
            console.log(ang,$scope.curBladeRot,ang,maxDisp)
        }
        if (isNaN(90 - ($scope.curBladeRot * ang / maxDisp))) {
            return 90;
        }
        return 90 - ($scope.curBladeRot * ang / maxDisp);
    }
})
