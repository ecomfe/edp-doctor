
define(function(require) {
	require('../index/bar');
	require('toplevel/main')
	function init() {
		console.log('this is foo init');
	}
    return {init: init};
});
