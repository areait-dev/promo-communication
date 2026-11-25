<?php
/**
 * Plugin Name: PromoCommunication Headless
 * Description: WordPress solo come CMS del sito Next.js su Vercel: tipi di contenuto e categorie, campi ACF da /acf-json con la regola "Slug pagina", anteprima delle bozze, reindirizzamento del front, accesso con password applicazione, aggiornamento immediato del sito quando si pubblica, testi SEO di Yoast per il sito (campo REST pc_seo).
 * Version: 2.3.1
 *
 * Si installa copiando questo file in wp-content/mu-plugins/ (la cartella va creata se non c'è). Non va attivato: WordPress lo carica da solo.
 * I campi ACF stanno in wp-content/acf-json/ (copia della cartella wordpress/acf-json del progetto): si attivano da
 * ACF → Gruppi di campi → "Sincronizzazione disponibile".
 *
 * Le impostazioni stanno in wp-config.php, sopra la riga "That's all, stop editing!":
 *
 *   define( 'PC_FRONTEND_URL', 'https://www.promocommunication.it' );   // indirizzo del sito pubblico (obbligatorio)
 *   define( 'PC_PREVIEW_SECRET', 'una-stringa-lunga-a-caso' );          // lo stesso valore di PREVIEW_SECRET su Vercel
 *   define( 'PC_REVALIDATE_TOKEN', 'un-altra-stringa-lunga-a-caso' );   // lo stesso valore di REVALIDATE_TOKEN su Vercel
 *
 * Requisiti: ACF gratuito 6.1+, Yoast SEO e ACF Content Analysis for Yoast SEO. Per GraphQL anche WPGraphQL,
 * WPGraphQL for ACF e Add WPGraphQL SEO; la REST nativa funziona senza (Yoast arriva in yoast_head_json).
 * I tipi di contenuto e la tassonomia si registrano qui: non vanno creati in ACF → Tipi di contenuto / Tassonomie.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/** Indirizzo del sito pubblico, senza barra finale. Vuoto se non configurato. */
function pc_front_url() {
	return defined( 'PC_FRONTEND_URL' ) ? untrailingslashit( PC_FRONTEND_URL ) : '';
}

/** Tipi di contenuto gestiti da questo plugin (le Pagine contengono i testi del sito). */
function pc_post_types() {
	return array( 'progetto', 'membro', 'servizio', 'posizione', 'page' );
}

/**
 * Pagine WordPress con i testi del sito: slug → percorso pubblico.
 * Stessi slug di PAGINE in scripts/genera-acf-json.mjs: ogni slug ha il suo gruppo di campi.
 */
function pc_pagine() {
	return array(
		'home'               => '/',
		'chi-siamo'          => '/chi-siamo',
		'servizi'            => '/servizi',
		'portfolio'          => '/portfolio',
		'team'               => '/team',
		'contatti'           => '/contatti',
		'lavora-con-noi'     => '/lavora-con-noi',
		'privacy'            => '/privacy',
		'pagina-non-trovata' => '/',
		'impostazioni'       => '/',
	);
}

/** True per le richieste GraphQL (WPGraphQL). */
function pc_is_graphql() {
	return function_exists( 'is_graphql_http_request' ) && is_graphql_http_request();
}

/* ------------------------------------------------------------------------------------------------
 * 1. Tipi di contenuto e tassonomia (REST: /wp/v2/progetti, /membri, /servizi, /posizioni, /categorie-progetto)
 * ---------------------------------------------------------------------------------------------- */

/** Etichette italiane per un tipo di contenuto. */
function pc_etichette( $plurale, $singolare, $nuovo, $tutti ) {
	return array(
		'name'               => $plurale,
		'singular_name'      => $singolare,
		'menu_name'          => $plurale,
		'all_items'          => $tutti,
		'add_new'            => 'Aggiungi',
		'add_new_item'       => $nuovo,
		'edit_item'          => 'Modifica ' . strtolower( $singolare ),
		'new_item'           => $nuovo,
		'view_item'          => 'Vedi ' . strtolower( $singolare ),
		'search_items'       => 'Cerca',
		'not_found'          => 'Nessun elemento trovato',
		'not_found_in_trash' => 'Nessun elemento nel cestino',
	);
}

add_action(
	'init',
	function () {
		// Impostazioni comuni: si gestiscono dal pannello e si leggono da REST e GraphQL, ma non hanno pagine WordPress pubbliche.
		$comuni = array(
			'public'              => true,
			'publicly_queryable'  => false,
			'exclude_from_search' => true,
			'show_in_nav_menus'   => false,
			'show_in_admin_bar'   => false,
			'has_archive'         => false,
			'show_in_rest'        => true,
			'show_in_graphql'     => true,
			'supports'            => array( 'title', 'revisions' ),
		);

		$tipi = array(
			'progetto'  => array(
				'labels'              => pc_etichette( 'Progetti', 'Progetto', 'Aggiungi progetto', 'Tutti i progetti' ),
				'rest_base'           => 'progetti',
				'graphql_single_name' => 'Progetto',
				'graphql_plural_name' => 'Progetti',
				'menu_icon'           => 'dashicons-portfolio',
				'menu_position'       => 5,
				'taxonomies'          => array( 'categoria_progetto' ),
			),
			'servizio'  => array(
				'labels'              => pc_etichette( 'Servizi', 'Servizio', 'Aggiungi servizio', 'Tutti i servizi' ),
				'rest_base'           => 'servizi',
				'graphql_single_name' => 'Servizio',
				'graphql_plural_name' => 'Servizi',
				'menu_icon'           => 'dashicons-megaphone',
				'menu_position'       => 6,
			),
			'membro'    => array(
				'labels'              => pc_etichette( 'Team', 'Membro del team', 'Aggiungi membro del team', 'Tutto il team' ),
				'rest_base'           => 'membri',
				'graphql_single_name' => 'Membro',
				'graphql_plural_name' => 'Membri',
				'menu_icon'           => 'dashicons-groups',
				'menu_position'       => 7,
			),
			'posizione' => array(
				'labels'              => pc_etichette( 'Posizioni aperte', 'Posizione aperta', 'Aggiungi posizione aperta', 'Tutte le posizioni' ),
				'rest_base'           => 'posizioni',
				'graphql_single_name' => 'Posizione',
				'graphql_plural_name' => 'Posizioni',
				'menu_icon'           => 'dashicons-id-alt',
				'menu_position'       => 8,
			),
		);

		foreach ( $tipi as $tipo => $argomenti ) {
			register_post_type( $tipo, array_merge( $comuni, $argomenti ) );
		}

		// Nelle Pagine i testi stanno solo nei campi ACF: senza l'editor a blocchi resta una schermata con i soli campi.
		remove_post_type_support( 'page', 'editor' );
		remove_post_type_support( 'page', 'comments' );
		remove_post_type_support( 'page', 'thumbnail' );

		register_taxonomy(
			'categoria_progetto',
			array( 'progetto' ),
			array(
				'labels'              => array(
					'name'          => 'Categorie progetto',
					'singular_name' => 'Categoria',
					'menu_name'     => 'Categorie progetto',
					'all_items'     => 'Tutte le categorie',
					'edit_item'     => 'Modifica categoria',
					'add_new_item'  => 'Aggiungi categoria',
					'not_found'     => 'Nessuna trovata',
				),
				'public'              => true,
				'publicly_queryable'  => false,
				'hierarchical'        => false,
				'show_in_nav_menus'   => false,
				'show_tagcloud'       => false,
				'show_admin_column'   => true,
				'show_in_rest'        => true,
				'rest_base'           => 'categorie-progetto',
				'show_in_graphql'     => true,
				'graphql_single_name' => 'CategoriaProgetto',
				'graphql_plural_name' => 'CategorieProgetto',
				'rewrite'             => false,
			)
		);
	}
);

// Categorie con slug fissi: il sito le usa per i filtri del portfolio e per collegare i servizi ai progetti.
// Si creano una sola volta; quelle che esistono già non vengono toccate.
add_action(
	'init',
	function () {
		if ( get_option( 'pc_categorie_v1' ) || ! taxonomy_exists( 'categoria_progetto' ) ) {
			return;
		}
		$categorie = array(
			'brand-identity'      => 'Brand Identity',
			'digital-web'         => 'Digital & Web',
			'event-management'    => 'Event Management',
			'shooting-foto-video' => 'Shooting foto/video',
			'social-media'        => 'Social Media',
		);
		foreach ( $categorie as $slug => $nome ) {
			if ( ! term_exists( $slug, 'categoria_progetto' ) ) {
				wp_insert_term( $nome, 'categoria_progetto', array( 'slug' => $slug ) );
			}
		}
		update_option( 'pc_categorie_v1', 1, false );
	},
	20
);

// Le bozze non hanno ancora uno slug: lo si assegna al primo salvataggio, così compaiono subito i campi
// della pagina (regola "Slug pagina") e l'anteprima trova il contenuto.
add_filter(
	'wp_insert_post_data',
	function ( $dati, $postarr ) {
		if (
			in_array( $dati['post_type'], pc_post_types(), true )
			&& in_array( $dati['post_status'], array( 'draft', 'pending' ), true )
			&& '' === $dati['post_name']
			&& '' !== trim( $dati['post_title'] )
		) {
			$dati['post_name'] = wp_unique_post_slug(
				sanitize_title( $dati['post_title'] ),
				isset( $postarr['ID'] ) ? (int) $postarr['ID'] : 0,
				'publish',
				$dati['post_type'],
				isset( $dati['post_parent'] ) ? (int) $dati['post_parent'] : 0
			);
		}
		return $dati;
	},
	10,
	2
);

/* ------------------------------------------------------------------------------------------------
 * 2. ACF: campi da wp-content/acf-json e regola di posizione "Slug pagina"
 * ---------------------------------------------------------------------------------------------- */

// I gruppi di campi versionati nel progetto (wordpress/acf-json) si copiano in wp-content/acf-json e si attivano con "Sincronizza".
add_filter(
	'acf/settings/load_json',
	function ( $percorsi ) {
		$percorsi[] = WP_CONTENT_DIR . '/acf-json';
		return $percorsi;
	}
);
add_filter(
	'acf/settings/save_json',
	function () {
		return WP_CONTENT_DIR . '/acf-json';
	}
);

// Regola di posizione: {"param":"page_slug","operator":"==","value":"home"}.
// Lega un gruppo di campi a una Pagina per slug: non dipende dagli ID, quindi vale su ogni installazione.
add_action(
	'acf/init',
	function () {
		if ( ! function_exists( 'acf_register_location_type' ) || ! class_exists( 'ACF_Location' ) ) {
			return;
		}

		if ( ! class_exists( 'PC_ACF_Location_Page_Slug' ) ) {
			class PC_ACF_Location_Page_Slug extends ACF_Location {
				public function initialize() {
					$this->name        = 'page_slug';
					$this->label       = 'Slug pagina';
					$this->category    = 'page';
					$this->object_type = 'post';
				}

				// Nella lista dei gruppi di campi la regola compare come "Pagine" (non "Articoli").
				public function get_object_subtype( $rule ) {
					return 'page';
				}

				public function get_values( $rule ) {
					$scelte = array();
					foreach ( array_keys( pc_pagine() ) as $slug ) {
						$scelte[ $slug ] = $slug;
					}
					$pagine = get_posts(
						array(
							'post_type'      => 'page',
							'post_status'    => array( 'publish', 'draft', 'pending', 'private' ),
							'posts_per_page' => 200,
							'orderby'        => 'title',
							'order'          => 'ASC',
						)
					);
					foreach ( $pagine as $pagina ) {
						if ( '' !== $pagina->post_name ) {
							$scelte[ $pagina->post_name ] = sprintf( '%s (%s)', $pagina->post_title, $pagina->post_name );
						}
					}
					return $scelte;
				}

				public function match( $rule, $screen, $field_group ) {
					$id = isset( $screen['post_id'] ) ? (int) $screen['post_id'] : 0;
					if ( ! $id ) {
						return false;
					}
					$post = get_post( $id );
					if ( ! $post || 'page' !== $post->post_type ) {
						return false; // la regola vale solo per le Pagine, anche con "!="
					}
					$uguale = ( $post->post_name === $rule['value'] );
					return ( '!=' === $rule['operator'] ) ? ! $uguale : $uguale;
				}
			}
		}

		acf_register_location_type( 'PC_ACF_Location_Page_Slug' );
	}
);

/* ------------------------------------------------------------------------------------------------
 * 3. Anteprima: il tasto "Anteprima" dell'editor apre il sito Next, non il tema WordPress.
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
 * 4. Il front di WordPress non si vede: chi apre wp.promocommunication.it finisce sul sito vero.
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
 * 5. Yoast SEO: titolo, descrizione, immagine social e semafori si gestiscono in Yoast.
 *    Gli indirizzi che Yoast scrive (canonical, Open Graph) puntano al sito pubblico, non a WordPress.
 *    I semafori leggono i campi ACF grazie al plugin "ACF Content Analysis for Yoast SEO".
 * ---------------------------------------------------------------------------------------------- */

/** Percorso pubblico di un contenuto sul sito Next.js, o null se non ha una pagina sua. */
function pc_percorso_pubblico( $post ) {
	if ( ! $post instanceof WP_Post ) {
		return null;
	}
	switch ( $post->post_type ) {
		case 'page':
			$pagine = pc_pagine();
			return isset( $pagine[ $post->post_name ] ) ? $pagine[ $post->post_name ] : null;
		case 'progetto':
			return '/portfolio/' . $post->post_name;
		case 'servizio':
			return '/servizi/' . $post->post_name;
		case 'membro':
			return '/team';
		case 'posizione':
			return '/lavora-con-noi';
	}
	return null;
}

/** Indirizzo pubblico del contenuto che Yoast sta descrivendo; se non si sa, lascia quello di Yoast. */
function pc_url_yoast( $url, $presentation = null ) {
	$front = pc_front_url();
	if ( ! $front ) {
		return $url;
	}
	$post = null;
	if ( is_object( $presentation ) && isset( $presentation->model ) && 'post' === $presentation->model->object_type ) {
		$post = get_post( (int) $presentation->model->object_id );
	} elseif ( is_singular() ) {
		$post = get_queried_object();
	}
	$percorso = pc_percorso_pubblico( $post );
	if ( null === $percorso ) {
		return $url;
	}
	return '/' === $percorso ? $front . '/' : $front . $percorso;
}
add_filter( 'wpseo_canonical', 'pc_url_yoast', 10, 2 );
add_filter( 'wpseo_opengraph_url', 'pc_url_yoast', 10, 2 );

// Nei titoli di Yoast (%%sitename%%) il nome si scrive sempre "Promo Communication", anche se il titolo del sito in
// Impostazioni → Generali è diverso: "Chi siamo | Promo Communication".
add_filter(
	'wpseo_replacements',
	function ( $sostituzioni ) {
		if ( isset( $sostituzioni['%%sitename%%'] ) ) {
			$sostituzioni['%%sitename%%'] = 'Promo Communication';
		}
		return $sostituzioni;
	}
);

// La mappa del sito la pubblica il sito Next.js (sitemap.ts): quella di Yoast punterebbe al dominio di WordPress.
add_filter( 'wpseo_enable_xml_sitemap', '__return_false' );

// Il riquadro di Yoast compare anche sui tipi di contenuto senza pagine WordPress pubbliche.
add_filter(
	'wpseo_accessible_post_types',
	function ( $tipi ) {
		foreach ( pc_post_types() as $tipo ) {
			$tipi[ $tipo ] = $tipo;
		}
		return $tipi;
	}
);

/**
 * Testi SEO scritti in Yoast, per il sito Next.js: campo REST "pc_seo" su pagine, progetti e servizi.
 * Contiene solo quello che è stato compilato nel riquadro di Yoast (con le variabili %%title%%, %%sep%%… già
 * sostituite); i campi lasciati vuoti mancano e il sito usa i suoi testi. yoast_head_json invece riempie sempre
 * tutto con i modelli di Yoast, e il sito non saprebbe distinguere un testo scritto da uno automatico.
 */
function pc_seo_rest( $dati ) {
	$post = get_post( (int) $dati['id'] );
	if ( ! $post instanceof WP_Post ) {
		return null;
	}
	$testo = function ( $chiave ) use ( $post ) {
		$grezzo = trim( (string) get_post_meta( $post->ID, '_yoast_wpseo_' . $chiave, true ) );
		if ( '' === $grezzo ) {
			return null;
		}
		$pronto = function_exists( 'wpseo_replace_vars' ) ? wpseo_replace_vars( $grezzo, $post ) : $grezzo;
		$pronto = trim( preg_replace( '/\s+/', ' ', wp_strip_all_tags( html_entity_decode( (string) $pronto, ENT_QUOTES, 'UTF-8' ) ) ) );
		return '' === $pronto ? null : $pronto;
	};

	$immagine = null;
	$img_id   = (int) get_post_meta( $post->ID, '_yoast_wpseo_opengraph-image-id', true );
	$img_url  = trim( (string) get_post_meta( $post->ID, '_yoast_wpseo_opengraph-image', true ) );
	if ( $img_id && ( $src = wp_get_attachment_image_src( $img_id, 'full' ) ) ) {
		$immagine = array( 'url' => $src[0], 'width' => (int) $src[1], 'height' => (int) $src[2] );
	} elseif ( '' !== $img_url ) {
		$immagine = array( 'url' => $img_url );
	}

	$seo = array_filter(
		array(
			'title'          => $testo( 'title' ),
			'description'    => $testo( 'metadesc' ),
			'og_title'       => $testo( 'opengraph-title' ),
			'og_description' => $testo( 'opengraph-description' ),
			'og_image'       => $immagine,
			// "1" = l'editor ha scelto "No" a "Consentire ai motori di ricerca di mostrare questo contenuto?".
			'noindex'        => '1' === (string) get_post_meta( $post->ID, '_yoast_wpseo_meta-robots-noindex', true ) ? true : null,
		),
		function ( $v ) {
			return null !== $v;
		}
	);
	return (object) $seo;
}
add_action(
	'rest_api_init',
	function () {
		register_rest_field(
			array( 'page', 'progetto', 'servizio' ),
			'pc_seo',
			array(
				'get_callback' => 'pc_seo_rest',
				'schema'       => array(
					'description' => 'Testi SEO compilati in Yoast (solo quelli non vuoti).',
					'type'        => 'object',
					'context'     => array( 'view', 'edit' ),
				),
			)
		);
	}
);

/* ------------------------------------------------------------------------------------------------
 * 6. Sicurezza: niente XML-RPC, niente versione di WordPress in vista, intestazioni di base.
 * ---------------------------------------------------------------------------------------------- */
add_filter( 'xmlrpc_enabled', '__return_false' );
remove_action( 'wp_head', 'wp_generator' );
add_filter( 'the_generator', '__return_empty_string' );
add_filter(
	'wp_headers',
	function ( $intestazioni ) {
		unset( $intestazioni['X-Pingback'] );
		return $intestazioni;
	}
);

function pc_headers_sicurezza() {
	header( 'X-Content-Type-Options: nosniff' );
	header( 'X-Frame-Options: SAMEORIGIN' );
}
add_action( 'send_headers', 'pc_headers_sicurezza' );
add_action( 'admin_init', 'pc_headers_sicurezza' );

/* ------------------------------------------------------------------------------------------------
 * 7. Password applicazione anche per GraphQL: serve a leggere le bozze dal sito Next.
 *    Di norma le password applicazione valgono solo per la REST.
 * ---------------------------------------------------------------------------------------------- */
add_filter(
	'application_password_is_api_request',
	function ( $is_api ) {
		return $is_api || pc_is_graphql();
	}
);

/* ------------------------------------------------------------------------------------------------
 * 8. Aggiornamento immediato del sito (come in Cultivar): quando un contenuto pubblicato cambia, WordPress chiama
 *    POST <PC_FRONTEND_URL>/api/revalidate con il codice PC_REVALIDATE_TOKEN (uguale a REVALIDATE_TOKEN su Vercel).
 *    Il sito rilegge i dati di WordPress alla visita successiva: niente nuovo deploy. Gli errori finiscono in debug.log.
 * ---------------------------------------------------------------------------------------------- */
function pc_revalidate( $cosa = array() ) {
	static $inviati = array();

	$front = pc_front_url();
	if ( ! $front || ! defined( 'PC_REVALIDATE_TOKEN' ) || ! PC_REVALIDATE_TOKEN ) {
		error_log( '[promocommunication] aggiornamento del sito saltato: PC_FRONTEND_URL o PC_REVALIDATE_TOKEN mancanti in wp-config.php' ); // phpcs:ignore
		return;
	}
	// Una sola chiamata per contenuto nella stessa richiesta (WordPress può salvare più volte).
	$chiave = wp_json_encode( $cosa );
	if ( isset( $inviati[ $chiave ] ) ) {
		return;
	}
	$inviati[ $chiave ] = true;

	$risposta = wp_remote_post(
		$front . '/api/revalidate',
		array(
			'timeout' => 5,
			'headers' => array(
				'Content-Type'          => 'application/json',
				'X-WP-Revalidate-Token' => PC_REVALIDATE_TOKEN,
			),
			'body'    => wp_json_encode( $cosa ),
		)
	);
	if ( is_wp_error( $risposta ) ) {
		error_log( '[promocommunication] aggiornamento del sito non riuscito: ' . $risposta->get_error_message() ); // phpcs:ignore
	} elseif ( (int) wp_remote_retrieve_response_code( $risposta ) >= 300 ) {
		error_log( '[promocommunication] aggiornamento del sito: risposta ' . wp_remote_retrieve_response_code( $risposta ) ); // phpcs:ignore
	}
}

/** Avvisa il sito per un contenuto, se è uno dei tipi gestiti e non è una revisione o un salvataggio automatico. */
function pc_revalidate_post( $post ) {
	if ( ! $post instanceof WP_Post || ! in_array( $post->post_type, pc_post_types(), true ) ) {
		return;
	}
	if ( wp_is_post_revision( $post ) || wp_is_post_autosave( $post ) ) {
		return;
	}
	pc_revalidate(
		array(
			'post_type' => $post->post_type,
			'slug'      => $post->post_name,
		)
	);
}

// Salvataggi da pannello e da codice: wp_after_insert_post arriva dopo il salvataggio dei campi ACF.
// Le richieste REST aspettano rest_after_insert_<tipo>, quando anche lì i campi sono già salvati.
add_action(
	'wp_after_insert_post',
	function ( $post_id, $post ) {
		if ( defined( 'REST_REQUEST' ) && REST_REQUEST ) {
			return;
		}
		if ( 'publish' === $post->post_status ) {
			pc_revalidate_post( $post );
		}
	},
	20,
	2
);
foreach ( pc_post_types() as $pc_tipo ) {
	add_action(
		"rest_after_insert_{$pc_tipo}",
		function ( $post ) {
			if ( 'publish' === $post->post_status ) {
				pc_revalidate_post( $post );
			}
		},
		20
	);
}

// Da pubblicato a bozza o cestino: il contenuto deve sparire dal sito.
add_action(
	'transition_post_status',
	function ( $nuovo, $vecchio, $post ) {
		if ( 'publish' === $vecchio && 'publish' !== $nuovo ) {
			pc_revalidate_post( $post );
		}
	},
	20,
	3
);

// Categorie dei progetti: nome o slug cambiati, aggiunte o tolte.
foreach ( array( 'created_categoria_progetto', 'edited_categoria_progetto', 'delete_categoria_progetto' ) as $pc_evento ) {
	add_action(
		$pc_evento,
		function () {
			pc_revalidate( array( 'post_type' => 'categoria_progetto' ) );
		}
	);
}
