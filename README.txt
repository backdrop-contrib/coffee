Coffee is a module that helps site administrator to navigate real fast through the admin pages.
When you hit alt+d a search box appears and you can type directly the page you'll looking for.

There is also the possibility to create your own list with the hook_coffee_command($op)
see coffee.api.php for documentation. 

It is inspired by Alfred / Spotlight on OS X.

Usage:
- alt + d: to open or close Coffee
(alt + shift + d in opera)
(ctrl + alt + d in Internet Explorer)
- esc: close Coffee
- type directly the page you're looking for (path or title)
- hit enter to visit the first result
- navigate in the result list with arrow down and arrow up
- hit enter to visit that result
- commands that are defined by hook_coffee_command() always have a colon prefix, e.g. :help


Default command:
:add
Will return a list of the Add content page, so you can quickly add content.

:help
Will return a link to the help page
