# google-maps-promise

Wrapper for asynchronously load Google Maps API with Promise.

This module based on ideas from package [google-maps](https://github.com/Carrooi/Js-GoogleMapsLoader)
but with another API based on Promises.  
It doesn’t change original Google Maps API ans just provide easy way to load
and use this API asynchronously.

## Installation

For bundlers and other NPM-based environments:

```
npm install --save-dev google-maps-promise
```

Types for TypeScript are included.

### UMD

UMD is default for this package, so just use something like:

```js
import {load, urlSettings} from 'google-maps-promise';
// or
const {load, urlSettings} = require( 'google-maps-promise' );
```

For using directly in browser (import with `<script>` tag in HTML-file):

* [Development version](https://unpkg.com/google-maps-promise/es5/index.js)
* [Production version](https://unpkg.com/google-maps-promise/es5/google-maps-promise.min.js)

You can use AMD or `GoogleMapsPromise` global variable.

If you target to ES5 browsers you should use some polyfill for `Promise`
and `Object.assign`.

### ES2015 module systems

Package contain `module` property for use with ES2015 module bundlers
(like Rollup and Webpack 2).

### ES2015 code base

If you don’t want to use transplitted to ES5 code, you can use included
ES2015 version.

You can directly import this version:

```js
import {load, urlSettings} from 'google-maps-promise/es2015';
```

Or specify alias in Webpack config:

```js
{
	// …
	resolve: {
		extensions: ['.ts', '.tsx', '.js'],
		alias: {
			'google-maps-promise': 'google-maps-promise/es2015',
		},
	},
};
```

## Usage

```typescript
import {load, urlSettings} from 'google-maps-promise';

async function main(): Promise<void>
{
	urlSettings.key = '__YOUR_API_KEY__';
	const Maps = await load();
	
	// Or you can use `new google.maps.Map` instead
	new Maps.Map(
		document.getElementById( 'map' ),
		{
			// Your options…
		},
	);
}
```

Without async/await and TypeScript:

```js
import {load, urlSettings} from 'google-maps-promise';

urlSettings.key = '__YOUR_API_KEY__';

load()
	.then(
		( Maps ) =>
		{
			// Or you can use `new google.maps.Map` instead
			new Maps.Map(
				document.getElementById( 'map' ),
				{
					// Your Google Maps options…
				},
			);
		}
	);
```

The `load()` function returns the same Promise for every call, so you can use
it in different parts of your code.  
For example, in some other module you can create a location point:

```typescript
import {load} from 'google-maps-promise';

async function main(): Promise<void>
{
	const Maps = await load();
	const location = new Maps.LatLng( 0, 0 );
	
	// Use it somehow…
}
```

Promise is rejected when script can’t be loaded, so you can catch this error
with `try/catch`, when you use `async/await`, or with `.catch()` in promise
chain.

```typescript
import {load, urlSettings} from 'google-maps-promise';

async function main(
	element: HTMLElement,
	options: google.maps.MapOptions,
): Promise<void>
{
	urlSettings.key = '__YOUR_API_KEY__';
	
	try
	{
		const Maps = await load();
		new Maps.Map( element, options );
	}
	catch ( error )
	{
		console.error( error );
		
		// Fallback to image
		const image = new Image();
		image.src = '/images/map.png';
		image.alt = 'Map';
		element.appendChild( image );
	}
}
```

## Options

You can specify options thrue `urlSettings` object.

### url

Base URL address to Google Maps JS API (`string`).

```typescript
urlSettings.url = 'https://maps.googleapis.com/maps/api/js';
```

### key

API key (`string | null`).

```typescript
urlSettings.key = 'qwertyuiopasdfghjklzxcvbnm';
```

### client

Client ID for Premium Plan (`string | null`);

```typescript
urlSettings.client = 'yourclientkey';
```

### version

Required version of the API (`string | null`).  
By default version is set so you should set this property to `null` if you want
to always use the latest version. This will not work, if you specify the
`client` property — even when you set it to `null`, module will use value
from `defaultUrlSettings` object (it defined as read only).

```typescript
urlSettings.version = '3.27';
```

### channel

Application channel for Premium Plan (`string | null`).

```typescript
urlSettings.channel = 'channel';
```

### libraries

Additional libraries to load (`string[]`).

```typescript
urlSettings.libraries = ['geometry', 'places'];
```

### language

Force map language (`string | null`).

```typescript
urlSettings.language = 'ru';
```

### region

Biasing API results towards the region (`string | null`).

```typescript
urlSettings.region = 'RU';
```

### windowCallbackName

Name of callback function in global space (`string`).

```typescript
urlSettings.windowCallbackName = '__google_maps_api_provider_initializator__';
```

## Unload Google API

For testing purposes is good to remove all google objects and restore loader
to its original state.

```typescript
import {release} from 'google-maps-promise';

release()
	.then(
		() =>
			console.log( 'No google maps api around' );
	);
```

## License

[MIT](https://github.com/m18ru/google-maps-promise/blob/master/LICENSE).
