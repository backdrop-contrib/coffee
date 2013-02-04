<?php
/**
 * @file
 * The hooks that are used by Coffee
 * includes an example of hook_coffee_commands().
 */

/**
 * Implements hook_coffee_commands().
 */
function coffee_coffee_commands() {
  global $user;
  $commands = array();

  // Add in a link for the frontpage.
  $commands[] = array(
    'value' => substr(url('<front>'), 0, 1),
    'label' => t('Go to front page'),
    'command' => ':front',
  );

  // Display the links of the node/add page.
  // The command is ":add" and includes the link_title to empower the
  // autocompletion.
  $path = 'node/add';
  $item = menu_get_item($path);
  $content_types = system_admin_menu_block($item);

  $command = ':add';
  foreach ($content_types as $content_type) {
    $commands[] = array(
      'value' => $content_type['link_path'],
      'label' => $content_type['link_title'],
      'command' => $command . ' ' . drupal_strtolower($content_type['link_title']),
    );
  }

  // Display the links of the user page.
  // The command is ":user" and includes the title to empower the
  // autocompletion.
  $user_menu = user_menu();
  $txt = array();
  $txt['my_account'] = $user_menu['user/%user']['title'];
  $txt['logout'] = $user_menu['user/logout']['title'];

  $command = ':user';
  foreach ($user_menu as $path => $menu_item) {
    if (strpos($path, 'user/%user/') !== 0) {
        continue;
    }
    if (strpos($path, 'user/%user/cancel') === 0) {
        continue;
    }
    $path = str_replace('%user', $user->uid, $path);
    $commands[] = array(
      'value' => $path,
      'label' => $txt['my_account'] . ' - ' . $menu_item['title'],
      'command' => $command . ' ' . drupal_strtolower($menu_item['title']),
    );
  }
  $commands[] = array(
    'value' => 'user/logout',
    'label' => $txt['logout'],
    'command' => $command . ' logout',
  );

  return $commands;

}
