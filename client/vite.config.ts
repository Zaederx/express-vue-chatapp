import { fileURLToPath, URL } from 'node:url'
import fs from 'fs'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
//@ts-ignore
import jks from 'jks-js';

const keystore = jks.toPem(fs.readFileSync('keystore.jks'),'password');

const { cert, key } = keystore['tomcat'];
// https://vitejs.dev/config/
//see [vite docs](https://vitejs.dev/config/server-options.html)
// or you can have it unspecified and passed through cli - `npm run dev -- --https` or `vite --https`
// use of mkcert - [see](https://stackoverflow.com/questions/69417788/vite-https-on-localhost)
export default defineConfig({
  plugins: [vue(), vueJsx()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    https: {
      key: key,
      cert: cert
    }
    
  },
 
})
