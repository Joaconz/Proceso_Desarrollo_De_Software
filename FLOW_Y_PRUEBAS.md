# Guía de Pruebas y Flujo de Estados del Partido

¡Hola! Aquí tienes la guía detallada de cómo funciona el flujo de estados de los partidos y qué debes probar para asegurarte de que todo funciona al 100%.

## 1. El Flujo de Estados

El ciclo de vida de un partido avanza de manera estricta y controlada mediante el Patrón State. El flujo normal es el siguiente:

1. **`NECESITAMOS_JUGADORES`**
   - **Cómo se llega aquí:** Se asigna automáticamente al crear un partido. Ocurre también si el partido estaba "Armado" y alguien lo abandona volviendo a faltar cupos.
   - **Acciones permitidas:** 
     - "Unirme al Partido" (Jugadores pueden inscribirse).
     - "Abandonar Partido" (Jugadores inscritos que no son creadores se pueden bajar).
     - "Editar Partido" (El creador puede modificar fecha, hora y ubicación).
     - "Cancelar Partido" (El creador puede cancelar la gestión).
   - **Acciones Denegadas:** Confirmar, Iniciar, Finalizar.

2. **`PARTIDO_ARMADO`**
   - **Cómo se llega aquí:** Automáticamente en el instante en que se inscribe el último jugador necesario para llenar el cupo requerido.
   - **Acciones permitidas:**
     - "Confirmar Encuentro" (El creador valida que ya tienen a la gente y avanza el estado).
     - "Editar Partido" (Aún se pueden ajustar datos si el creador lo necesita antes de confirmar).
     - "Cancelar Partido" (Si el creador lo decide).
   - **Acciones Denegadas:** Unirse (ya está lleno), Abandonar (desde la UI ya no se puede bajar a alguien a partir de este punto para evitar que se caiga a último minuto, aunque la API podría manejar penalizaciones futuras), Iniciar, Finalizar.

3. **`CONFIRMADO`**
   - **Cómo se llega aquí:** El creador hace clic en "Confirmar Encuentro".
   - **Acciones permitidas:** 
     - "Iniciar Partido" (Cuando llega la hora del encuentro).
     - "Cancelar Partido" (En caso de lluvia o similar).
   - **Acciones Denegadas:** Todas las demás (Editar, Unirse, Abandonar).

4. **`EN_JUEGO`**
   - **Cómo se llega aquí:** El creador hace clic en "Iniciar Partido".
   - **Acciones permitidas:**
     - "Finalizar Partido".
   - **Acciones Denegadas:** Cancelar, Editar, Unirse, Confirmar, etc.

5. **`FINALIZADO`**
   - **Cómo se llega aquí:** El creador hace clic en "Finalizar Partido".
   - **Efecto:** El ciclo termina. No se permite ninguna otra acción. Estático en el historial.

6. **`CANCELADO`**
   - **Cómo se llega aquí:** Desde cualquier estado pre-partido (`NECESITAMOS_JUGADORES`, `PARTIDO_ARMADO`, `CONFIRMADO`), si el creador elige Cancelar.
   - **Efecto:** El ciclo de vida termina prematuramente, inhabilitando todo.

---

## 2. Lista de Casos a Probar (Testing Checklist)

Aquí tienes una lista paso a paso para que pruebes el sistema tú mismo:

### Prueba A: Corrección de Creador Doble
- [x] Crea un nuevo partido desde cero (Botón "Crear Partido").
- [x] Entra a ver sus detalles.
- [x] **Verificación:** Tu usuario (el organizador) debe aparecer en la lista de jugadores inscritos **una sola vez**.

### Prueba B: Flujo Completo (Happy Path)
- [x] **Creación:** Una vez creado el partido, asegúrate de que el estado muestre "Necesitamos Jugadores" o "Faltan Jugadores".
- [x] **Llenado (`PARTIDO_ARMADO`):** Puedes abrir Pestañas en modo Incógnito o usar POSTMAN para rellenar de bots el partido, O BIEN, para probar fácil desde el frontend: crea un partido de un deporte de **solo 2 jugadores permitidos** (ej. Tenis Singles).
   - *Nota:* Ya estás tú adentro, solo falta 1.
   - Regístrate con otro mail falso, entra con ese usuario (la lógica actual de Auth agarra el correo simplemente como mock o ID 1, así que presta atención a cómo haces el login en tu entorno si no tienes Auth completo). 
   - Al unirse el 2do jugador, verifica que el estado de la UI y del Backend cambie a `PARTIDO_ARMADO`.
- [x] **Confirmación (`CONFIRMADO`):** Entra con el perfil del Creador. Verás que se habilita el botón verde "Confirmar Encuentro". Haz clic y verifica que avance el estado.
- [x] **Inicio (`EN_JUEGO`):** Verás que aparece el botón "Iniciar Partido". Úsalo y el estado del UI deberá enmarcar ese paso actual.
- [x] **Fin (`FINALIZADO`):** Haz clic en "Finalizar Partido". Los botones de acciones desaparecerán.

### Prueba C: Abandonar y Retroceder
- [x] Únete a un partido que está buscando jugadores (siendo tú un usuario NO creador del mismo).
- [x] Usa el botón "Abandonar Partido".
- [x] **Verificación:** Tu nombre se esfuma de la lista de inscriptos y los cupos disponibles aumentan +1. El partido sigue en "Necesitamos Jugadores".

### Prueba D: Edición Temprana
- [x] Creado un partido, entra con el creador y usa "Editar Partido".
- [x] Cambia la hora y cancha.
- [x] Guarda y comprueba que se haya actualizado correctamente sin tirar error de negocio.

### Prueba E: Cancelación
- [x] Como creador, durante "Necesitamos Jugadores" o "Confirmado", presiona "Cancelar Partido".
- [x] Confirma la alerta del navegador.
- [x] **Verificación:** El layout cambia y muestra una advertencia roja de Partido Cancelado. Ya no se pueden tomar acciones.

---

> **Nota Adicional:** El problema de la "inscripción doble" que experimentabas se debía a que cuando un usuario crea el partido, lo añade al objeto tanto el `PartidoFactory` / `Constructor de Partido` como el propio servicio `PartidoService.java`. He borrado uno de esos llamados duplicados y ahora la base de datos solo agregará la relación al usuario una sola vez.
