
-- SUMMARY --

The Coffee module helps you to navigate through the Drupal admin faster,
inspired by Alfred and Spotlight (OS X).

For a full description of the module, visit the project page:
  http://drupal.org/sandbox/michaelmol/1356930

To submit bug reports and feature suggestions, or to track changes:
  http://drupal.org/project/issues/1356930


-- REQUIREMENTS --

None.


-- INSTALLATION --

* Install as usual, see http://drupal.org/node/70501 for further information.


-- CONFIGURATION --

* Configure user permissions in admin/people/permissions

  - access coffee

    Users in Roles with the "access coffee" permission can make use of the
    Coffee module. 


-- USAGE --

Toggle Coffee using the keyboard shortcut alt + D
(alt + shift + D in Opera, alt + ctrl + D in Windows Internet Explorer).

Type the first few characters of the task that you want to perform. Coffee
will try to find the right result in as less characters as possible.
For example, if you want to go the the Appearance admin page, type ap and
just hit enter.

If your search query returns multiple results, you can use the arrow up/down
keys to choose the one you were looking for.

This will work for all Drupal admin pages.


-- COFFEE COMMANDS --

Coffee provide a default command that you can use.

:add
Rapidly add content of a specific content type.


-- COFFEE HOOKS --

You can define your own commands in your module with hook_coffee_command(),
see coffee.api.php for further documentation.


-- CONTRIBUTORS --

Maintainer
- Michael Mol 'michaelmol' <http://drupal.org/user/919186>

JavaScript/CSS
- Maarten Verbaarschot 'maartenverbaarschot' <http://drupal.org/user/1305466>
