<?php

/**
 * @file
 * Admin page callbacks for the coffee module.
 */

/**
 * Form builder; Configure coffee settings.
 *
 * @ingroup forms
 * @see system_settings_form()
 */
function coffee_admin_settings() {
  $form = array();

  $form['help'] = array(
    '#markup' => '<label>Toggle Coffee</label><p>Toggle Coffee using the keyboard shortcut alt + D (alt + shift + D in Opera, alt + ctrl + D in Windows Internet Explorer). You can also use use the alternative alt + k.</p>',
  );

  // Output the checkboxes to let admins select which menus are featured.
  $menus = menu_get_menus();
  $menu_options = array();

  foreach ($menus as $name => $title) {
    $menu_options[$name] = check_plain($title);
  }

  if (!empty($menu_options)) {
    $form['coffee_settings_menus'] = array(
      '#type' => 'checkboxes',
      '#title' => t('Menus to include in Coffee'),
      '#options' => $menu_options,
      '#default_value' => config_get('coffee.settings', 'coffee_settings_menus'),
      '#description' => 'Select the menus to include in Coffee, changes will be active after a cache clear.',
    );
  }

  $form['actions']['#type']  = 'actions';
  $form['actions']['submit'] = array(
    '#type' => 'submit',
    '#value' => t('Save configuration'),
  );

  return $form;
}

/**
 * Function coffee_admin_settings_submit().
 */
function coffee_admin_settings_submit($form, &$form_state) {
  foreach ($form_state['values'] as $key => $value) {
    if (is_array($value) && isset($form_state['values']['array_filter'])) {
      $value = array_keys(array_filter($value));
    }
    config_set('coffee.settings', $key, $value);
  }

  backdrop_set_message(t('The configuration options have been saved.'));

  // As we're altering which menus are being included in Coffee, rebuild the
  // cached commands for users so they get these changes.
  cache_clear_all(NULL, 'cache_coffee');
}
