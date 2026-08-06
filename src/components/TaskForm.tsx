/* ════════════════════════════════════════════════════════════════════════════
 * src/components/TaskForm.tsx · FORMULARIO DE NUEVA TAREA
 * ════════════════════════════════════════════════════════════════════════════
 *
 * El componente más grande del proyecto. Concentra tres temas de la clase:
 *
 *   1. FORMULARIO CONTROLADO   → el estado manda sobre lo que se ve
 *   2. LIFTING STATE UP        → el formulario no guarda la tarea, la entrega
 *   3. MODAL COMO BOTTOM SHEET → una capa que entra desde abajo
 *
 * ─── 1. ¿QUÉ ES UN FORMULARIO "CONTROLADO"? ──────────────────────────────────
 *
 * Cada campo tiene su `useState`, y el TextInput recibe DOS props que forman un
 * circuito cerrado:
 *
 *        value={title}            ← "mostrá exactamente esto"
 *        onChangeText={setTitle}  ← "avisame cuando el usuario escriba"
 *
 *   usuario teclea "a" → onChangeText('a') → setTitle('a') → re-render
 *                      → value={'a'} → la 'a' aparece en pantalla
 *
 * Parece dar una vuelta de más, ¿no? La ganancia es que el estado es la ÚNICA
 * VERDAD. Podemos leer lo escrito en cualquier momento (para validar), o
 * escribirlo desde código (para limpiar el form después de enviar) y la
 * pantalla se actualiza sola. Con un input no controlado, el texto vive dentro
 * del componente nativo y solo podés espiarlo cuando te avisa.
 *
 * ─── 2. LIFTING STATE UP (elevar el estado) ──────────────────────────────────
 *
 * Fijate que este componente NO tiene la lista de tareas. Cuando el usuario
 * envía, llama a `onAdd(nuevaTarea)` y se olvida del asunto.
 *
 * ¿Por qué? Porque la lista también la necesitan `FlatListScreen`,
 * `ScrollViewScreen` y `TaskDetailScreen`. Cuando un dato lo necesitan varios
 * componentes, se guarda en el ancestro común más cercano —`App.tsx`— y baja
 * por props. El estado sube; los datos bajan.
 * ════════════════════════════════════════════════════════════════════════════ */

import React, { useState } from 'react'
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { CATEGORIES, Category, createId, DueDate, DUE_DATES, Task } from '../types'
import { colors, radius, shadow, spacing } from '../theme'

type Props = {
  /** Se llama con la tarea ya armada. El padre decide qué hacer con ella. */
  onAdd: (task: Task) => void
}

/* Sacamos las claves de los objetos de configuración para poder recorrerlas
 * con `.map()` y generar los chips.
 *
 * `Object.keys()` siempre devuelve `string[]` — TypeScript no puede saber que
 * las claves de CATEGORIES son exactamente las de `Category`. El `as Category[]`
 * es una ASERCIÓN DE TIPO: le decimos "confiá, yo sé que son estas". Está
 * justificado acá porque CATEGORIES está tipado como `Record<Category, ...>`,
 * así que es imposible que tenga otras claves.
 *
 * Van fuera del componente: se calculan una vez al cargar el módulo, no en
 * cada render. */
const CATEGORY_KEYS = Object.keys(CATEGORIES) as Category[]
const DATE_KEYS = Object.keys(DUE_DATES) as DueDate[]

export default function TaskForm({ onAdd }: Props) {
  /* ─── LOS INSETS DE LA PANTALLA ─────────────────────────────────────────────
   *
   * `useSafeAreaInsets()` devuelve cuánto espacio ocupan los elementos del
   * sistema en cada borde: la barra de estado y el notch arriba, la barra de
   * gestos del iPhone abajo, etc.
   *
   * Lo necesitamos porque el bottom sheet se apoya en el borde inferior de la
   * pantalla: sin sumarle `insets.bottom` al padding, el botón "Agregar tarea"
   * quedaría tapado por la barrita horizontal del iPhone.
   *
   * Este hook funciona porque en `App.tsx` envolvimos todo con
   * <SafeAreaProvider>. Sin ese proveedor, los valores llegan en 0. */
  const insets = useSafeAreaInsets()

  /* ─── EL ESTADO DEL FORMULARIO ──────────────────────────────────────────────
   *
   * Un `useState` por campo. Se lee así:
   *
   *     const [title, setTitle] = useState('')
   *            │       │                   └── valor inicial
   *            │       └── la única forma de cambiarlo (nunca `title = 'x'`)
   *            └── el valor actual, para este render
   *
   * ¿Por qué no un solo estado con un objeto `{ title, description, ... }`?
   * Se puede, y en formularios de 15 campos conviene. Con 4 campos, separados
   * es más legible y evita tener que hacer spread del objeto en cada cambio. */

  /** ¿El modal está abierto? También es estado: la visibilidad de algo en
   *  pantalla es un dato como cualquier otro. */
  const [open, setOpen] = useState(false)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  /* Los valores por defecto de los selectores. Notá `useState<Category>('personal')`:
   * el <Category> entre ángulos le dice a TypeScript qué tipo guarda este estado.
   * Sin eso, inferiría `string` y nos dejaría poner cualquier cosa. */
  const [category, setCategory] = useState<Category>('personal')
  const [date, setDate] = useState<DueDate>('today')

  /* ─── ESTADO DERIVADO (¡importante!) ────────────────────────────────────────
   *
   * `canSubmit` NO tiene su propio useState, y eso es deliberado.
   *
   *   ❌ const [canSubmit, setCanSubmit] = useState(false)
   *      ...y después acordarse de actualizarlo en cada onChangeText
   *
   *   ✅ const canSubmit = title.trim().length > 0 && ...
   *      se recalcula solo, en cada render, y nunca puede quedar desfasado
   *
   * REGLA: si un valor se puede CALCULAR a partir de otro estado, calculalo.
   * Guardarlo aparte crea dos fuentes de verdad que tarde o temprano se
   * contradicen (el botón habilitado con el campo vacío, el clásico).
   *
   * `.trim()` saca los espacios de los extremos: así una descripción de puros
   * espacios (" ") no cuenta como válida. */
  const canSubmit = title.trim().length > 0 && description.trim().length > 0

  /** Cierra el modal. Le damos nombre porque la usamos en tres lugares
   *  (la ✕, el fondo oscuro y el botón atrás de Android). */
  const close = () => setOpen(false)

  /* ─── EL ENVÍO ────────────────────────────────────────────────────────────── */
  const handleSubmit = () => {
    /* Guarda de seguridad. El botón ya está deshabilitado cuando no se puede
       enviar, pero repetimos el chequeo acá: es la última línea de defensa y
       cuesta una línea. Nunca confíes solo en que la UI impida algo. */
    if (!canSubmit) return

    /* Armamos el objeto Task y lo mandamos hacia arriba. TypeScript verifica
       que no falte ni sobre ninguna propiedad: si te olvidás de `completed`,
       no compila. */
    onAdd({
      // El id se genera UNA sola vez, acá, en el momento de la creación.
      // (Ver la explicación de createId en src/types/index.ts.)
      id: createId(),
      // Guardamos el texto limpio, no lo que había literal en el input.
      title: title.trim(),
      description: description.trim(),
      category,
      date,
      // Toda tarea nueva nace pendiente. Es una regla de negocio, no un dato
      // que el usuario tenga que elegir.
      completed: false
    })

    /* Reseteamos los campos a sus valores iniciales. Esto es posible
       justamente porque el formulario es controlado: cambiamos el estado y la
       UI se limpia sola. */
    setTitle('')
    setDescription('')
    setCategory('personal')
    setDate('today')
    close()
  }

  return (
    /* ─── FRAGMENT: <> </> ────────────────────────────────────────────────────
       Un componente tiene que devolver UN solo elemento raíz, pero acá
       necesitamos devolver dos hermanos (el botón y el modal) sin meterlos en
       un <View> que agregaría una caja al layout. El Fragment agrupa sin
       generar ningún elemento real. */
    <>
      {/* ─── EL DISPARADOR ────────────────────────────────────────────────────
          Siempre visible al pie de la pantalla. Lo único que hace es poner
          `open` en true. */}
      <TouchableOpacity style={styles.fabRow} onPress={() => setOpen(true)} activeOpacity={0.8}>
        <Text style={styles.fabPlus}>＋</Text>
        <Text style={styles.fabText}>Nueva tarea</Text>
      </TouchableOpacity>

      {/* ─── EL MODAL ─────────────────────────────────────────────────────────
          `Modal` es un componente nativo que renderiza su contenido en una CAPA
          APARTE, por encima de toda la app. No importa dónde esté escrito en el
          árbol ni qué `zIndex` tengan sus vecinos: siempre queda arriba. */}
      <Modal
        /* Controlado por estado, igual que los inputs: no hay `modal.show()`.
           Describimos QUÉ queremos ver y React se encarga del cómo. */
        visible={open}
        /* `transparent` = el fondo del modal no es opaco. Sin esto, el modal
           taparía la pantalla con blanco y el efecto "hoja que sube" se
           perdería: no veríamos la app detrás. */
        transparent
        /* La animación de entrada. 'slide' entra desde abajo — exactamente el
           gesto que espera el usuario de un bottom sheet. */
        animationType="slide"
        /* ⚠️ Android: se dispara con el botón/gesto "atrás" del sistema.
           Si no la pasás, en Android el modal NO se cierra con el botón atrás
           y el usuario queda atrapado. En iOS no hace nada, pero se pone igual
           porque la app tiene que funcionar en ambos. */
        onRequestClose={close}
      >
        {/* ─── EL TECLADO ────────────────────────────────────────────────────
            `KeyboardAvoidingView` empuja el contenido hacia arriba cuando
            aparece el teclado, para que no tape los campos.

            ⚠️ Necesitamos UNO PROPIO acá adentro, aunque `App.tsx` ya tenga
            otro. El Modal vive en su propia capa nativa, fuera del árbol de
            vistas de la app, así que el KeyboardAvoidingView de afuera no lo
            alcanza. Es un error clásico: "el teclado me tapa el formulario del
            modal" casi siempre es esto.

            El `behavior` difiere por plataforma porque el manejo del teclado es
            distinto en cada sistema:
              iOS     → 'padding': agrega relleno abajo, del alto del teclado
              Android → undefined: el sistema ya lo resuelve solo (vía
                        `windowSoftInputMode`); forzar un behavior lo empeora */}
        <KeyboardAvoidingView
          style={styles.overlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          {/* ─── EL FONDO OSCURO (backdrop) ──────────────────────────────────
              Cubre toda la pantalla por detrás de la hoja. Cumple dos funciones:
                • visual: oscurece la app y enfoca la atención en el formulario
                • funcional: tocarlo cierra el modal (gesto que todos esperan)

              Usamos `Pressable` en vez de `TouchableOpacity` porque no queremos
              NINGÚN efecto visual al tocarlo: el fondo no debe parpadear.
              `Pressable` detecta el toque sin animar nada. */}
          <Pressable style={styles.backdrop} onPress={close} />

          {/* ─── LA HOJA (sheet) ─────────────────────────────────────────────
              Estilo del StyleSheet + padding inferior calculado en runtime.
              Ese `insets.bottom` es lo que evita que el botón quede debajo de
              la barra de gestos del iPhone. */}
          <View style={[styles.sheet, { paddingBottom: spacing.lg + insets.bottom }]}>
            {/* La barrita gris de arriba. No hace nada, es pura señalética:
                comunica "esto es un panel deslizable". Los usuarios la
                reconocen sin pensarlo. */}
            <View style={styles.grabber} />

            <View style={styles.headerRow}>
              <Text style={styles.heading}>Nueva tarea</Text>
              <TouchableOpacity onPress={close} hitSlop={8}>
                <Text style={styles.close}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* ─── CAMPO 1: TÍTULO ──────────────────────────────────────────── */}
            <TextInput
              style={styles.input}
              placeholder="¿Qué hay que hacer?"
              /* En React Native el color del placeholder NO se hereda del
                 `style`: hay que pasarlo por esta prop aparte. Sin ella, el
                 sistema elige un gris que puede quedar ilegible. */
              placeholderTextColor={colors.muted}
              /* ── El circuito controlado ──
                 value: lo que se muestra sale SIEMPRE del estado */
              value={title}
              /* onChangeText: nos da el texto ya listo (a diferencia de la web,
                 donde hay que sacarlo de `event.target.value`).
                 Como `setTitle` recibe justo un string, podemos pasarla directo
                 en vez de escribir `(text) => setTitle(text)`. */
              onChangeText={setTitle}
              /* Abre el teclado apenas se muestra el modal: un paso menos para
                 el usuario. Usalo solo en el PRIMER campo. */
              autoFocus
              /* Cambia la tecla "Enter" del teclado por una que dice "Siguiente",
                 dando la pista de que hay otro campo abajo. */
              returnKeyType="next"
            />

            {/* ─── CAMPO 2: DESCRIPCIÓN ─────────────────────────────────────── */}
            <TextInput
              // Dos estilos combinados: el base + los ajustes de textarea.
              style={[styles.input, styles.textarea]}
              placeholder="Descripción de la tarea"
              placeholderTextColor={colors.muted}
              value={description}
              onChangeText={setDescription}
              /* `multiline` permite varios renglones y hace que Enter inserte un
                 salto de línea en lugar de cerrar el teclado. */
              multiline
            />

            {/* ─── SELECTOR DE CATEGORÍA ────────────────────────────────────────
                Acá se ve el pago de haber guardado las categorías como DATOS.
                No hay cuatro botones escritos a mano: hay un `.map()` sobre
                CATEGORY_KEYS. Agregás una categoría en `types/index.ts` y el
                chip aparece solo, con su color y su emoji. */}
            <Text style={styles.label}>Categoría</Text>
            <View style={styles.chipRow}>
              {CATEGORY_KEYS.map((key) => {
                const cat = CATEGORIES[key]
                // ¿Es esta la categoría elegida? Comparamos con el estado.
                const active = category === key

                return (
                  <TouchableOpacity
                    key={key} // el "DNI" del elemento, obligatorio en un .map()
                    style={[
                      styles.chip,
                      // El borde siempre lleva el color de la categoría...
                      { borderColor: cat.color },
                      // ...y si está seleccionada, ese color pasa a ser el fondo.
                      active && { backgroundColor: cat.color }
                    ]}
                    onPress={() => setCategory(key)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        // Texto blanco sobre fondo lleno, o de color sobre fondo
                        // claro. Así el contraste se mantiene en los dos casos.
                        { color: active ? colors.surface : cat.color }
                      ]}
                    >
                      {cat.emoji} {cat.label}
                    </Text>
                  </TouchableOpacity>
                )
              })}
            </View>

            {/* ─── SELECTOR DE FECHA ────────────────────────────────────────────
                Exactamente el mismo patrón, con estilos neutros porque las
                fechas no tienen color propio como las categorías. */}
            <Text style={styles.label}>¿Para cuándo?</Text>
            <View style={styles.chipRow}>
              {DATE_KEYS.map((key) => {
                const active = date === key
                return (
                  <TouchableOpacity
                    key={key}
                    style={[styles.chip, styles.chipNeutral, active && styles.chipNeutralActive]}
                    onPress={() => setDate(key)}
                  >
                    <Text style={[styles.chipText, { color: active ? colors.surface : colors.ink }]}>
                      {DUE_DATES[key]}
                    </Text>
                  </TouchableOpacity>
                )
              })}
            </View>

            {/* ─── BOTÓN DE ENVÍO ───────────────────────────────────────────────
                Se deshabilita SOLO, porque `canSubmit` se deriva del estado.
                Nadie tiene que acordarse de habilitarlo o deshabilitarlo. */}
            <TouchableOpacity
              style={[styles.submit, !canSubmit && styles.submitDisabled]}
              onPress={handleSubmit}
              /* `disabled` es lo que realmente bloquea el toque. El estilo
                 atenuado es solo la señal visual. Hacen falta LOS DOS: sin
                 `disabled`, el botón se ve gris pero sigue funcionando. */
              disabled={!canSubmit}
              activeOpacity={0.85}
            >
              <Text style={styles.submitText}>Agregar tarea</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  /* ─── El botón disparador ─────────────────────────────────────────────── */
  fabRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    paddingVertical: spacing.md + 2,
    // Sombra pronunciada: comunica "estoy por encima del contenido".
    boxShadow: shadow.raised
  },
  fabPlus: {
    color: colors.surface,
    fontSize: 18,
    fontWeight: '800'
  },
  fabText: {
    color: colors.surface,
    fontSize: 15,
    fontWeight: '800'
  },

  /* ─── La estructura del modal ─────────────────────────────────────────── */
  overlay: {
    flex: 1, // ocupa toda la pantalla
    /* LA CLAVE DEL BOTTOM SHEET: empuja al único hijo con altura propia
       (la hoja) contra el borde inferior. Cambiando esto a 'center' tendrías
       un modal centrado clásico, y a 'flex-start' uno que baja desde arriba. */
    justifyContent: 'flex-end'
  },
  backdrop: {
    /* `StyleSheet.absoluteFillObject` es un atajo para:
         { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }
       El `...` lo desparrama acá adentro. Al estar en position absolute, el
       backdrop NO participa del layout: cubre toda la pantalla por detrás de
       la hoja sin empujarla. */
    ...StyleSheet.absoluteFillObject,
    // Negro amarronado al 45%: oscurece sin ocultar del todo lo de atrás.
    backgroundColor: 'rgba(42, 16, 8, 0.45)'
  },
  sheet: {
    backgroundColor: colors.surface,
    // Solo las esquinas de ARRIBA van redondeadas: las de abajo se salen de
    // la pantalla, así que redondearlas no se vería.
    borderTopLeftRadius: radius.lg + 8,
    borderTopRightRadius: radius.lg + 8,
    padding: spacing.lg,
    gap: spacing.sm,
    // Sombra hacia ARRIBA (el -6px): despega la hoja del fondo oscuro.
    boxShadow: '0px -6px 24px rgba(42, 16, 8, 0.18)'
  },
  grabber: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.border,
    marginBottom: spacing.xs
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between', // título a la izquierda, ✕ a la derecha
    alignItems: 'center'
  },
  heading: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.ink
  },
  close: {
    fontSize: 16,
    color: colors.muted,
    fontWeight: '700'
  },

  /* ─── Los campos ──────────────────────────────────────────────────────── */
  input: {
    backgroundColor: colors.canvas,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    fontSize: 14,
    color: colors.ink
  },
  textarea: {
    /* `minHeight` en vez de `height`: arranca con el alto de ~3 renglones pero
       puede crecer si el usuario escribe más. Con `height` fijo, el texto
       quedaría cortado. */
    minHeight: 64,
    /* ⚠️ Solo Android: por defecto centra verticalmente el texto en un input
       multilínea, lo que se ve raro. Esto lo alinea arriba, como en iOS.
       Detalle chico, pero es la diferencia entre "se ve igual en los dos
       sistemas" y "en Android quedó raro". */
    textAlignVertical: 'top'
  },
  label: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.muted,
    /* Mayúsculas + espaciado entre letras: el recurso tipográfico estándar
       para etiquetas de sección. Se leen como "rótulo" y no compiten con el
       contenido. Sin el `letterSpacing`, las mayúsculas se ven apretadas. */
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: spacing.xs
  },

  /* ─── Los chips ───────────────────────────────────────────────────────── */
  chipRow: {
    flexDirection: 'row',
    /* `flexWrap: 'wrap'` deja que los chips pasen al renglón siguiente cuando
       no entran. Sin esto se aplastarían para caber en una sola línea y el
       texto se cortaría — problema garantizado en pantallas angostas. */
    flexWrap: 'wrap',
    gap: spacing.sm
  },
  chip: {
    borderWidth: 1.5,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2
  },
  chipNeutral: {
    borderColor: colors.border,
    backgroundColor: colors.canvas
  },
  chipNeutralActive: {
    backgroundColor: colors.dark,
    borderColor: colors.dark
  },
  chipText: {
    fontSize: 13,
    fontWeight: '700'
  },

  /* ─── El botón de envío ───────────────────────────────────────────────── */
  submit: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.sm
  },
  submitDisabled: {
    /* Bajar la opacidad es preferible a cambiar el color: se lee como
       "desactivado" sin que tengamos que definir una paleta gris entera. */
    opacity: 0.4
  },
  submitText: {
    color: colors.surface,
    fontSize: 15,
    fontWeight: '800'
  }
})
