# `@idavide94/trakt.tv-userscript`

> _forked from [trakt.tv](https://github.com/vankasteelj/trakt.tv)_

> [!CAUTION]
> This repository is no longer maintained.

**Trakt.tv API wrapper for userscripts, featuring:**

- [All Trakt.tv API v2 methods](docs/available_methods.md)
- [Plugin extension](docs/plugins.md)[^wip]

_For more information about the trakt.tv API, read http://docs.trakt.apiary.io/_

## Example usage

#### Setup

Add to a userscript via [`@require`](https://wiki.greasespot.net/Metadata_Block#@require):

```javascript
// @require   https://cdn.jsdelivr.net/npm/@idavide94/trakt.tv-userscript/dist/index.min.js
// @grant     GM.xmlHttpRequest
```

> attention: _for the proper working of the library the use of [`GM.xmlHttpRequest`](https://wiki.greasespot.net/GM.xmlHttpRequest) via [`@grant`](https://wiki.greasespot.net/@grant) is required!_

#### Initialize

```javascript
const options = {
  client_id: '<the_client_id>',
  client_secret: '<the_client_secret>',
  redirect_uri: null, // defaults to 'urn:ietf:wg:oauth:2.0:oob'
  api_url: null, // defaults to 'https://api.trakt.tv'
  useragent: null, // defaults to 'trakt.tv/<version>'
  pagination: true // defaults to false, global pagination (see below)
}
const trakt = new Trakt(options)
```

> note: _add `debug: true` to the `options` object to get debug logs of the requests executed in your console_

#### OAUTH

1. Generate Auth URL

```javascript
const traktAuthUrl = trakt.get_url()
```

2. Authentication is done at that URL, it redirects to the provided uri with a code and a state

3. Verify code (and optionally state for better security) from returned auth, and get a token in exchange

```javascript
trakt.exchange_code('code', 'csrf token (state)').then((result) => {
  // contains tokens & session information
  // API can now be used with authorized requests
})
```

#### Alternate OAUTH "device" method

```javascript
trakt
  .get_codes()
  .then((poll) => {
    // poll.verification_url: url to visit in a browser
    // poll.user_code: the code the user needs to enter on trakt

    // verify if app was authorized
    return trakt.poll_access(poll)
  })
  .catch((error) => {
    // error.message == 'Expired' will be thrown if timeout is reached
  })
```

#### Refresh token

```javascript
trakt.refresh_token().then((results) => {
  // results are auto-injected in the main module cache
})
```

#### Storing token over sessions

```javascript
// get token, store it safely.
const token = trakt.export_token()

// injects back stored token on new session.
trakt.import_token(token).then((newTokens) => {
  // Contains token, refreshed if needed (store it back)
})
```

#### Revoke token

```javascript
trakt.revoke_token()
```

#### Actual API requests

See methods in [methods.json](methods.json) or [the docs](docs/available_methods.md).

```javascript
trakt.calendars.all
  .shows({
    start_date: '2015-11-13',
    days: '7',
    extended: 'full'
  })
  .then((shows) => {
    // Contains Object{} response from API (show data)
  })
```

```javascript
trakt.search
  .text({
    query: 'tron',
    type: 'movie,person'
  })
  .then((response) => {
    // Contains Array[] response from API (search data)
  })
```

```javascript
trakt.search
  .id({
    id_type: 'imdb',
    id: 'tt0084827'
  })
  .then((response) => {
    // Contains Array[] response from API (imdb data)
  })
```

#### Using pagination

You can extend your calls with `pagination: true` to get the extra pagination info from headers.

```javascript
trakt.movies
  .popular({
    pagination: true
  })
  .then((movies) => {
    /**
    movies = Object {
      data: [<actual data from API>],
        pagination: {
          item-count: "80349",
            limit: "10",
            page: "1",
            page-count: "8035"
        }
    }
    **/
  })
```

> note: _this will contain `data` and `pagination` for all calls, even if no pagination is available (`result.pagination` will be `false`). it's typically for advanced use only_

#### Load plugins[^wip]

When calling `new Trakt()`, include desired plugins in an object (must be installed from npm):

```javascript
const trakt = new Trakt({
  client_id: '<the_client_id>',
    client_secret: '<the_client_secret>',
    plugins: {  // load plugins
        images: require('trakt.tv-images')
    }
    options: {  // pass options to plugins
        images: {
          smallerImages: true
        }
    }
});
```

The plugin can be accessed with the key you specify. For example `trakt.images.get()`.

#### Write plugins[^wip]

See the [documentation](docs/writing_plugins.md).

#### Notes

- You can use 'me' as username if the user is authenticated.
- Timestamps (such as token _expires_ property) are Epoch in milliseconds.

[^wip]: plugins, and related docs, are currently a work in progress for this fork
