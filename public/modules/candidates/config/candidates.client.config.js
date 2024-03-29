'use strict';

// Configuring the Articles module
angular.module('candidates').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Candidates', 'candidates', 'dropdown', '/candidates(/create)?');
		Menus.addSubMenuItem('topbar', 'candidates', 'List candidates', 'candidates');
		Menus.addSubMenuItem('topbar', 'candidates', 'New candidate', 'candidates/create');
	}
]);
