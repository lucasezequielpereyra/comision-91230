/* ════════════════════════════════════════════════════════════════════════════
 * src/components/TabBar.tsx · BARRA DE PESTAÑAS (simulada)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * Una barra para cambiar entre la pantalla de FlatList y la de ScrollView.
 *
 * ⚠️ Esto NO es navegación de verdad. No hay historial, ni animación de
 * transición, ni URL, ni botón "atrás" del sistema. Es un `useState` en
 * `App.tsx` que guarda qué pestaña está activa, y un `if` que decide qué
 * pantalla renderizar.
 *
 * Y está perfecto que sea así por ahora: sirve para entender que "navegar", en
 * el fondo, es DECIDIR QUÉ COMPONENTE MOSTRAR. Cuando en el Módulo 5 aparezca
 * React Navigation con su Bottom Tabs Navigator, no va a ser magia nueva: va a
 * ser esta misma idea, ya resuelta y con las animaciones puestas.
 * ════════════════════════════════════════════════════════════════════════════ */

import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { TabKey } from '../types'
import { colors, radius, spacing } from '../theme'

type Props = {
  /** Qué pestaña está activa. Viene de arriba (de `App.tsx`), no la decide
   *  este componente. */
  active: TabKey

  /** Qué hacer cuando el usuario toca una pestaña.
   *
   *  Leé la firma con atención: `(tab: TabKey) => void`. Es una función que
   *  recibe una pestaña y no devuelve nada. `TabBar` no cambia el estado: AVISA
   *  que hubo un toque. Quien decide qué hacer con ese aviso es `App.tsx`.
   *
   *  Esto es un COMPONENTE CONTROLADO: no tiene memoria propia. Le decís qué
   *  mostrar (`active`) y te avisa lo que pasó (`onChange`). */
  onChange: (tab: TabKey) => void
}

/* Las pestañas como DATOS, no como JSX escrito a mano.
 *
 * Podríamos haber escrito dos <TouchableOpacity> uno abajo del otro. Pero al
 * definirlas como un array y recorrerlo con `.map()`, agregar una tercera
 * pestaña es sumar una línea acá — el JSX no se toca. Es el mismo patrón que
 * usamos con CATEGORIES en el formulario.
 *
 * Va FUERA del componente a propósito: es una constante que no cambia nunca,
 * así que no tiene sentido recrear el array en cada render. */
const TABS: Array<{ key: TabKey; icon: string; label: string }> = [
  { key: 'flatlist', icon: '⚡', label: 'FlatList' },
  { key: 'scrollview', icon: '🐢', label: 'ScrollView' }
]

export default function TabBar({ active, onChange }: Props) {
  return (
    <View style={styles.bar}>
      {/* `.map()` transforma cada objeto del array en un componente.
          Este es EL patrón para renderizar listas en React. */}
      {TABS.map((tab) => {
        // ¿Es esta la pestaña activa? Comparamos la clave de esta pestaña
        // con la que llegó por props.
        const isActive = tab.key === active

        return (
          <TouchableOpacity
            /* `key` es obligatoria en todo elemento generado con `.map()`.
               No es una prop que podamos leer adentro del componente: es una
               pista para React sobre la identidad del elemento. Sin ella, React
               tira un warning en la consola y pierde eficiencia al actualizar.
               Usamos `tab.key` porque es única y estable. */
            key={tab.key}
            /* Estilo condicional: base siempre, y si está activa le sumamos
               el fondo naranja. `isActive && styles.tabActive` devuelve `false`
               cuando no está activa, y React Native ignora los `false` dentro
               de un array de estilos. */
            style={[styles.tab, isActive && styles.tabActive]}
            /* Cuando el usuario toca, avisamos hacia arriba QUÉ pestaña se tocó.
               Necesitamos la arrow function porque queremos pasarle un argumento.
               Si escribiéramos `onPress={onChange(tab.key)}` la estaríamos
               EJECUTANDO durante el render, no al tocar. */
            onPress={() => onChange(tab.key)}
            /* Opacidad al mantener presionado: 0.8 = feedback sutil.
               El default es 0.2, que parpadea demasiado. */
            activeOpacity={0.8}
          >
            <Text style={styles.icon}>{tab.icon}</Text>
            <Text style={[styles.label, isActive && styles.labelActive]}>{tab.label}</Text>
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  bar: {
    // Las pestañas se acomodan en fila. Recordá: en React Native el default
    // es 'column', al revés que en CSS web.
    flexDirection: 'row',
    backgroundColor: colors.dark,
    borderRadius: radius.lg,
    // Un padding chiquito para que la pestaña activa quede "encajada" adentro
    // de la barra en lugar de tocar los bordes.
    padding: spacing.xs,
    gap: spacing.xs
  },
  tab: {
    /* `flex: 1` en AMBAS pestañas hace que se repartan el ancho en partes
       iguales, sin importar cuánto mida el texto de cada una. Es la forma
       correcta de hacer una barra pareja: nunca hardcodees `width: '50%'`,
       porque si mañana agregás una tercera pestaña se rompe. */
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm - 2,
    paddingVertical: spacing.sm + 2,
    borderRadius: radius.md
  },
  tabActive: {
    backgroundColor: colors.primary
  },
  icon: {
    fontSize: 14
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    // Blanco semitransparente: la pestaña inactiva se lee, pero claramente
    // en segundo plano. Es más elegante que usar un gris fijo, porque se
    // adapta al fondo oscuro de la barra.
    color: 'rgba(255,255,255,0.55)'
  },
  labelActive: {
    color: colors.surface // blanco pleno = la activa "se enciende"
  }
})
