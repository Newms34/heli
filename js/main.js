var app = angular.module('heli', []).controller('helicon', function($scope, $compile) {
    $scope.shaftCurRot = 0;
    $scope.currEngSpeed = 0; //out of 200;
    $scope.rotX = 0;
    $scope.rotZ = 0;
    $scope.curBladeRot = 88;
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
    $scope.cylMaker(7, 60, '#upper-swash', { x: -5, y: 180, z: 1 }, { x: 0, y: 0, z: 0 }, true);
    $scope.cylMaker(15, 80, '#rotor-hub', { x: -7, y: 110, z: 2 }, { x: 0, y: 0, z: 0 }, true,{h:0,s:0,v:10});
    $scope.cylMaker(7, 60, '#lower-swash', { x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 }, true);
    $scope.cylMaker(55, 3, '#c-r-f', { x: 31, y: -79, z: 0 }, { x: 0, y: 0, z: 0 }, false,{h:0,s:0,v:10});
    $scope.cylMaker(55, 3, '#c-r-b', { x: -19, y: -79, z: 0 }, { x: 0, y: 0, z: 0 }, false,{h:0,s:0,v:10});
    $scope.cylMaker(55, 3, '#c-r-l', { x: 6, y: -79, z: 25 }, { x: 0, y: 0, z: 0 }, false,{h:0,s:0,v:10});
    $scope.cylMaker(55, 3, '#c-r-r', { x: 6, y: -79, z: -25 }, { x: 0, y: 0, z: 0 }, false,{h:0,s:0,v:10});

    $scope.rectMaker(25, 1200, '#m-b-f', { x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 }, 'linear-gradient(to left, yellow, yellow 2%, black 2%)', true);
    $scope.rectMaker(25, 1200, '#m-b-b', { x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 }, 'linear-gradient(to left, yellow, yellow 2%, black 2%)', true)
    $scope.rectMaker(25, 1200, '#m-b-r', { x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 }, 'linear-gradient(to left, yellow, yellow 2%, black 2%)', true)
    $scope.rectMaker(25, 1200, '#m-b-l', { x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 }, 'linear-gradient(to left, yellow, yellow 2%, black 2%)', true)
    $scope.rotsOn = true;
    window.onmousemove = function(e) {
        if ($scope.rotsOn) {
            $scope.rotX = e.x;
            $scope.rotZ = e.y;
            $scope.$apply();
        }
    };
    $scope.engOn = true;
    window.onkeyup = function(e) {
        if (e.which == 83) {
            $scope.rotsOn = !$scope.rotsOn;
        } else if (e.which == 69) {
            $scope.engOn = !$scope.engOn;
            if ($scope.engOn) {
                $scope.spinny();
            }
        } else if (e.which == 81 && $scope.currEngSpeed < 195) {
            $scope.currEngSpeed += 5;
        } else if (e.which == 90 && $scope.currEngSpeed > 5) {
            $scope.currEngSpeed -= 5;
        }
    }
    $scope.spinny = function() {
        setTimeout(function() {
            console.log('WHIRRR')
            $scope.shaftCurRot += $scope.currEngSpeed;
            $scope.$apply();
            if ($scope.engOn) {
                $scope.spinny();
            }
        }, 50)
    };
})
