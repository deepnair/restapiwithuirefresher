# REST API with Next.js UI with credentials refresher

This is a refresher build of the [REST API with UI Tutorial](https://github.com/deepnair/restapiwithui) repositorty.

## Notes to remember

1. When using fetch, wherever credentials are required, add credentials: 'include' in the options of the fetch request.
1. Whenever sending any content, be sure to include:
    ```ts
    headers: {'Content-type: 'application/json'}
    ```
1. When using useSWR, the fallbackData goes into an object in the form: {fallbackData} rather than a stand alone.
1. For the const cookieOptions in session.controller.ts, the CookieOptions type is imported from express.
1. Make sure the values in .env.local are NOT surrounded with apostrophes.