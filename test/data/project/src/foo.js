
define(function(require) {
	require('./index/bar');
	require('./toplevel/main');
	require('./case-insensitive/Bar');
	require('underscore');
	function init() {
		console.log('this is main-foo init');
	}
    return {init: init};
});
