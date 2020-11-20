This Client Library (clientlib) is here to simplify instance wide customizations to the base omniscript displays.
The content stored here will load after the core files, and should be used for customizations that override or have dependencies on the core files.
No files or folders have been included in ththis clientlib in the package in order to avoid the possibility of new packages overwriting existing customizations.
The package will automatically overwrite files including the the substrings [Ss]ample or readme

=== Folder Structure ===

 /apps/vloc/clientlibs
 ├ oout
 └ ooutConfig
   ├ css
   | ├ filename.css
   | └ ...
   ├ js
   | ├ setting.js
   | ├ filename.js
   | ├ ...
   | └ custom_setting.js
   ├ css.txt
   └ js.txt

=== ooutCustomConfig ===
This clientlib is for customizations that load after the core settings before the core files, such as settings overrides or JavaScript with no dependencies on the oout core files.

=== ooutCustomOverrides ===
This clientlib is for customizations that load after the core files, such as JavaScript and CSS that override standard behaviors.

=== Index Files ===
The files named js.txt or css.txt are default indicies which list included files and their load orders. These index files should have the following format:

----- css.txt Begin -----
#base=css

filename.css
...
----- css.txt End -----

where #base is set to the base directory of the files (eg. /apps/vloc/clientlibs/custom/ooutCustomConfig/css) relative to the root directory of the clientlib (eg. /apps/vloc/clientlibs/custom/ooutCustomConfig).

=== Settings Overrides ===
/apps/vloc/clientlibs/ooutConfig/js/custom_setting.js
This file is for instance wide customizations to the omniscript settings. It is called explicity in the omniscript page components to ensure its proper place in the load order, and therefore does not need to be listed in the Index file and cannot be moved.
As a consequence of it being explicitly called, but not included in the package the OmniScript page will generate an error unless this file is created.
If you do not have settings customizations this error can be ignored.