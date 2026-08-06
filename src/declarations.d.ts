/* ════════════════════════════════════════════════════════════════════════════
 * src/declarations.d.ts · DECLARACIONES DE TIPOS PARA ARCHIVOS NO-JS
 * ════════════════════════════════════════════════════════════════════════════
 *
 * ¿Qué problema resuelve este archivo?
 *
 * En React Native podés importar una imagen como si fuera código:
 *
 *     import avatar from '../assets/avatar.webp'
 *
 * El empaquetador (Metro) entiende eso perfectamente y lo resuelve al armar la
 * app. Pero TypeScript no: para él, un `.webp` no es un módulo de JavaScript, y
 * marca el import en rojo con "Cannot find module".
 *
 * Este archivo es la traducción para TypeScript: "cuando veas un import que
 * termina en .webp, confiá — es un módulo válido y exporta algo por defecto".
 *
 * ─── DETALLES DE SINTAXIS ────────────────────────────────────────────────────
 *
 * • La extensión `.d.ts` significa "declaration file": solo contiene TIPOS, no
 *   genera ni una línea de JavaScript. Existe únicamente para el compilador.
 *
 * • El `*` en `'*.webp'` es un comodín: aplica a CUALQUIER ruta que termine así.
 *
 * • El tipo es `any` porque lo que devuelve el import depende de la plataforma
 *   (en nativo es un número que identifica el recurso, en web una URL). Como
 *   solo se lo pasamos a `<Image source={...}>`, no necesitamos más precisión.
 *   Es de los pocos casos donde `any` está plenamente justificado.
 *
 * • Para usar otro formato (PNG, SVG, JPEG), agregá su bloque acá abajo.
 * ════════════════════════════════════════════════════════════════════════════ */

declare module '*.jpg' {
  const value: any
  export default value
}

declare module '*.webp' {
  const value: any
  export default value
}
