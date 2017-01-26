var socket = io();
var app = angular.module('heli', []);
app.controller('helicon', function($scope, movFact) {
    $scope.mobilecheck = function() {
        var check = false;
        (function(a) {
            if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
        })(navigator.userAgent || navigator.vendor || window.opera);
        return check;
    };
    if ($scope.mobilecheck()) {
        $window.location.href = '/mobile';
    }
    $scope.shaftCurRot = 0;
    $scope.user = Math.floor(Math.random() * 999999999).toString(32); //randomly chosen username
    $scope.currEngSpeed = 2; //out of 200;
    $scope.rotX = 0;
    $scope.rotZ = 0;
    $scope.tiltFB = 0; //pitch
    $scope.tiltRL = 0; //roll/sideslip
    $scope.pedals = 0; //yaw
    $scope.curBladeRot = 0;
    $scope.showCons = true;
    $scope.cycChoice = 'cycPhone';
    $scope.colChoice = 'colPhone';
    $scope.colNoPhone = true;
    $scope.cycNoPhone = true;
    $scope.contInfo = function(n) {
        if (!n) {
            bootbox.alert('The cyclic, generally speaking, controls direction. It\'s similar to the joystick of other aircraft.');
        } else if (n == 1) {
            bootbox.alert('The collective controls the (average) angle of the main rotor blades. Increasing this angle increases lift. The throttle, meanwhile, is generally kept fairly steady.');
        }
    };
    $scope.checkPhoneExists = function(w) {
        var check = {
            code: !w ? $scope.cycCode : $scope.colCode,
            type: !w ? 'cyc' : 'col'
        };
        if (check.code) {
            //don't emit if blank
            socket.emit('checkPhone', check);
        }

    };
    $scope.mouseZero = {
        x: null,
        y: null
    };
    $scope.setUpMouse = function(m) {
        //mouse is control
        window.onmousemove = function(e) {
            e.x = e.x || e.clientX;
            e.y = e.y || e.clientY;
            if (!$scope.mouseZero.x) {
                $scope.mouseZero = {
                    x: e.x,
                    y: e.y
                };
            }
            if (!m) {
                var oriObj = movFact.handleMouseOri(e.x, e.y, $(window).width(), $(window).height(), $scope.mouseZero);
                $scope.tiltFB = oriObj.FB;
                $scope.tiltRL = oriObj.RL;
            } else {
                $scope.curBladeRot = movFact.handleMouseThrot(e.y, $(window).height(), $scope.mouseZero);
            }
            $scope.$apply();
        };
        if (!m) {
            //mouse is in cyc mode, so left/right click will act as pedals
            window.onmousedown = function(e) {
                if (e.button == 2) {
                    e.preventDefault();
                    e.stopPropagation();
                }
                $scope.pedals = movFact.handleMousePedal(e, 1);
                $scope.$apply();
            };
            window.onmouseup = function(e) {
                $scope.pedals = movFact.handleMousePedal(e, 0);
                $scope.$apply();
            };
            window.oncontextmenu = function(e) {
                e.preventDefault();
                e.stopPropagation();
            };
        }

    };
    $scope.checkCons = function() {
        //first, we need to send the phone codes thru to update them:
        if ($scope.cycChoice == 'cycPhone') {
            $scope.checkPhoneExists(0);
        }
        if ($scope.colChoice == 'colPhone') {
            $scope.checkPhoneExists(1);
        }
        if (($scope.cycChoice == 'cycPhone' && ($scope.cycNoPhone || !$scope.cycCode)) || ($scope.colChoice == 'colPhone' && ($scope.colNoPhone || !$scope.colCode))) {
            bootbox.alert('Uh oh! It looks like one or more of your controls isn\'t valid. Make sure you use only VALID phone codes!');
        } else if ($scope.cycChoice == 'cycPhone' && $scope.colChoice == 'colPhone' && $scope.colCode == $scope.cycCode) {
            bootbox.alert('Hey! You can\'t control both cyclic and collective with the same phone!');
        } else {
            //phones SHOULD be valid!
            $scope.showCons = false;
            var phoneReg = {
                desk: $scope.user,
                cyc: $scope.cycChoice == 'cycPhone' ? $scope.cycCode : false,
                col: $scope.colChoice == 'colPhone' ? $scope.colCode : false
            };
            socket.emit('registerPhones', phoneReg); //send game info to phones
            //now deal with mouse:
            if ($scope.cycChoice == 'cycMouse') {
                $scope.setUpMouse(0);
            } else if ($scope.colChoice == 'colMouse') {
                $scope.setUpMouse(1);
            }
        }
    };
    socket.on('phoneCheckResult', function(d) {
        $scope[d.type + 'NoPhone'] = !d.valid;
    });
    $scope.preventDupCon = function(n) {
        //this prevents the mouse from controlling BOTH cyclic AND collective
        if (!n) {
            $scope.colChoice = 'colPhone';
        } else {
            $scope.cycChoice = 'cycPhone';
        }
    };
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
                newSeg.style.background = 'hsl(' + c.h + ',' + c.s + '%,' + ((c.v - 15) + (30 * Math.abs(i - ($scope.cylRez / 2)) / ($scope.cylRez / 2))) + '%)';
            } else {
                newSeg.style.background = 'hsl(0,0%,' + (40 + (30 * Math.abs(i - ($scope.cylRez / 2)) / ($scope.cylRez / 2))) + '%)';
            }
            newSeg.style.width = segw + 'px';
            newSeg.style.height = h + 'px';
            newSeg.style.transform = 'rotateY(' + (rotAmt * i) + 'deg) translateZ(' + (w / 2) + 'px) translateY(' + (h / 2) + 'px)';
            cylCon.appendChild(newSeg);
            if (e === true) {
                var newTop = document.createElement('div');
                newTop.className = 'cyl-cap';
                if (c) {
                    newTop.style.borderTop = (w / 2) + 'px solid hsl(' + c.h + ',' + c.s + '%,' + ((c.v - 15) + (30 * Math.abs(i - ($scope.cylRez / 2)) / ($scope.cylRez / 2))) + '%)';
                } else {
                    newTop.style.borderTop = (w / 2) + 'px solid hsl(0,0%,' + (30 + (30 * Math.abs(i - ($scope.cylRez / 2)) / ($scope.cylRez / 2))) + '%)';
                }
                newTop.style.borderLeft = (segw / 2) + 'px solid transparent';
                newTop.style.borderRight = (segw / 2) + 'px solid transparent';
                newTop.style.transform = 'rotateX(-90deg)';
                $(newSeg).append(newTop);
                var newBottom = document.createElement('div');
                newBottom.className = 'cyl-cap';
                if (c) {
                    newBottom.style.borderTop = (w / 2) + 'px solid hsl(' + c.h + ',' + c.s + '%,' + ((c.v - 15) + (30 * Math.abs(i - ($scope.cylRez / 2)) / ($scope.cylRez / 2))) + '%)';
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
        $(p).css({ 'transform': 'translateX(' + t.x + 'px) translateY(' + t.y + 'px) translateZ(' + t.z + 'px) rotateX(' + o.x + 'deg) rotateY(' + o.y + 'deg) rotateZ(' + o.z + 'deg)' });
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
    $scope.rectMaker(25, 1200, '#m-b-b', { x: 0, y: -5, z: 0 }, { x: 0, y: 0, z: 0 }, 'linear-gradient(to left, yellow, yellow 2%, black 2%)', true);
    $scope.rectMaker(25, 1200, '#m-b-r', { x: 0, y: -5, z: 0 }, { x: 0, y: 0, z: 0 }, 'linear-gradient(to left, yellow, yellow 2%, black 2%)', true);
    $scope.rectMaker(25, 1200, '#m-b-l', { x: 0, y: -5, z: 0 }, { x: 0, y: 0, z: 0 }, 'linear-gradient(to left, yellow, yellow 2%, black 2%)', true);
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
        } else if (e.which == 81 && $scope.currEngSpeed < 198) {
            $scope.currEngSpeed += 2;
        } else if (e.which == 90 && $scope.currEngSpeed > 5) {
            $scope.currEngSpeed -= 2;
        } else if (e.which == 88 && $scope.curBladeRot > 62) {
            $scope.curBladeRot -= 2;
        } else if (e.which == 87 && $scope.curBladeRot < 90) {
            $scope.curBladeRot += 2;
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
        } else if (e.which == 32) {
            e.preventDefault();
            $scope.mouseZero.x = null;
        }
    };
    $scope.getFBAngle = function() {
        return ($scope.tiltFB * Math.cos($scope.shaftCurRot * Math.PI / 180)) - ($scope.tiltRL * Math.sin($scope.shaftCurRot * Math.PI / 180));
    };

    $scope.getRLAngle = function() {
        // console.log('GETRLANGLE: raw tiltFB',$scope.tiltFB,'raw tiltRL',$scope.tiltRL,'cos',Math.cos(($scope.shaftCurRot) * Math.PI / 180),'sin',Math.sin(($scope.shaftCurRot) * Math.PI / 180),'calced tilt fb',($scope.tiltFB * Math.cos($scope.shaftCurRot * Math.PI / 180)) + ($scope.tiltRL * Math.sin($scope.shaftCurRot * Math.PI / 180)),'calced tilt rl',($scope.tiltFB * Math.sin(($scope.shaftCurRot) * Math.PI / 180)) + ($scope.tiltRL * Math.cos(($scope.shaftCurRot) * Math.PI / 180)),'rot',$scope.shaftCurRot%360)
        return ($scope.tiltFB * Math.sin(($scope.shaftCurRot) * Math.PI / 180)) + ($scope.tiltRL * Math.cos(($scope.shaftCurRot) * Math.PI / 180));
    };
    $scope.spinny = function() {
        setTimeout(function() {
            $scope.shaftCurRot += $scope.currEngSpeed;
            $scope.$apply();
            if ($scope.engOn) {
                $scope.spinny();
            }
        }, 50);
    };
    $scope.getRodHeight = function(n) {
        //heh, rod
        n = parseInt(n);
        var ang = 0 - 6 - Math.cos(($scope.shaftCurRot + n) * Math.PI / 180) * (40 * Math.sin(($scope.tiltFB) * Math.PI / 180));
        ang += 0 - 6 - Math.cos(($scope.shaftCurRot + n + 90) * Math.PI / 180) * (40 * Math.sin(($scope.tiltRL) * Math.PI / 180));
        return ang;
    };
    $scope.getBladeAng = function(n) {
        var ang = Math.cos(($scope.shaftCurRot + n) * Math.PI / 180) * $scope.tiltFB;
        ang += Math.cos(($scope.shaftCurRot + n + 90) * Math.PI / 180) * $scope.tiltRL;
        //ang is now displacement of parent rod. now we need to convert this to a percentage of max rot
        var maxDisp = 2 * Math.max(Math.abs($scope.tiltRL), Math.abs($scope.tiltFB));
        ang += maxDisp / 2;
        if ($scope.tiltFB === 0 && $scope.tiltRL === 0) {
            return 90 - (0.5 * $scope.curBladeRot);
        }
        if (isNaN(90 - ($scope.curBladeRot * ang / maxDisp))) {
            return 90;
        }
        return 90 - ($scope.curBladeRot * ang / maxDisp);
    };
    socket.on('oriToDesk', function(ori) {
        if (ori.u == $scope.user) {
            //ori cmd is for this instance;
            if (ori.r == 'cyc') {
                var newOri = movFact.handlePhoneCyc(ori);
                $scope.tiltFB = newOri.FB;
                $scope.tiltRL = newOri.RL;
                $scope.pedals = newOri.pedals;
            } else {
                $scope.curBladeRot = movFact.handlePhoneCol(ori);
            }
            $scope.$apply();
        }
    });
});

app.controller('phone-con', function($scope,contFact) {
    $scope.phoneName = Math.floor(Math.random() * 999999999).toString(32).toUpperCase();
    $scope.user = false;
    $scope.role = false;
    $scope.initZero = false; //has the zero point been set?
    //alpha = z, beta = x, gamma = y
    $scope.zero = {
        x: null,
        y: null,
        z: null
    };
    $scope.currOri = {

    };
    socket.emit('newPhone', $scope.phoneName);
    socket.on('regPhone', function(phone) {
        if ($scope.phoneName == phone.name) {
            $scope.user = phone.u;
            $scope.role = phone.role;
            $scope.$apply();
        }
    });
    $scope.showInf = function(n) {
        if (!n) {
            bootbox.alert('Enter this automatically-generated phone code for either the cyclic or collective on the desktop site.');
        } else if (n == 1) {
            bootbox.alert('The game code corresponds to the particular "instance" of the desktop site your phone is connected with.');
        } else {
            bootbox.alert('If set to collective, your phone controls average blade angle. If set to cyclic, your phone controls, generally speaking, the direction of the craft.');
        }
    };
    $scope.setZero = function() {
        $scope.zero = angular.copy($scope.currOri);
    };
    window.addEventListener('deviceorientation', function(o) {
        $scope.currOri.x = o.beta;
        $scope.currOri.y = o.gamma;
        $scope.currOri.z = o.alpha;
        if (!$scope.initZero) {
            //have not yet set initial pos
            $scope.initZero = true;
            $scope.setZero();
        }
        contFact.handleOri($scope.zero,$scope.currOri,$scope.user,$scope.role);
    });
    $scope.reZero = function(){
        bootbox.confirm('Are you sure you want to re-zero?',function(resp){
            if(resp){
                $scope.setZero();
            }
        });
    };
});

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

app.factory('contFact', function($rootScope) {
    return {
        handleOri: function(z, c, u, r) {
            var diffx = Math.min(Math.max(z.x - c.x, -70), 70),
                diffy = Math.min(Math.max(z.y - c.y, -70), 70),
                diffz = Math.min(Math.max(z.z - c.z, -70), 70);
            socket.emit('phoneOri', {
                x: diffx,
                y: diffy,
                z: diffz,
                u: u,
                r: r
            });
        },
        cylMaker: function(rez, h, w, p, t, o, e, c) {
            //height, width, parent(selector), translation, rotation (orientation), capped(boolean)
            var cylCon = document.createElement('div');
            cylCon.className = 'cyl-con';
            document.querySelector(p).appendChild(cylCon);
            //cylinder-specific vars
            var rotAmt = 360 / rez;
            var segw = (Math.PI * w * rotAmt / 360) + 1;
            for (var i = 0; i < rez; i++) {
                var newSeg = document.createElement('div');
                newSeg.className = 'cyl-seg';
                console.log('HUE INFO', c)
                if (c) {
                    newSeg.style.background = 'hsl(' + c.h + ',' + c.s + '%,' + ((c.v - 15) + (30 * Math.abs(i - (rez / 2)) / (rez / 2))) + '%)';
                } else {
                    newSeg.style.background = 'hsl(0,0%,' + (40 + (30 * Math.abs(i - (rez / 2)) / (rez / 2))) + '%)';
                }
                newSeg.style.width = segw + 'px';
                newSeg.style.height = h + 'px';
                newSeg.style.transform = 'rotateY(' + (rotAmt * i) + 'deg) translateZ(' + (w / 2) + 'px) translateY(' + (h / 2) + 'px)';
                cylCon.appendChild(newSeg);
                if (e === true) {
                    var newTop = document.createElement('div');
                    newTop.className = 'cyl-cap';
                    newTop.style.borderLeft = (segw / 2) + 'px solid transparent';
                    newTop.style.borderRight = (segw / 2) + 'px solid transparent';
                    newTop.style.transform = 'rotateX(-90deg)';
                    $(newSeg).append(newTop);
                    var newBottom = document.createElement('div');
                    newBottom.className = 'cyl-cap';
                    newBottom.style.borderLeft = (segw / 2) + 'px solid transparent';
                    newBottom.style.borderRight = (segw / 2) + 'px solid transparent';
                    newBottom.style.transform = 'rotateX(-90deg) translateZ(' + h + 'px)';
                    $(newSeg).append(newBottom);
                }
            }
            //as a last step, we move the parent. Note that rotation happens AFTER translation.
            $(cylCon).css({ 'transform': 'translateX(' + t.x + 'px) translateY(' + t.y + 'px) translateZ(' + t.z + 'px) rotateX(' + o.x + 'deg) rotateY(' + o.y + 'deg) rotateZ(' + o.z + 'deg)' });
        }
    };
});

app.factory('movFact', function($rootScope) {
    var mouseStatus = [0, 0];
    return {
        handlePhoneCyc: function(o) {
            var oriObj = {
                FB: 30 * (o.x + 70) / 140,
                RL: 30 * (o.y + 70) / 140,
                pedals: 30 * (o.z + 70) / 140
            };
            return oriObj;
        },
        handlePhoneCol: function(o) {
            return 30 * (o.x + 70) / 140;
        },
        handleMouseOri: function(x, y, w, h, z) {
            var oriObj = {
                FB: -15 * (y - z.y) / (h / 2),
                RL: 15 * (x - z.x) / (w / 2)
            };
            return oriObj;
        },
        handleMouseThrot: function(y, h, z) {
            return 15 + (30 * (z.y - y) / (h));
        },
        handleMousePedal: function(c, m) {
            var ang = 0;
            if (m && m == 1) {
                //mousedown
                //first, we deal with the case where both buttons are down:
                if (c.button === 0 && mouseStatus[1]) {
                    mouseStatus[0] = 1;
                    ang = 0;
                } else if (c.button == 2 && mouseStatus[0]) {
                    mouseStatus[1] = 1;
                    ang = 0;
                } else if (c.button === 0) {
                    mouseStatus[0] = 1;
                    ang = -10;
                } else {
                    mouseStatus[1] = 1;
                    ang = 10;
                }
            } else if (c.button === 0 && mouseStatus[1] == 1) {
                mouseStatus[0] = 0;
                ang = 10;
            } else if (c.button == 2 && mouseStatus[0] == 1) {
                mouseStatus[1] = 0;
                ang = -10;
            } else {
                //no buttons currently down
                mouseStatus = [0, 0];
                return 0;
            }
            return ang;
        }
    };
});

app.factory('socket', function ($rootScope) {
  console.log('socket factory!');
  var socket = io.connect();
  console.log('socket factory!');
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () { 
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      });
    }
  };
});