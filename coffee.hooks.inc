<?php
/**
 * @file
 * The hooks that are used by Coffee
 * includes an example of hook_coffee_command()
 */

/**
 * Implements hook_coffee_commands().
 */
function coffee_coffee_commands($op) {
  $commands = array();

  // Display the links of the node/add page.
  $path = 'node/add';
  $item = menu_get_item($path);
  $content_types = system_admin_menu_block($item);

  foreach ($content_types as $content_type) {
    $commands[] = array(
      'value' => $content_type['link_path'],
      'label' => $content_type['link_title'],
      'command' => ':add'
    );
  }

  return $commands;
}
