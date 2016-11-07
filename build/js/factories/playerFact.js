app.factory('playerFact', function($rootScope) {
    return {
        func: function(inp) {
            return inp*2;
        },
    };
});