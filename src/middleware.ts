/*
There is currently no way to get a `.astro` route to just return the HTML
without the CSS and JS. This is a workaround to remove the CSS and JS from
the HTML response of HTMX fragment routes.

The premise here is that HTMX fragments won't required additional styles because
the Tailwind for the entire experience is alreay precomputed. And second that it will
not require additional JS because ... HTMX.
*/
const HTMX_FRAGMENT_ROUTES = ["/prompt"];

export const onRequest = async (context, next) => {
  // 0. When submitting a prompt, there are many requests made to /prompt with Tailwind <style> and <script> tags
  // 1. Take all the requests received  
  const response = await next();
  let html = await response.text();
 // 2. Run the reqs and check if the current route is to /prompt
  if (
    HTMX_FRAGMENT_ROUTES.find((route) => context.request.url.includes(route))
  ) {
   // 3. Delete the CSS and JS from the HTML response, using RegEx
    html = html.replace(/<style type\=\"text\/css\"(.*)<\/style>/s, "");
    html = html.replace(/<script(.*)<\/script>/gm, "");
  }

  return new Response(html, {
    status: 200,
    headers: response.headers,
  });
};