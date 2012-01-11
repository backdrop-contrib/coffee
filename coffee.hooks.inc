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

  $query = db_select('menu_links', 'ml');

  // join menu_router table so that the menu link description also can be searched
  $query->innerJoin('menu_router', 'mr', 'ml.link_path = mr.path');

  $query->fields('ml', array('link_path', 'link_title') );

  $query->condition('ml.menu_name', 'management')
  ->condition(
  db_or()
    ->condition('ml.link_path', $input, 'LIKE')
    ->condition('ml.link_title', $input, 'LIKE')
    ->condition('mr.description', $input, 'LIKE')
  )
  // exclude % in link_path
  ->condition('ml.link_path', '%\%%', 'NOT LIKE')

  // exclude 'help' in link_path
  ->condition('ml.link_path', '%help%', 'NOT LIKE')

  // filter out empty link_title
  ->condition('ml.link_title', '%%', '<>')

  // search also in the description of a menu link in the menu_router table
  //->condition('mr.description', $input, 'LIKE')

  // limit the result set to 7
  ->range(0, 7);

  $result = $query->execute();

  if (is_object($result)) {
    $return = array();
    foreach ($result as $record) {
      $return[] = array(
        'path' => $record->link_path,
        'title' => $record->link_title,
        'description' => $record->description,
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
