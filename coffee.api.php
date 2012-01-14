<?php

/**
 * @file
 * Hooks provided by Coffee module.
 */

/**
 * @addtogroup hooks
 * @{
 */

/**
 * Extend the Coffee functionallity with your own commands.
 *
 * This hook is run when the input in Coffee starts with a colon (:), it passes
 * the keyword after the colon as parameter to the hook.
 *
 * You can define your own operators.
 *
 * @param string $op
 *   This is the keyword used after the colon.
 *
 * @return array
 *   An associative array whose keys are unique and whose values are an
 *   associative array containing:
 *   - title: A string used to display the title.
 *   - path: A string used for redirection to the path.
 *
 *   Although there isn't a limitation of a maximum number of items to display,
 *   please consider a maximum of 7 items or less, this because of the
 *   usability of Coffee.
 */
function hook_coffee_command($op) {

  switch ($op) {
    // Is called when a user inputs :your operator.
    case 'your operator':

      $return = array(
        'item 1' => array(
          'path' => '',
          'title' => '',
        ),
        'item 2' => array(
          'path' => '',
          'title' => '',
        ),
      );
      break;
  }

  if (isset($return)) {
    return $return;
  }

}

/**
 * @} End of "addtogroup hooks"
 */
