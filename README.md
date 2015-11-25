Coffee
---------------------

The Coffee module helps you to navigate through the Backdrop admin faster, inspired by Alfred and Spotlight (OS X).

CONTENTS OF THIS FILE
---------------------

 - Introduction
 - Tested
 - Known Issues
 - Special Thanks
 - Requirements
 - Installation
 - Coming From Drupal?
 - Usage
 - License
 - Credits
 - Maintainers

TESTED
-----

Working perfectly in Backdrop 1.2+.

KNOWN ISSUES
---------------------

Custom coffee hooks have not yet been tested yet.

SPECIAL THANKS
--------------

Maintainer
- Michael Mol 'michaelmol' <http://drupal.org/user/919186>

Co-maintainer
- Alli Price 'heylookalive' <http://drupal.org/user/431193>

JavaScript/CSS/Less
- Maarten Verbaarschot 'maartenverbaarschot' <http://drupal.org/user/1305466>

REQUIREMENTS
------------

Requires Javascript enabled and the menu module.

INSTALLATION
------------

Install this module using the official Backdrop CMS instructions at https://backdropcms.org/guide/modules

COMING FROM DRUPAL?
-------------------

global Language->language is now Language->langcode

PERMISSIONS
------------

yes, this module installs permissions for your roles to use

USAGE
-----

By default the management menu is included in the results.
Go to the config page at admin/config/user-interface/coffee to select other menus.

Toggle Coffee using the keyboard shortcut alt + D
(alt + shift + D in Opera, alt + ctrl + D in Windows Internet Explorer).

Type the first few characters of the task that you want to perform. Coffee
will try to find the right result in as less characters as possible.
For example, if you want to go the the Appearance admin page, type ap and
just hit enter.

If your search query returns multiple results, you can use the arrow up/down
keys to choose the one you were looking for.

This will work for all Backdrop admin pages.

If the Devel module is installed it will also look for items that Devel
generates. For example; type 'clear' to get devel/cache/clear as result.

-- UPGRADE PATH --

If you had Coffee 1.x installed, make sure to run update.php as it will install
a cache table for the prefetching the Coffee results.

If you have implemented the hook hook_coffee_command() make sure to rewrite it
to the newly hook_coffee_commands(), see coffee.api.php for an example.

-- COFFEE COMMANDS --

Coffee provides default commands that you can use.

:add
Rapidly add a node of a specific content type.

-- COFFEE HOOKS --

You can define your own commands in your module with hook_coffee_commands(),
see coffee.api.php for further documentation.


LICENSE
-------

This project is GPL v2 software. See the LICENSE.txt file in this directory for complete text.

CREDITS
-----------

This module is based on the Coffee module for Drupal, originally written and maintained by a large number of contributors, including:

Michael Mol 'michaelmol' <http://drupal.org/user/919186>

Alli Price 'heylookalive' <http://drupal.org/user/431193>

Maarten Verbaarschot 'maartenverbaarschot' <http://drupal.org/user/1305466>

MAINTAINERS
-----------

- seeking

Ported to Backdrop by:

- biolithic <https://github.com/biolithic>
