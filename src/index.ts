// Wrapper for asynchronously load Google Maps API with Promise.

/// <reference types="googlemaps" />

/**
 * Default settings used to build URL.
 */
const defaultUrlSettings: Readonly<UrlSettings> = {
	url: 'https://maps.googleapis.com/maps/api/js',
	key: null,
	client: null,
	version: '3.32',
	channel: null,
	libraries: [],
	language: null,
	region: null,
	windowCallbackName: '__google_maps_api_provider_initializator__',
};

/**
 * Window object with any property.
 */
const windowWithAnything = window as any;

/**
 * Current settings used to build URL.
 */
let urlSettings: UrlSettings = Object.assign( {}, defaultUrlSettings );

/**
 * Function to resolve promise.
 */
let resolvePromise: ( maps: typeof google.maps ) => void;
/**
 * Function to reject promise.
 */
let rejectPromise: ( error: Error ) => void;
/**
 * API loading Promise.
 */
let promise: Promise<typeof google.maps>;

/**
 * Is loading process already executed?
 */
let loaded: boolean;
/**
 * Script element used to load API.
 */
let scriptElement: HTMLScriptElement | null;

init();

/**
 * Asynchronously load Google Maps API.
 * 
 * @returns Promise with `google.maps` object.
 */
function load(): Promise<typeof google.maps>
{
	if ( !loaded )
	{
		loaded = true;
		createLoader();
	}
	
	return promise;
}

/**
 * Remove scripts and variables and reset settings.
 * 
 * @returns When it's done.
 */
function release(): Promise<void>
{
	if ( !loaded )
	{
		cleanupEnvironment();
		
		return Promise.resolve();
	}
	
	return promise.then( cleanupEnvironment );
}

/**
 * Initialize variables.
 */
function init(): void
{
	urlSettings = Object.assign( {}, defaultUrlSettings );
	loaded = false;
	
	promise = new Promise<typeof google.maps>(
		( resolve, reject ): void =>
		{
			resolvePromise = resolve;
			rejectPromise = reject;
		},
	);
}

/**
 * Create API loader script.
 */
function createLoader(): void
{
	if (
		windowWithAnything.google
		&& windowWithAnything.google.maps
	)
	{
		resolvePromise( windowWithAnything.google.maps );
		
		return;
	}
	
	const onError = () =>
		rejectPromise(
			new URIError(
				`The script ${scriptElement && scriptElement.src} is not accessible.`,
			),
		);
	
	scriptElement = document.createElement( 'script' );
	scriptElement.type = 'text/javascript';
	scriptElement.src = createUrl();
	scriptElement.onerror = onError;
	
	windowWithAnything[urlSettings.windowCallbackName] = () =>
		resolvePromise( windowWithAnything.google.maps );
	
	document.body.appendChild( scriptElement );
}

/**
 * Create URL address to API.
 * 
 * @returns URL address.
 */
function createUrl(): string
{
	const parts: string[] = [
		'callback=' + (
			urlSettings.windowCallbackName
			|| defaultUrlSettings.windowCallbackName
		),
	];
	
	if ( urlSettings.key )
	{
		parts.push( 'key=' + urlSettings.key );
	}
	
	if ( urlSettings.client )
	{
		parts.push(
			'client=' + urlSettings.client,
			'v=' + ( urlSettings.version || defaultUrlSettings.version ),
		);
	}
	else if ( urlSettings.version )
	{
		parts.push( 'v=' + urlSettings.version );
	}
	
	if ( urlSettings.channel )
	{
		parts.push( 'channel=' + urlSettings.channel );
	}
	
	if ( urlSettings.libraries.length > 0 )
	{
		parts.push( 'libraries=' + urlSettings.libraries.join( ',' ) );
	}
	
	if ( urlSettings.language )
	{
		parts.push( 'language=' + urlSettings.language );
	}
	
	if ( urlSettings.region )
	{
		parts.push( 'region=' + urlSettings.region );
	}
	
	return `${urlSettings.url || defaultUrlSettings.url}?${parts.join( '&' )}`;
}

/**
 * Reset settings and variables
 */
function cleanupEnvironment(): void
{
	init();
	
	if ( typeof windowWithAnything.google !== 'undefined' )
	{
		delete windowWithAnything.google;
	}
	
	if ( typeof windowWithAnything[urlSettings.windowCallbackName] !== 'undefined' )
	{
		delete windowWithAnything[urlSettings.windowCallbackName];
	}
	
	if ( scriptElement )
	{
		if ( scriptElement.parentElement )
		{
			scriptElement.parentElement.removeChild( scriptElement );
		}
		
		scriptElement = null;
	}
}

/**
 * Settings used to build URL.
 */
export interface UrlSettings
{
	/** Base URL address to Google Maps JS API */
	url: string;
	/** API key */
	key: string | null;
	/** Client ID for Premium Plan */
	client: string | null;
	/** Required version of the API */
	version: string | null;
	/** Application channel for Premium Plan */
	channel: string | null;
	/** Additional libraries to load */
	libraries: string[];
	/** Force map language */
	language: string | null;
	/** Biasing API results towards the region */
	region: string | null;
	/** Name of callback function in global space */
	windowCallbackName: string;
}

/**
 * Module.
 */
export {
	load,
	release,
	urlSettings,
	defaultUrlSettings,
	// UrlSettings,
};
