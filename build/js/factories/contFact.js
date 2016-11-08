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
                r:r
            });
        }
    };
});
