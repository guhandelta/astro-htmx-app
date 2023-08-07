import { defineConfig } from 'astro/config';

import tailwind from "@astrojs/tailwind";

/*
    Until adding this config[output: 'server'], Astro runs in Static mode, and throws 
        ```Request.formData: Could not parse content as FormData```
    error.
    This config is to convert Astro into a SSR server,to handle each req dynamically, which is kindof what HTMX is used to dealing with, like send FormData and get values back, dynamically. 
*/

// https://astro.build/config
export default defineConfig({
  output: 'server',
  integrations: [tailwind()]
});