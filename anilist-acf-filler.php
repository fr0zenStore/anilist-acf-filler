<?php
/*
Plugin Name: AniList ACF Filler
Description: Riempie i campi ACF tramite ID di un anime da AniList.
Version: 1.0
Author: fr0zen
*/

// Enqueue dello script JavaScript
add_action('admin_enqueue_scripts', function() {
    wp_enqueue_script(
        'anilist-acf-filler-js',
        plugin_dir_url(__FILE__) . 'js/filler.js',
        array('jquery'),
        '1.0',
        true
    );
});

// Aggiungi il pulsante nel post editor
add_action('edit_form_after_title', function($post) {
    // Verifica che sia un post e non un custom post type
    if ($post->post_type !== 'post') return;
    ?>
    <div style="margin-bottom: 20px;">
        <label for="anime_id">ID Anime AniList:</label>
        <input type="text" id="anime_id" placeholder="Inserisci l'ID anime" />
        <button type="button" id="fill_fields">Riempire i campi</button>
    </div>
    <?php
});
?>
