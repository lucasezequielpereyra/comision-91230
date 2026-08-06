/* ════════════════════════════════════════════════════════════════════════════
 * src/components/EmptyState.tsx · ESTADO VACÍO
 * ════════════════════════════════════════════════════════════════════════════
 *
 * Una pantalla en blanco es un error de diseño, no un caso borde. Cuando el
 * usuario abre la app por primera vez (o completa y borra todo), lo que ve es
 * ESTA pantalla — su primera impresión de la app.
 *
 * Un buen estado vacío responde tres preguntas en un vistazo:
 *   1. ¿Está rota la app?      → No: hay un dibujo y un mensaje claro.
 *   2. ¿Por qué no veo nada?   → "No tienes tareas pendientes".
 *   3. ¿Qué hago ahora?        → "Empieza por crear una con el botón de abajo".
 *
 * Es un requisito del checkpoint del Módulo 4.
 * ════════════════════════════════════════════════════════════════════════════ */

import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { colors, spacing } from '../theme'

/* Este componente NO recibe props: siempre muestra lo mismo. Cuando un
 * componente no depende de nada externo, la función no lleva parámetros.
 *
 * `export default` = "esto es lo principal que exporta el archivo". Por eso
 * quien lo importa puede elegir el nombre libremente (sin llaves):
 *     import EmptyState from '../components/EmptyState' */
export default function EmptyState() {
  return (
    <View style={styles.container}>
      {/* Un emoji como ilustración: no requiere instalar librerías de íconos
          ni sumar imágenes al bundle, y se ve nítido en cualquier pantalla.
          Ojo: en React Native TODO texto va dentro de <Text>. Escribir
          🗒️ suelto dentro de un <View> hace que la app explote. */}
      <Text style={styles.emoji}>🗒️</Text>

      {/* Mensaje principal: informa. */}
      <Text style={styles.title}>¡No tienes tareas pendientes!</Text>

      {/* Mensaje secundario: guía hacia la acción siguiente. */}
      <Text style={styles.subtitle}>Empieza por crear una con el botón de abajo.</Text>
    </View>
  )
}

/* ─── ESTILOS ─────────────────────────────────────────────────────────────────
 *
 * `StyleSheet.create()` no es obligatorio (podrías pasar un objeto suelto),
 * pero conviene por dos razones:
 *   • Valida las propiedades: si escribís `paddingg` te avisa.
 *   • Define los estilos UNA vez al cargar el módulo, en lugar de recrear el
 *     objeto en cada render.
 *
 * Por convención van al final del archivo: arriba lo que se ve, abajo cómo se
 * ve. Cuando alguien abre el archivo, lo primero que lee es la estructura. */
const styles = StyleSheet.create({
  container: {
    // Centrado horizontal. En React Native el eje por defecto es 'column'
    // (vertical), así que alignItems trabaja sobre el eje horizontal.
    alignItems: 'center',

    // Mucho aire arriba y abajo: el vacío es parte del mensaje.
    paddingVertical: spacing.xxl * 2, // 64
    paddingHorizontal: spacing.xl,

    // `gap` separa a TODOS los hijos entre sí sin tener que ponerle
    // margin a cada uno. Está disponible en React Native moderno y es
    // muchísimo más prolijo que `marginBottom` repetido.
    gap: spacing.sm
  },
  emoji: {
    fontSize: 48,
    marginBottom: spacing.sm
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.ink,
    // `textAlign` centra el texto DENTRO de su caja (por si ocupa dos
    // renglones). `alignItems` del padre centra la caja. Son cosas distintas
    // y hacen falta las dos.
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 14,
    color: colors.muted, // gris: es información de apoyo
    textAlign: 'center'
  }
})
