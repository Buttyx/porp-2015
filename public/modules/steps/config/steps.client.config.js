'use strict';

// Configuring the Articles module
angular.module('steps').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Steps', 'steps', 'dropdown', '/steps(/create)?');
		Menus.addSubMenuItem('topbar', 'steps', 'List Steps', 'steps');
		Menus.addSubMenuItem('topbar', 'steps', 'New Step', 'steps/create');
	}
]);