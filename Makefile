run: core.js
	python3 -m http.server

core.js:
	curl -O https://raw.githubusercontent.com/calaldees/libs/master/es6/core.js

link_local_core.js:
	ln -s ../libs/es6/core.js core.js
