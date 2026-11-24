<?php
/**
 * Plugin Name: PromoCommunication Headless
 * Description: Collega WordPress al sito Next.js su Vercel: anteprima delle bozze, reindirizzamento del front, accesso GraphQL con password applicazione, aggiornamento del sito quando si pubblica.
 * Version: 1.0.0
 *
 * Si installa copiando questo file in wp-content/mu-plugins/ (la cartella va creata se non c'è). Non va attivato: WordPress lo carica da solo.
 *
 * Le impostazioni stanno in wp-config.php, sopra la riga "That's all, stop editing!":
 *
 *   define( 'PC_FRONTEND_URL', 'https://www.promocommunication.it' );   // indirizzo del sito pubblico (obbligatorio)
 *   define( 'PC_PREVIEW_SECRET', 'una-stringa-lunga-a-caso' );          // lo stesso valore di PREVIEW_SECRET su Vercel
 *   define( 'PC_DEPLOY_HOOK', 'https://api.vercel.com/v1/integrations/deploy/...' ); // facoltativo: Deploy Hook di Vercel
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/** Indirizzo del sito pubblico, senza barra finale. Vuoto se non configurato. */
function pc_front_url() {
	return defined( 'PC_FRONTEND_URL' ) ? untrailingslashit( PC_FRONTEND_URL ) : '';
}

/** Tipi di contenuto gestiti da questo plugin. */
function pc_post_types() {
	return array( 'progetto', 'membro', 'servizio', 'posizione', 'pagina' );
}

/** True per le richieste GraphQL (WPGraphQL). */
function pc_is_graphql() {
	return function_exists( 'is_graphql_http_request' ) && is_graphql_http_request();
}

/* ------------------------------------------------------------------------------------------------
 * 1. Anteprima: il tasto "Anteprima" dell'editor apre il sito Next, non il tema WordPress.
 * ---------------------------------------------------------------------------------------------- */
add_filter(
	'preview_post_link',
	function ( $link, $post ) {
		$front = pc_front_url();
		if ( ! $front || ! defined( 'PC_PREVIEW_SECRET' ) || ! in_array( $post->post_type, pc_post_types(), true ) ) {
			return $link;
		}
		return add_query_arg(
			array(
				'secret' => rawurlencode( PC_PREVIEW_SECRET ),
				'type'   => $post->post_type,
				'id'     => $post->ID,
				'slug'   => $post->post_name,
			),
			$front . '/api/preview'
		);
	},
	10,
	2
);

/* ------------------------------------------------------------------------------------------------
 * 2. Il front di WordPress non si vede: chi apre wp.promocommunication.it finisce sul sito vero.
 *    Restano raggiungibili wp-admin, wp-login, REST, GraphQL, cron e i file caricati.
 * ---------------------------------------------------------------------------------------------- */
add_action(
	'template_redirect',
	function () {
		$front = pc_front_url();
		if ( ! $front || is_admin() || pc_is_graphql() || ( defined( 'REST_REQUEST' ) && REST_REQUEST ) || is_preview() ) {
			return;
		}
		if ( wp_doing_cron() || wp_doing_ajax() ) {
			return;
		}
		wp_redirect( $front . '/', 301 );
		exit;
	},
	1
);

// Il dominio di WordPress non deve finire su Google.
add_filter( 'wp_robots', 'wp_robots_no_robots' );
add_action(
	'send_headers',
	function () {
		header( 'X-Robots-Tag: noindex, nofollow', true );
	}
);

/* ------------------------------------------------------------------------------------------------
 * 3. GraphQL con password applicazione: serve a leggere le bozze dal sito Next.
 *    Di norma le password applicazione valgono solo per REST: qui le estendiamo a GraphQL.
 * ---------------------------------------------------------------------------------------------- */
add_filter(
	'application_password_is_api_request',
	function ( $is_api ) {
		return $is_api || pc_is_graphql();
	}
);

/* ------------------------------------------------------------------------------------------------
 * 4. Quando si pubblica o si modifica un contenuto, avvisa Vercel (Deploy Hook) perché ricostruisca il sito.
 *    Più salvataggi ravvicinati diventano una sola richiesta, dopo 60 secondi.
 * ---------------------------------------------------------------------------------------------- */
function pc_schedule_deploy() {
	if ( ! defined( 'PC_DEPLOY_HOOK' ) || ! PC_DEPLOY_HOOK ) {
		return;
	}
	if ( ! wp_next_scheduled( 'pc_trigger_deploy' ) ) {
		wp_schedule_single_event( time() + 60, 'pc_trigger_deploy' );
	}
}

add_action(
	'transition_post_status',
	function ( $new, $old, $post ) {
		if ( ! in_array( $post->post_type, pc_post_types(), true ) ) {
			return;
		}
		// conta solo quando qualcosa è o era pubblicato (non le bozze)
		if ( 'publish' === $new || 'publish' === $old ) {
			pc_schedule_deploy();
		}
	},
	10,
	3
);
add_action( 'edited_categoria_progetto', 'pc_schedule_deploy' );
add_action( 'created_categoria_progetto', 'pc_schedule_deploy' );
add_action( 'delete_categoria_progetto', 'pc_schedule_deploy' );

add_action(
	'pc_trigger_deploy',
	function () {
		if ( defined( 'PC_DEPLOY_HOOK' ) && PC_DEPLOY_HOOK ) {
			wp_remote_post( PC_DEPLOY_HOOK, array( 'timeout' => 10, 'blocking' => false ) );
		}
	}
);
