/* ════════════════════════════════════════════════════════════════════════════
 * index.ts · EL PUNTO DE ENTRADA DE LA APLICACIÓN
 * ════════════════════════════════════════════════════════════════════════════
 *
 * Este es el PRIMER archivo que se ejecuta cuando arranca la app. Lo declara
 * `package.json` en su campo `"main": "index.ts"`.
 *
 * Es cortito y casi nunca se toca, pero conviene entender qué hace.
 * ════════════════════════════════════════════════════════════════════════════ */

import { registerRootComponent } from 'expo'

import App from './App'

/* `registerRootComponent(App)` le dice al sistema operativo:
 * "cuando el usuario abra esta app, empezá dibujando este componente".
 *
 * Por dentro llama a `AppRegistry.registerComponent('main', () => App)`, que es
 * la API nativa de React Native, y además se encarga de que todo funcione igual
 * tanto si la app corre en Expo Go como en una compilación nativa propia.
 *
 * ¿Por qué no lo hacemos directo con AppRegistry? Porque habría que escribir
 * configuración distinta según el entorno. Expo nos ahorra ese trabajo.
 *
 * A partir de acá, todo lo que pasa en la app arranca en `App.tsx`. */
registerRootComponent(App)
