# FlightOnTime - Predicción de Retrasos en Vuelos

Una aplicación web moderna para predecir retrasos en vuelos utilizando inteligencia artificial y análisis de datos históricos. Construida con React, TypeScript y Vite, ofrece una interfaz intuitiva para consultar información de vuelos, visualizar estadísticas y generar guías de viaje personalizadas.

## 🚀 Características Principales

### 📊 Predicción de Vuelos
- **Consulta Inteligente**: Predice la probabilidad de retraso basado en aerolínea, ruta, fecha y hora
- **Análisis Climático**: Integra datos meteorológicos para mayor precisión
- **Estadísticas en Tiempo Real**: Muestra porcentajes de puntualidad y tiempo estimado de retraso

### 🗺️ Visualización Interactiva
- **Mapa de Ruta**: Visualización geográfica de origen y destino usando Leaflet
- **Gráficos Estadísticos**: Dashboard mensual con tendencias de retrasos por aerolínea
- **Comparativas de Ruta**: Análisis histórico de retrasos entre aeropuertos específicos

### 🤖 Guía de Viaje Inteligente
- **Información Personalizada**: Guías generadas por IA basadas en destino y fecha
- **Análisis Climático Histórico**: Recomendaciones de equipaje inteligente
- **Información Práctica**: Enchufes, moneda, emergencias, transporte y gastronomía local
- **Puntos de Interés**: Lugares recomendados con navegación integrada
- **Inteligencia de Seguridad**: Alertas de riesgo y consejos de seguridad

### 🎨 Interfaz de Usuario
- **Diseño Responsivo**: Optimizado para desktop y móvil
- **Tema Laptop**: Interfaz inmersiva que simula una aplicación de escritorio
- **Navegación Intuitiva**: Tres vistas principales: Buscador, Estadísticas y Guía de Viaje

## 🏗️ Arquitectura del Proyecto

### Estructura de Directorios
```
src/
├── components/          # Componentes React reutilizables
│   ├── DashboardChart.tsx      # Gráfico de estadísticas mensuales
│   ├── FlightForm.tsx          # Formulario de búsqueda de vuelos
│   ├── FlightMap.tsx           # Mapa interactivo de rutas
│   ├── FlightStats.tsx         # Estadísticas de predicción
│   ├── RouteDelayChart.tsx     # Comparativa de retrasos por ruta
│   ├── TravelGuide.tsx         # Componente principal de guía de viaje
│   └── TravelGuideMap.tsx      # Mapa de puntos de interés
├── services/           # Servicios de API y lógica de negocio
│   └── api.ts          # Cliente HTTP con Axios y tipos TypeScript
├── assets/             # Recursos estáticos (imágenes, iconos)
└── main.tsx           # Punto de entrada de la aplicación
public/                 # Archivos públicos servidos por Vite
├── vite.svg           # Logo de Vite
└── ...
package.json           # Dependencias y scripts del proyecto
tsconfig.json          # Configuración de TypeScript
tailwind.config.js     # Configuración de Tailwind CSS
postcss.config.js      # Configuración de PostCSS
eslint.config.js       # Configuración de ESLint
```

### Flujo de Datos

```
Usuario → FlightForm → App.tsx → API Service → Backend
    ↓           ↓           ↓           ↓
 Resultados ← FlightStats ← App.tsx ← API Response
    ↓           ↓           ↓
   Mapa ← FlightMap ← App.tsx
    ↓           ↓           ↓
Dashboard ← DashboardChart ← App.tsx
    ↓           ↓           ↓
TravelGuide ← TravelGuide ← App.tsx
```

### Tecnologías Utilizadas

#### Frontend
- **React 19** - Framework de UI con hooks modernos
- **TypeScript** - Tipado estático para mayor robustez
- **Vite** - Herramienta de construcción rápida con HMR
- **Tailwind CSS** - Framework CSS utility-first
- **Recharts** - Biblioteca de gráficos para React
- **Leaflet** - Mapas interactivos con React Leaflet
- **Axios** - Cliente HTTP para llamadas a API

#### Desarrollo
- **ESLint** - Linting con reglas específicas para React y TypeScript
- **PostCSS** - Procesamiento de CSS con Autoprefixer
- **React DatePicker** - Selector de fechas personalizado

### Patrón de Arquitectura

La aplicación sigue el patrón **Container/Presentational Components**:

- **App.tsx** (Container): Maneja estado global, lógica de negocio y llamadas a API
- **Componentes Presentacionales**: Enfocados únicamente en la UI y reciben datos por props

#### Gestión de Estado
- **Lifting State Up**: Estado compartido elevado al componente padre (App.tsx)
- **Props Drilling Controlado**: Comunicación unidireccional de datos
- **Efectos Secundarios**: useEffect para cargar datos iniciales y manejar cambios

## 📦 Instalación y Configuración

### Prerrequisitos
- **Node.js** >= 18.0.0
- **npm** >= 8.0.0 o **yarn** >= 1.22.0
- **Backend API** corriendo en `http://localhost:8080` (ver repositorio backend)

### Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/educhile1/front_flightontime.git
   cd front_flightontime
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   # o
   yarn install
   ```

3. **Configurar variables de entorno** (opcional)
   ```bash
   # Crear archivo .env.local
   VITE_API_BASE_URL=http://localhost:8080/api/v1
   ```

4. **Iniciar servidor de desarrollo**
   ```bash
   npm run dev
   # o
   yarn dev
   ```

   La aplicación estará disponible en `http://localhost:5173`

### Comandos Disponibles

```bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo
npm run build        # Construye para producción
npm run preview      # Vista previa de build de producción
npm run lint         # Ejecuta ESLint
```

## 🔧 Configuración de Desarrollo

### ESLint
La configuración incluye reglas para:
- React Hooks
- TypeScript
- Mejores prácticas de React

Para reglas más estrictas, actualizar `eslint.config.js`:
```js
export default defineConfig([
  // ... configuración existente
  tseslint.configs.recommendedTypeChecked,
  tseslint.configs.strictTypeChecked,
])
```

### TypeScript
Configuración dividida en:
- `tsconfig.json`: Configuración base
- `tsconfig.app.json`: Configuración específica de la app
- `tsconfig.node.json`: Configuración para herramientas Node.js

### Tailwind CSS
Configurado con PostCSS y Autoprefixer. Personalizaciones en `tailwind.config.js`.

## 📚 Uso de la Aplicación

### 1. Búsqueda de Vuelos
1. Seleccionar aerolínea de la lista desplegable
2. Elegir aeropuerto de origen y destino
3. Seleccionar fecha y hora de salida
4. Ingresar número de vuelo (opcional)
5. Hacer clic en "Consultar"

### 2. Visualización de Resultados
- **Mapa**: Muestra la ruta entre aeropuertos
- **Estadísticas**: Probabilidad de retraso y tiempo estimado
- **Gráfico de Ruta**: Comparativa histórica de retrasos

### 3. Dashboard de Estadísticas
- Cambiar a vista "Estadísticas" en la barra superior
- Seleccionar aerolínea para ver tendencias mensuales
- Gráfico interactivo con datos históricos

### 4. Guía de Viaje
- Cambiar a vista "Guía de Viaje"
- Seleccionar destino en el buscador
- La IA genera una guía personalizada con:
  - Información del destino
  - Análisis climático
  - Recomendaciones de equipaje
  - Transporte desde el aeropuerto
  - Puntos de interés con mapas
  - Información gastronómica
  - Consejos de seguridad

## 🔌 API Reference

### Endpoints Utilizados

#### Predicción de Vuelos
```typescript
POST /api/v1/predict
```
**Request:**
```json
{
  "flight": {
    "flightNumber": "string",
    "airline": "number",
    "origin": "number",
    "destination": "number",
    "departureTime": "string"
  },
  "dayOfWeek": "number",
  "hour": "number",
  "minute": "number",
  "month": "number"
}
```

#### Aerolíneas
```typescript
POST /api/v1/get-airline
```
**Request:**
```json
{
  "active": "true"
}
```

#### Aeropuertos
```typescript
POST /api/v1/get-airport
```

#### Estadísticas Mensuales
```typescript
GET /api/v1/dashboard/delays-by-month?opUniqueCarrier={id}
```

#### Guía de Viaje
```typescript
POST /api/v1/travel-guide
```
**Request:**
```json
{
  "latitude": "string",
  "longitude": "string",
  "travelDate": "DD-MM"
}
```

#### Retrasos por Ruta
```typescript
GET /api/v1/delays/route?origin={id}&destination={id}
```

### Tipos TypeScript

Los tipos principales están definidos en `src/services/api.ts`:
- `FlightData`: Datos procesados de predicción
- `Airline`: Información de aerolíneas
- `Airport`: Datos de aeropuertos
- `TravelGuideResponse`: Respuesta completa de guía de viaje

## 🧪 Testing

### Configuración de Tests
```bash
# Instalar dependencias de testing
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

### Ejecutar Tests
```bash
npm run test           # Ejecutar tests una vez
npm run test:watch     # Ejecutar tests en modo watch
npm run test:ui        # Interfaz visual para tests
```

### Estructura de Tests
```
src/
├── components/
│   ├── __tests__/           # Tests de componentes
│   │   ├── FlightForm.test.tsx
│   │   └── FlightStats.test.tsx
│   └── ...
└── services/
    ├── __tests__/           # Tests de servicios
    │   └── api.test.ts
    └── ...
```

## 🔧 Solución de Problemas

### Problemas Comunes

#### Error de conexión con el backend
```
Error: Network Error
```
**Solución:**
1. Verificar que el backend esté ejecutándose en `http://localhost:8080`
2. Comprobar la configuración de CORS en el backend
3. Revisar la conectividad de red

#### Error de dependencias
```
Cannot resolve dependency
```
**Solución:**
```bash
rm -rf node_modules package-lock.json
npm install
```

#### Error de TypeScript
```
Property 'X' does not exist on type 'Y'
```
**Solución:**
- Verificar que los tipos estén correctamente importados
- Ejecutar `npm run lint` para ver errores detallados
- Revisar la configuración de TypeScript

#### Problemas con mapas (Leaflet)
```
Map container is already initialized
```
**Solución:**
- Asegurar que el contenedor del mapa tenga un `key` único en React
- Verificar que Leaflet CSS esté correctamente importado

#### Error de build de producción
```
Failed to minify the bundle
```
**Solución:**
- Verificar que no haya imports dinámicos problemáticos
- Comprobar que todas las dependencias estén en `dependencies` (no `devDependencies`)

### Logs de Depuración

Para habilitar logs detallados en desarrollo:
```typescript
// En src/services/api.ts
console.log('API Request:', requestData);
console.log('API Response:', response.data);
```

### Variables de Entorno

Archivo `.env.local`:
```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
VITE_DEBUG=true
VITE_MAPBOX_TOKEN=your_token_here
```

## 🚀 Despliegue

### Build de Producción
```bash
npm run build
```

Los archivos optimizados se generan en `dist/`.

### Opciones de Despliegue

#### Vercel (Recomendado)
1. Conectar repositorio a Vercel
2. Configurar build settings:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
3. Configurar variables de entorno:
   - `VITE_API_BASE_URL`: URL de tu API en producción

#### Netlify
1. Conectar repositorio a Netlify
2. Configurar build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
3. Configurar redireccionamiento para SPA:
   ```txt
   /*    /index.html   200
   ```

#### Docker
```dockerfile
# Dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```nginx
# nginx.conf
events {
    worker_connections 1024;
}
http {
    include /etc/nginx/mime.types;
    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;
        location / {
            try_files $uri $uri/ /index.html;
        }
        location /api {
            proxy_pass http://backend:8080;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }
    }
}
```

#### Despliegue Manual
```bash
# Construir
npm run build

# Servir con servidor estático
npx serve dist

# O con nginx
sudo cp -r dist/* /var/www/html/
```

### Configuración de Producción

#### Variables de Entorno
```env
VITE_API_BASE_URL=https://api.tu-dominio.com/v1
VITE_ENVIRONMENT=production
VITE_SENTRY_DSN=your_sentry_dsn
```

#### Optimizaciones
- **Code Splitting**: Implementado automáticamente por Vite
- **Minificación**: Terser para JavaScript, CSSNano para CSS
- **Compresión**: Gzip/Brotli en el servidor
- **CDN**: Considera usar CDN para assets estáticos

### Monitoreo y Analytics

#### Error Tracking
```bash
npm install @sentry/react @sentry/tracing
```

#### Analytics
```bash
npm install @vercel/analytics
# o
npm install gtag
```

### Checklist de Despliegue

- [ ] Build de producción exitoso
- [ ] Variables de entorno configuradas
- [ ] Backend API accesible
- [ ] HTTPS habilitado
- [ ] Tests pasando
- [ ] Performance audit ejecutado
- [ ] SEO básico configurado

## 🤝 Contribución

### Guía para Contribuidores

1. **Fork** el proyecto
2. Crear rama para feature: `git checkout -b feature/nueva-funcionalidad`
3. **Commit** cambios: `git commit -m 'Agrega nueva funcionalidad'`
4. **Push** a la rama: `git push origin feature/nueva-funcionalidad`
5. Abrir **Pull Request**

### Estándares de Código

- Usar TypeScript estrictamente tipado
- Seguir convenciones de nomenclatura de React
- Mantener cobertura de tipos > 90%
- Pasar ESLint sin errores
- Commits en español (como el proyecto)

### Áreas de Mejora
- [ ] Agregar tests unitarios e integración
- [ ] Implementar PWA para uso offline
- [ ] Soporte para múltiples idiomas (i18n)
- [ ] Optimización de performance con React.memo y lazy loading
- [ ] Integración con APIs de vuelos en tiempo real
- [ ] Sistema de caché para respuestas de API
- [ ] Notificaciones push para actualizaciones de vuelos
- [ ] Modo oscuro/claro
- [ ] Exportación de datos en PDF/Excel
- [ ] Integración con servicios de mapas adicionales

## ⚡ Optimización y Performance

### Métricas de Rendimiento

#### Lighthouse Scores (Objetivo)
- **Performance**: > 90
- **Accessibility**: > 95
- **Best Practices**: > 95
- **SEO**: > 90

#### Bundle Size
- **Initial Load**: < 200KB gzipped
- **Main Bundle**: < 150KB gzipped
- **Vendor Chunk**: < 100KB gzipped

### Optimizaciones Implementadas

#### Code Splitting
```typescript
// Lazy loading de componentes
const TravelGuide = lazy(() => import('./components/TravelGuide'));
const DashboardChart = lazy(() => import('./components/DashboardChart'));
```

#### Image Optimization
```typescript
// Usar WebP con fallback
<picture>
  <source srcSet="/image.webp" type="image/webp">
  <img src="/image.jpg" alt="Descripción">
</picture>
```

#### Bundle Analysis
```bash
npm install -D webpack-bundle-analyzer
npm run build -- --mode analyze
```

### Monitoreo de Performance

#### Web Vitals
- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1

#### Herramientas de Monitoreo
```bash
# Lighthouse CI
npm install -D lighthouse
lhci autorun

# Web Vitals
npm install web-vitals
```

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver archivo `LICENSE` para más detalles.

## 🙏 Agradecimientos

- **Backend API**: Desarrollado con Spring Boot y machine learning
- **Datasets**: Datos históricos de vuelos de EE.UU.
- **Bibliotecas Open Source**: React, Leaflet, Recharts y comunidad

## 📞 Soporte

Para soporte técnico o preguntas:
- Abrir issue en GitHub
- Email: [tu-email@ejemplo.com]
- Documentación: [Link a docs adicionales]

---

**Desarrollado con ❤️ por Eduardo Chile**

---

## 📋 Información del Proyecto

- **Versión**: 1.1.0
- **Última Actualización**: Enero 2025
- **Estado**: 🚀 Producción Lista
- **Licencia**: MIT
- **Repositorio Backend**: [FlightOnTime API](https://github.com/educhile1/back_flightontime)

### Tecnologías Core
![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=flat&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?style=flat&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6.0.0-646CFF?style=flat&logo=vite)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.1-38B2AC?style=flat&logo=tailwind-css)

### Estado del Build
![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Lint Status](https://img.shields.io/badge/lint-passing-brightgreen)
![TypeScript](https://img.shields.io/badge/types-checked-brightgreen)
