/* ════════════════════════════════════════════════════════════════════════════
 * src/types/index.ts · EL MODELO DE DATOS DE TASKFLOW
 * ════════════════════════════════════════════════════════════════════════════
 *
 * ¿Por qué un archivo aparte solo para tipos?
 * Porque el modelo de datos es el CONTRATO de la app. Si `Task` vive en un solo
 * lugar, cuando le agregamos un campo el compilador nos avisa TODOS los archivos
 * que hay que tocar. Si cada componente definiera su propia versión de "tarea",
 * ese aviso no existiría y los errores aparecerían recién en runtime.
 *
 * Recordá: TypeScript solo existe mientras programás. Al ejecutar la app, todo
 * este archivo desaparece — no genera ni una línea de JavaScript (salvo las
 * constantes CATEGORIES / DUE_DATES / createId, que sí son valores reales).
 * ════════════════════════════════════════════════════════════════════════════ */

/* ─── 1. UNION TYPES (tipos de unión) ─────────────────────────────────────────
 *
 * `Category` no es un `string` cualquiera: es UNO de estos cuatro textos.
 * Esa diferencia es enorme. Si escribimos:
 *
 *     const c: Category = 'deporte'   // ❌ Error en el editor, antes de correr
 *
 * TypeScript nos frena al instante. Con `string` a secas, ese error viajaría
 * hasta el celular del usuario y rompería la app ahí.
 *
 * Beneficio extra: el autocompletado del editor te sugiere las 4 opciones. */
export type Category = 'trabajo' | 'personal' | 'estudio' | 'hogar'

/** Lo mismo para el "¿para cuándo?": tres valores posibles y ninguno más.
 *  Guardamos claves en inglés (`today`) y mostramos el texto en español
 *  ("Hoy") desde DUE_DATES. Separar el DATO de su ETIQUETA nos permitiría
 *  traducir la app entera sin tocar la lógica. */
export type DueDate = 'today' | 'tomorrow' | 'nextWeek'

/* ─── 2. EL TIPO PRINCIPAL: Task ──────────────────────────────────────────────
 *
 * Este objeto es "una tarea" en toda la app: lo que produce el formulario,
 * lo que recorre la FlatList y lo que muestra la pantalla de detalle.
 * Todos hablan el mismo idioma porque todos importan este tipo. */
export type Task = {
  /** ID único y estable de la tarea.
   *
   *  ¿Para qué sirve? Es el "DNI" del elemento. React lo usa como `key` en las
   *  listas para saber QUÉ elemento es cuál entre un render y el siguiente.
   *
   *  ¿Por qué no usar el índice del array como key? Porque el índice describe
   *  una POSICIÓN, no una identidad. Si borrás la tarea del medio, todas las de
   *  abajo cambian de índice: React cree que cambiaron de contenido y repinta
   *  media lista (y peor: puede dejar el checkbox tildado en la fila equivocada).
   *  El `id` en cambio viaja con la tarea para siempre. */
  id: string

  /** Título corto. En la lista lo mostramos con `numberOfLines={1}`. */
  title: string

  /** Descripción larga. Puede quedar vacía (''): en el detalle mostramos un
   *  texto alternativo cuando eso pasa. */
  description: string

  /** Categoría. Al ser de tipo `Category` (no `string`), TypeScript garantiza
   *  que `CATEGORIES[task.category]` SIEMPRE va a encontrar algo. */
  category: Category

  /** Vencimiento simbólico. Todavía no usamos fechas reales (`Date`) para no
   *  meter el tema de formateo/zonas horarias en esta clase. */
  date: DueDate

  /** ¿Está completada? Es el campo que togglea el checkbox de la lista y el
   *  botón grande de la pantalla de detalle. */
  completed: boolean
}

/* ─── 3. DATOS DE PRESENTACIÓN ────────────────────────────────────────────────
 *
 * Acá está uno de los conceptos más importantes de la clase:
 * NO HARDCODEAR LA UI. En vez de escribir a mano cuatro botones de categoría en
 * el formulario, guardamos las categorías como DATOS y después las recorremos
 * con `.map()`. Si mañana agregás 'deporte' a este objeto, el chip aparece solo
 * en el formulario Y el color aparece solo en la lista y en el detalle.
 *
 * `Record<Category, {...}>` se lee: "un objeto cuyas claves son exactamente las
 * de Category, y cuyos valores tienen esta forma". Si te olvidás de 'hogar',
 * TypeScript te marca el error. Es un mapa a prueba de despistes. */
export const CATEGORIES: Record<
  Category,
  {
    /** Texto que ve el usuario. */
    label: string
    /** Color fuerte: bordes, chip activo, badge del detalle. */
    color: string
    /** Versión suave del mismo color: fondos de badges (`soft` = pastel). */
    soft: string
    /** Emoji: ícono gratis, sin instalar librerías de íconos. */
    emoji: string
  }
> = {
  trabajo: { label: 'Trabajo', color: '#5B7CFA', soft: '#E9EDFE', emoji: '💼' },
  personal: { label: 'Personal', color: '#FE64A3', soft: '#FFE9F3', emoji: '🌱' },
  estudio: { label: 'Estudio', color: '#9B59D0', soft: '#F3E9FB', emoji: '📚' },
  hogar: { label: 'Hogar', color: '#2FA36B', soft: '#E3F4EB', emoji: '🏠' }
}

/** Traducción de la clave técnica al texto que lee el usuario.
 *  Misma idea que CATEGORIES: el dato viaja en inglés, la UI habla español. */
export const DUE_DATES: Record<DueDate, string> = {
  today: 'Hoy',
  tomorrow: 'Mañana',
  nextWeek: 'Próxima semana'
}

/* ─── 4. GENERADOR DE IDs ─────────────────────────────────────────────────────
 *
 * Cada tarea nueva necesita un id único. Lo armamos con dos piezas:
 *
 *   Date.now()            → milisegundos desde 1970. Ej: 1754424000000
 *   .toString(36)         → lo escribe en base 36 (0-9 + a-z) para acortarlo
 *   Math.random()...      → 5 caracteres al azar, por si dos tareas se crean
 *                           dentro del MISMO milisegundo
 *
 * Resultado: 'task-m2xk9p3-f8s2q'
 *
 * ⚠️ Detalle clave: esta función se llama UNA sola vez, en el momento de crear
 * la tarea (dentro de handleSubmit). Si la llamáramos durante el render, cada
 * repintado generaría un id nuevo, React creería que son elementos distintos
 * y perderíamos el estado de las filas. El id se calcula una vez y se guarda. */
export const createId = () =>
  `task-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`

/* ─── 5. NAVEGACIÓN SIMULADA ──────────────────────────────────────────────────
 *
 * Las dos "pestañas" de la app. Todavía NO usamos React Navigation (llega en el
 * Módulo 5): por ahora la pestaña activa es simplemente un dato guardado con
 * useState, y renderizamos una pantalla u otra según su valor.
 *
 * Es un buen recordatorio de que "navegar" en React es, en el fondo,
 * decidir qué componente mostrar. */
export type TabKey = 'flatlist' | 'scrollview'
