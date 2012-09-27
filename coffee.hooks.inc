<?php
/**
 * @file
 * The hooks that are used by Coffee
 * includes an example of hook_coffee_commands().
 */

/**
 * Implements hook_coffee_commands().
 */
function coffee_coffee_commands($op) {
  $commands = array();

  // Display the links of the node/add page.
  // The command is ":add" and includes the link_title to empower the
  // autocompletion.
  $path = 'node/add';
  $item = menu_get_item($path);
  $content_types = system_admin_menu_block($item);
  foreach ($content_types as $content_type) {
    $command = ':add';
    $commands[] = array(
      'value' => $content_type['link_path'],
      'label' => $content_type['link_title'],
      'command' => ':add ' . $content_type['link_title'],
    );
  }

  return $commands;
}
