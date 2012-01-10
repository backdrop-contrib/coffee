<?php
/**
 * @file
 * The hooks that are used by Coffee
 * includes an example of hook_coffee_action()
 */

/**
 * The default implementation of Coffee
 * It will look in the menu_links table for
 * administrative links based on the user input
 * @param string $input
 */
function coffee_redirect($input) {

  // glue the arguments together if there are more than 3 arguments
  // this happens when the user $input typed a / in the input field
  $arguments = arg();
  if (count($arguments) > 3) {
    $argument_query = array_splice($arguments, 3);
    $input = implode('/', $argument_query);
  }

  $input = '%' . check_plain($input) . '%';

  // build the query for the result set
  // it will look up items in the menu_links table
  // based on conditions to filter the result set
  // and limit the result set to 7

  $result = db_select('menu_links', 'ml')
  ->fields('ml', array('link_path', 'link_title') )
  ->condition('menu_name', 'management')
  ->condition(
  db_or()
    ->condition('link_path', $input, 'LIKE')
    ->condition('link_title', $input, 'LIKE')
  )
  // exclude % in link_path
  ->condition('link_path', '%\%%', 'NOT LIKE')

  // exclude 'help' in link_path
  ->condition('link_path', '%help%', 'NOT LIKE')

  // filter out empty link_title
  ->condition('link_title', '%%', '<>')

  // limit the result set to 7
  ->range(0, 7)
  ->execute();

  if (is_object($result)) {
    $return = array();
    foreach ($result as $record) {
      $return[] = array(
        'path' => $record->link_path,
        'title' => $record->link_title,
      );
    }

  }
  else {
    return FALSE;
  }


  return $return;

}

/**
 * Implements hook_coffee_action();
 * When you type :help in Coffee this hook will fire
 * @param string $op
 * @return
 * a array that can be used by Coffee
 * in this case a link to the Coffee help page
 */
function coffee_coffee_action($op) {
  switch ($op) {
    case 'help' :
      $return['help'] = array(
        'path' => 'admin/help/coffee',
        'title' => 'Coffee Help',
      );
      break;
  }

  if (isset($return)) {
    return $return;
  }
}
