# Proyecto - **[SantexAcademy]**

## Descripción

En este proyecto hemos desarrollado una aplicación web utilizando Angular en el frontend y Node.js con Express en el backend. La aplicación permite realizar peticiones a una api que trae los players de fifa, tambien se pueden cargar datos en formato CSV y exportar

## Decisiones Técnicas y Funcionales

### 1. **Frontend (Angular)**

- **Tecnologías utilizadas**:
  - **Angular**: Framework de desarrollo frontend basado en TypeScript, que nos permitió estructurar la aplicación de manera eficiente.
  - **Bootstrap**: Se utilizó la versión 5.3.3 de Bootstrap para el diseño responsivo y la creación de componentes visuales con una interfaz de usuario moderna.
  - **Bootstrap Icons**: Se empleó esta biblioteca para añadir iconos vectoriales y mejorar la interfaz.
  - **Chart.js & ng2-charts**: Se integraron estas bibliotecas para la creación y visualización de gráficos en la interfaz.
  - **RxJS**: Para manejar la programación reactiva y los flujos de datos asincrónicos de manera eficiente en Angular.

### 2. **Backend (Node.js / Express)**

- **Tecnologías utilizadas**:

  - **Node.js con Express**: Utilizamos Node.js con Express para crear un servidor HTTP robusto y flexible, que maneja las solicitudes y respuestas de la API.
  - **Sequelize y MySQL**: Se empleó Sequelize como ORM para interactuar con una base de datos MySQL. MySQL se utilizó para almacenar y gestionar los datos.
  - **JWT y autenticación**: La autenticación en la aplicación se maneja a través de JSON Web Tokens (JWT), lo que proporciona una solución segura y escalable.
  - **Bcryptjs**: Se utilizó para la encriptación de contraseñas, asegurando que los datos sensibles estén protegidos.
  - **Multer**: Para gestionar la carga de archivos en el servidor.
  - **Socket.io**: Se usó para habilitar la comunicación en tiempo real entre el cliente y el servidor, permitiendo actualizaciones instantáneas.

### 3. **Gestión de Entorno y Configuración**

- **dotenv**: Para gestionar las variables de entorno, como credenciales de base de datos y claves secretas, de manera segura.
- **cors**: Se configuró **CORS** para permitir solicitudes del frontend alojado en un dominio diferente (por ejemplo, el cliente Angular en `localhost:4200`).

---

## Instalación y Ejecución del Proyecto

### Requisitos previos

- Tener **Node.js** y **npm** instalados.
- Tener **MySQL** corriendo en tu entorno local o configurar un servicio de base de datos.

### Instrucciones

#### 1. **Clonar el repositorio**

Primero, clona el repositorio a tu máquina local:

```bash
git clone https://github.com/luchopesce/SantexChallenge
cd SantexChallenge
```

## 2. Instalar las Dependencias

Instala las dependencias necesarias en ambos directorios (`server` y `client`):

- **Backend (Node.js)**

  ```bash
  cd server
  npm install
  ```

- **Frontend (Angular)**

  ```bash
  cd client
  npm install
  ```

### 3. Configurar las Variables de Entorno

Crea un archivo `.env` en la raíz del directorio `server` con las siguientes variables:

```dotenv
DB_NAME=SantexDB
DB_USER=root
DB_PASSWORD=santex
DB_HOST=mysql
SERVER_PORT=3000
SERVER_HTTP=http://localhost
SERVER_NAME=/api
CLIENT_HTTP=http://localhost:4200
JWT_SECRET=santexjwt
```

### 4. Iniciar la Base de Datos (MySQL)

Si estás usando Docker, puedes crear un archivo `docker-compose.yml` en la raíz del proyecto para configurar MySQL:

```yaml
version: "3.8"
services:
  mysql:
    image: mysql:8.0
    container_name: mysql-container
    environment:
      MYSQL_ROOT_PASSWORD: santex
      MYSQL_DATABASE: SantexDB
    ports:
      - "3306:3306"
    networks:
      - app-network
    volumes:
      - mysql-data:/var/lib/mysql

  server:
    build: ./server
    container_name: node-server
    environment:
      DB_NAME: SantexDB
      DB_USER: root
      DB_PASSWORD: santex
      DB_HOST: mysql
      SERVER_PORT: 3000
      SERVER_HTTP: http://localhost
      SERVER_NAME: /api
      CLIENT_HTTP: http://localhost:4200
      JWT_SECRET: santexjwt
    ports:
      - "3000:3000"
    depends_on:
      - mysql
    networks:
      - app-network

networks:
  app-network:
    driver: bridge

volumes:
  mysql-data:
    driver: local
```

### 4. Iniciar los Contenedores

Inicia los contenedores con el siguiente comando:

```bash
docker-compose up --build
```

En caso de problemas para eliminar lo creado

```bash
docker-compose down -v
```

Luego volver a ejecutarlo

```bash
docker-compose up --build
```

#### 5. **Ejecutar el Proyecto**

- **Frontend (Angular)**: En el directorio `client`, ejecuta:

  ```bash
  ng serve
  ```
