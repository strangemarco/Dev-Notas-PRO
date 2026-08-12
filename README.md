# Dev-Notas-PRO 

Dev-Notas-PRO es una aplicación web diseñada específicamente para desarrolladores que necesitan un espacio rápido, seguro y con soporte para código donde puedan guardar sus apuntes, snippets y notas técnicas.

## Características Principales

*   **Autenticación Segura:** Sistema completo de registro e inicio de sesión seguro utilizando **Supabase**.
*   **Gestión de Notas:** Crear, leer, actualizar y eliminar (CRUD) notas de forma intuitiva.
*   **Soporte para Código (Highlight.js):** Las notas renderizan bloques de código con resaltado de sintaxis, ideal para guardar *snippets* de múltiples lenguajes de programación.
*   **Soporte para Markdown:** Escribe tus notas utilizando la sintaxis de Markdown para aplicar estilos, crear listas, tablas y más.
*   **Modo Oscuro/Claro:** Interfaz de usuario que se adapta a tus preferencias visuales con un toggle de tema integrado.
*   **Diseño Responsivo:** Funciona perfectamente tanto en dispositivos móviles como en pantallas grandes de escritorio.

##  Stack Tecnológico

El proyecto está construido utilizando las siguientes tecnologías modernas:

*   **Frontend:**
    *   **React** (Librería principal de UI)
    *   **Vite** (Herramienta de compilación y servidor de desarrollo ultrarrápido)
    *   **React Router Dom** (Para la navegación entre páginas como Login, Registro y el Dashboard de Notas)
*   **Backend & Base de Datos:**
    *   **Supabase** (BaaS open-source que proporciona la base de datos PostgreSQL, autenticación de usuarios y políticas de seguridad RLS).
*   **Estilos y Utilidades:**
    *   **CSS Vanilla** (Diseño moderno utilizando propiedades personalizadas, Flexbox y Grid).
    *   **Highlight.js** (Para el resaltado de sintaxis en bloques de código).

## Instalación y Ejecución Local

Si deseas correr este proyecto en tu propia máquina, sigue estos pasos:

1.  **Clona el repositorio**
    ```bash
    git clone <URL_DEL_REPOSITORIO>
    cd devnotas-react
    ```

2.  **Instala las dependencias**
    ```bash
    npm install
    ```

3.  **Configura las Variables de Entorno**
    Crea un archivo llamado `.env.local` en la raíz del proyecto y añade las credenciales de tu proyecto de Supabase:
    ```env
    VITE_SUPABASE_URL=tu_url_de_supabase_aqui
    VITE_SUPABASE_ANON_KEY=tu_anon_key_de_supabase_aqui
    ```

4.  **Inicia el servidor de desarrollo**
    ```bash
    npm run dev
    ```
    La aplicación estará disponible en `http://localhost:5173`.

##  Despliegue en Vercel

Esta aplicación está optimizada para ser desplegada fácilmente en **Vercel**. 

**Importante:** Al desplegar en Vercel (o cualquier otra plataforma), recuerda ir a la sección de **"Environment Variables" (Variables de Entorno)** en la configuración de tu proyecto y agregar `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`. De lo contrario, la aplicación mostrará una pantalla en blanco y errores en consola al intentar conectarse a la base de datos.

##  Estructura del Proyecto

```
src/
├── assets/         # Imágenes, iconos y otros recursos estáticos.
├── components/     # Componentes de React reutilizables (Botones, Inputs, Cards de Notas).
├── contexts/       # Contextos de React (ej. AuthProvider para el estado global del usuario).
├── hooks/          # Custom Hooks (ej. useTheme para manejar el modo oscuro).
├── pages/          # Las vistas principales (LoginPage, RegisterPage, NotesPage).
├── services/       # Lógica de conexión con Supabase (API calls).
├── styles/         # Archivos CSS modulares u hojas de estilo base.
├── App.jsx         # Componente raíz donde se definen las rutas.
└── main.jsx        # Punto de entrada de la aplicación React.
```

---
*Desarrollado con ❤️ para mejorar la productividad de los programadores.*
