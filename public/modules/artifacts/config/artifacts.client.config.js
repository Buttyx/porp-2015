'use strict';

// Configuring the Articles module
angular.module('artifacts').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Artifacts', 'artifacts', 'dropdown', '/artifacts(/create)?');
		Menus.addSubMenuItem('topbar', 'artifacts', 'List Artifacts', 'artifacts');
		Menus.addSubMenuItem('topbar', 'artifacts', 'New Artifact', 'artifacts/create');
	}
]);