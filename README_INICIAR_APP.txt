Grade Tracker App - Portal de Padres
====================================

Aplicación móvil/web desarrollada con Ionic y Angular para que padres o tutores puedan consultar boletas escolares, revisar calificaciones, descargar PDF, firmar boletas digitalmente, recibir avisos y comunicarse con docentes.

Este proyecto funciona con dos partes:

1. Frontend: aplicación Ionic/Angular.
2. Backend: API local con Node/Bun, PostgreSQL y autenticación JWT.

Para que la app funcione correctamente en otro dispositivo, es necesario instalar y ejecutar tanto el backend como el frontend.


1. Requisitos previos
---------------------

Antes de iniciar, instalar en la computadora:

- Git
- Node.js
- npm
- Ionic CLI
- Bun
- PostgreSQL
- Navegador web actualizado
- Git Bash recomendado en Windows

Para verificar que estén instalados:

node -v
npm -v
ionic -v
bun -v
git --version

Si Ionic no está instalado:

npm install -g @ionic/cli


2. Clonar los repositorios
--------------------------

Crear una carpeta donde se guardarán ambos proyectos. Por ejemplo:

mkdir App_proyecto
cd App_proyecto

Clonar el backend:

git clone -b andres https://github.com/andresjaramillo7/TC2007B.git TC2007B-Backend

Clonar el frontend:

git clone -b feature/boletas-hector https://github.com/ElishebaTL/TC2007B-App.git TC2007B-App

La estructura final debe quedar así:

App_proyecto
├── TC2007B-Backend
└── TC2007B-App


3. Configurar PostgreSQL
------------------------

El backend utiliza PostgreSQL como base de datos.

Primero, asegurarse de que PostgreSQL esté instalado y en ejecución.

En Windows se puede revisar desde:

Servicios > postgresql-x64

Debe aparecer como:

En ejecución

Crear una base de datos llamada:

grade_tracker

Se puede crear desde pgAdmin o desde terminal.

Ejemplo usando psql:

CREATE DATABASE grade_tracker;


4. Configurar el backend
------------------------

Entrar a la carpeta del backend:

cd TC2007B-Backend

Instalar dependencias:

bun install

Crear un archivo llamado .env en la raíz del backend:

TC2007B-Backend/.env

Agregar la siguiente configuración:

PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres123
DB_NAME=grade_tracker

JWT_SECRET=dev-secret
JWT_EXPIRES_IN=8h

CORS_ORIGIN=*

HTTPS_PORT=3443
TLS_KEY_PATH=.local-certs/localhost-key.pem
TLS_CERT_PATH=.local-certs/localhost-cert.pem

Importante: cambiar DB_PASSWORD si la contraseña de PostgreSQL en ese dispositivo es diferente.


5. Cargar datos iniciales en la base de datos
--------------------------------------------

Dentro de la carpeta del backend, ejecutar los seeds:

bun run seed
bun run seed:academic
bun run seed:grades
bun run seed:messaging
bun run seed:announcements

Estos comandos cargan usuarios, alumnos, materias, calificaciones, mensajes y avisos de prueba.


6. Iniciar el backend
---------------------

Para iniciar el backend, ejecutar:

bun run dev

El backend debe quedar corriendo en:

https://localhost:3443

La documentación Swagger se puede abrir en:

https://localhost:3443/api/docs

En Windows se recomienda correr el backend desde Git Bash, ya que algunos scripts utilizan bash.

Si el navegador muestra una advertencia de certificado, aceptar la advertencia y continuar. Esto es normal porque el proyecto usa HTTPS local.

Swagger no necesita quedarse abierto; solo sirve para probar endpoints, revisar documentación o aceptar el certificado local.


7. Configurar el frontend
-------------------------

Abrir otra terminal y entrar a la carpeta del frontend:

cd TC2007B-App

Instalar dependencias:

npm install

Revisar el archivo:

src/environments/environment.ts

Debe tener esta configuración:

export const environment = {
  production: false,
  apiUrl: 'https://localhost:3443/api'
};

Esto indica que la app Ionic consumirá la API local del backend.


8. Iniciar el frontend
----------------------

Dentro de la carpeta del frontend, ejecutar:

ionic serve

La app se abrirá en:

http://localhost:8100

La terminal del frontend debe permanecer abierta mientras se usa la aplicación.


9. Usuario de prueba
--------------------

Para iniciar sesión en la app:

Correo: tutor@example.com
Contraseña: Demo_Tutor123!

Si el inicio de sesión falla, revisar que:

- PostgreSQL esté activo.
- El backend esté corriendo.
- El archivo .env tenga la contraseña correcta de PostgreSQL.
- Los seeds se hayan ejecutado correctamente.
- Se haya aceptado el certificado local en https://localhost:3443/api/docs.


10. Orden correcto para ejecutar la app
--------------------------------------

Cada vez que se quiera usar la aplicación en el dispositivo, seguir este orden:

1. Verificar que PostgreSQL esté activo.
2. Abrir una terminal para el backend.
3. Ejecutar:

cd TC2007B-Backend
bun run dev

4. Abrir otra terminal para el frontend.
5. Ejecutar:

cd TC2007B-App
ionic serve

6. Abrir la app en:

http://localhost:8100

7. Iniciar sesión con el usuario de prueba.


11. Funcionalidades disponibles
-------------------------------

La aplicación permite:

- Inicio de sesión real con API.
- Protección de rutas.
- Consulta de hijos vinculados al tutor.
- Consulta de boletas por alumno.
- Visualización de materias, docentes y calificaciones.
- Descarga de boleta en PDF desde el backend.
- Firma digital de boletas.
- Registro de firma en base de datos.
- Consulta de avisos escolares.
- Marcar notificaciones como leídas.
- Envío y consulta de comentarios/chats.
- Cierre de sesión.


12. Probar rutas protegidas
---------------------------

Para comprobar que no se puede entrar sin iniciar sesión:

1. Abrir la consola del navegador.
2. Ejecutar:

localStorage.clear()

3. Recargar la página.
4. Intentar entrar directamente a:

http://localhost:8100/dashboard

La aplicación debe regresar automáticamente al login.


13. Reiniciar sesión
--------------------

Si la app abre directamente en el dashboard, significa que hay una sesión guardada en el navegador.

Para cerrar sesión:

- Usar el botón Cerrar sesión dentro del menú lateral.

O limpiar manualmente desde la consola del navegador:

localStorage.clear()

Después recargar la página.


14. Reiniciar firma de boletas para pruebas
-------------------------------------------

Las firmas se guardan en PostgreSQL.

Para borrar todas las firmas y volver a probar la firma digital:

DELETE FROM firmas_boleta;

Para borrar solo la firma del alumno 1 en el primer trimestre:

DELETE FROM firmas_boleta
WHERE alumno_id = 1
AND periodo = 'primer trimestre';

Después recargar la app.


15. Reiniciar notificaciones leídas
-----------------------------------

Las notificaciones vienen desde la API, pero el estado visual de “leído” se guarda en el navegador con localStorage.

Para reiniciar ese estado:

localStorage.removeItem('grade_tracker_read_notifications')

O para limpiar toda la sesión y datos locales:

localStorage.clear()


16. Problemas comunes
---------------------

El backend no inicia
~~~~~~~~~~~~~~~~~~~~

Revisar que se esté usando Git Bash y que PostgreSQL esté activo.

También revisar que el archivo .env exista y tenga la contraseña correcta de PostgreSQL.


La app no inicia sesión
~~~~~~~~~~~~~~~~~~~~~~~

Revisar que el backend esté corriendo en:

https://localhost:3443

También abrir:

https://localhost:3443/api/docs

Aceptar el certificado local si el navegador muestra advertencia.


La app abre directo en dashboard
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Eso significa que hay una sesión guardada.

Cerrar sesión desde el menú lateral o ejecutar en consola:

localStorage.clear()



~~~~~~~~~~~~~~~~~~

Revisar que el backend esté encendido, ya que el PDF se descarga desde la API.


PowerShell marca error con bash
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Usar Git Bash para correr el backend:

cd TC2007B-Backend
bun run dev


17. Notas importantes
---------------------

- El backend y el frontend deben estar corriendo al mismo tiempo.
- PostgreSQL debe estar activo.
- Swagger no necesita estar abierto para que la app funcione.
- El archivo .env no debe subirse a GitHub.
- No subir certificados .pem ni la carpeta .local-certs.
- Si se usa otro puerto o URL para el backend, actualizar environment.ts en el frontend.


18. Comandos rápidos
--------------------

Backend:

cd TC2007B-Backend
bun run dev

Frontend:

cd TC2007B-App
ionic serve

Limpiar sesión:

localStorage.clear()

Borrar firmas:

DELETE FROM firmas_boleta;


19. Estado actual
-----------------

La aplicación ya se encuentra conectada a la API local y cuenta con las funciones principales del portal de padres:

- Login real
- Rutas protegidas
- Dashboard
- Consulta de hijos
- Consulta de boletas
- Descarga de PDF desde backend
- Firma digital
- Notificaciones
- Comentarios
- Cierre de sesión

Con estos pasos, cualquier integrante puede clonar el proyecto, configurar la base de datos, iniciar backend y frontend, y ejecutar la app localmente en su propio dispositivo.
