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
