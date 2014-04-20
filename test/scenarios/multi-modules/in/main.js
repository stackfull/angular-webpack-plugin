
angular.module('common', []);

angular.module('common').config(function(){});

angular.module('mod1', ['common']);
angular.module('mod2', ['common']);

angular.module('mod2').config(function(){});

angular.module('myModule', ['mod1', 'mod2']);
