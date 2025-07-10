# MercadoTiendas - Documentación de UI

## Estado Actual

### Estructura General
- **Arquitectura**: React con TypeScript
- **Gestión de Estado**: Zustand
- **Autenticación**: Firebase
- **Estructura de Componentes**: Diseño atómico (atoms, molecules, organisms)
- **Estilos**: CSS y clases personalizadas

### Páginas Implementadas
- Dashboard
- Registro y Login
- Gestión de Perfil
- Creación y Gestión de Tiendas
- Verificación de cuentas

### Componentes Principales
- Formularios de autenticación
- Navegación y rutas protegidas
- Componentes para gestión de tiendas
- **ProductListItem**: Componente para mostrar cada producto en listas/resultados de búsqueda. Incluye:
  - Visualización de imagen principal.
- **FilterSection**: Componente reutilizable para mostrar secciones de filtro colapsables. Usado en la página de resultados de búsqueda.
  - **Carrusel de Imágenes**: Si el producto tiene múltiples imágenes (`imageUrls` en los datos), se activa un carrusel con botones de navegación (izquierda/derecha) que aparecen al pasar el mouse sobre la imagen. La lógica está en `ProductListItem.tsx`.
  - Muestra de nombre, precio, rating (estrellas), nombre de tienda, condición (nuevo/usado), y si tiene envío gratis o es destacado.
- **ReviewForm**: Componente modal para que los usuarios escriban una opinión sobre un producto. Incluye selección de estrellas y campo de texto. Se activa desde `ProductDetailPage`.

### Estado Actual del Dashboard
- **Navbar**: Logo, buscador y botones de navegación (Ver carrito, Ingresar)
- **Menú Principal**: Gestión de ventas, Categorías, Cupones, Productos, Ofertas
- **Buscador Central**: Input para búsqueda de productos, tiendas y más
- **Carousel**: Implementado con imágenes de placeholder (1200x400)
- **Productos Destacados**: Sección con cards de productos mostrados como placeholders
- **Problemas Identificados**:
  - Imágenes de placeholder en lugar de imágenes reales
  - Layout necesita ajustes para mejorar responsividad
  - Cards con estilos básicos que pueden mejorar visualmente

### Manejo de Stock

- **Descripción:** Se ha corregido el tipo de dato del campo `stock` en el modelo `Product` de `String` a `Number` para permitir operaciones aritméticas correctas. Adicionalmente, se ha implementado la conversión explícita a `Number` al crear y actualizar productos para asegurar la consistencia del tipo de dato en la base de datos. Esta mejora garantiza que el stock de los productos se actualice correctamente después de cada venta, mejorando la fiabilidad del inventario.

## Plan de Implementación de Nuevas Funcionalidades

### Fase 1: Mejoras de UI/UX (Prioridad Alta)
- [ ] Reemplazar imágenes de placeholder con imágenes reales
  - [ ] Implementar sistema de carga y gestión de imágenes
  - [ ] Crear banners para el carousel principal
  - [ ] Diseñar thumbnails para las cards de productos
- [ ] Mejorar estilos del Navbar
  - [ ] Implementar dropdown para menú de usuario
  - [ ] Mejorar integración visual del buscador
  - [X] Corregir comportamiento hover/clic del menú desplegable de Categorías (control con estado).
- [ ] Optimizar la responsividad para dispositivos móviles
  - [ ] Ajustar layout del dashboard para pantallas pequeñas
  - [ ] Implementar menú hamburguesa para móviles
- [ ] Añadir animaciones de transición entre páginas
- [ ] Implementar modo oscuro
- [X] **Mejoras Filtros Búsqueda**: 
    - [X] Combinación AND de filtros (Ya implementado en `searchStore`).
    - [X] Secciones de filtro colapsables por defecto (`FilterSection` en `SearchResultsPage`).
    - [-] Filtro Condición: Usa checkboxes (Nuevo/Usado) en lugar de botones.
    - [X] Botón "Limpiar filtros" (Ya implementado en `SearchResultsPage`).

### Fase 2: Funcionalidades de Tienda (Prioridad Media)
- [ ] Sistema de gestión de productos
  - [ ] Formulario de creación de productos con subida de imágenes
  - [ ] Listado de productos con opciones de filtrado
  - [ ] **Asegurar 5 Imágenes por Producto**: Modificar la fuente de datos (actualmente `mockProducts` en `src/stores/searchStore.ts`, futuramente la API) para que cada producto provea 5 URLs en `imageUrls` para el carrusel en `ProductListItem`.
  - [ ] Edición y eliminación de productos
  - [ ] Categorización de productos
- [ ] Catálogo público de productos
  - [X] Vista detallada de productos
  - [X] Sistema de valoraciones y comentarios (Implementación inicial con formulario modal y estado global mock)
    - [X] Botón "Escribir opinión" en `ProductDetailPage` activa el modal `ReviewForm`.
    - [X] Componente `ReviewForm` (`src/components/organisms/ReviewForm/ReviewForm.tsx`) permite seleccionar estrellas y escribir texto.
    - [X] Envío del formulario llama a la acción `addReview` en `searchStore` (añade opinión mock al estado).
    - [X] Opiniones se cargan (`fetchReviewsByProductId`) y muestran dinámicamente desde `searchStore` en `ProductDetailPage`.
    - [ ] *Pendiente:* Conectar acciones `addReview` y `fetchReviewsByProductId` a una API real.
  - [ ] Filtros avanzados por categoría, precio, etc.
- [ ] Sistema de carrito de compras
  - [ ] Añadir/eliminar productos
  - [ ] Modificar cantidades
  - [X] Guardar carrito para más tarde
- [X] **Implementar Vista Detallada del Producto:**
    - [X] Definir ruta dinámica `/producto/:productId`.
    - [X] Crear componente `ProductDetailPage`.
    - [X] Implementar obtención de datos para un solo producto en `searchStore`.
    - [X] Añadir enlace/navegación desde `ProductListItem` en `SearchResultsPage`.
    - [X] Diseñar `ProductDetailPage` según maqueta (incluyendo carrusel de imágenes, info, descripción, etc.).

### Fase 3: Integraciones y Analíticas (Prioridad Baja)
- [ ] Integración de pasarelas de pago
  - [ ] Configuración de Stripe/PayPal
  - [ ] Proceso de checkout seguro
- [ ] Panel de estadísticas de venta
  - [ ] Gráficos de ventas por período
  - [ ] Análisis de productos más vendidos
  - [ ] Seguimiento de conversiones
- [ ] Sistema de notificaciones
  - [ ] Alertas de nuevos pedidos
  - [ ] Notificaciones de stock bajo
- [ ] Exportación de datos en diferentes formatos

## Próximos Pasos Inmediatos (Sprint Actual)
1. [ ] Reemplazar imágenes de placeholder en el Carousel
2. [ ] Mejorar estilo visual de las Cards de productos destacados
3. [ ] Corregir el problema de estilo en la sección "Productos Destacados"
4. [X] Implementar vista detallada al hacer clic en un producto (Ver Fase 2 para desglose)
5. [ ] Ajustar el espaciado y alineación de los elementos en el Dashboard
6. [X] **Nueva Tarea: Implementar Vista Detallada del Producto**
    - [X] Definir ruta `/producto/:productId`.
    - [X] Crear `ProductDetailPage.tsx`.
    - [X] Añadir `fetchProductById` a `searchStore`.
    - [X] Implementar navegación en `SearchResultsPage`.
    - [X] Diseñar la página `ProductDetailPage`.

## Registro de Cambios
- **26/04/2025**: Creación de la documentación inicial
- **26/04/2025**: Análisis de la estructura actual del proyecto 
- **26/04/2025**: Documentación del estado actual del Dashboard y plan de mejoras 
- **[FECHA ACTUAL]**: Implementación inicial de la funcionalidad "Escribir Opinión":
    - Creado componente `ReviewForm`.
    - Modificado `ProductDetailPage` para mostrar `ReviewForm` como modal.
    - Añadida gestión básica de estado para visibilidad del formulario.
- **[FECHA ACTUAL]**: Conexión de Opiniones a Estado Global (Zustand - Mock Data):
    - Añadido estado (`productReviews`, `isLoadingReviews`) y acciones (`fetchReviewsByProductId`, `addReview`) a `searchStore`.
    - `ProductDetailPage` ahora obtiene y muestra opiniones desde el store.
    - `ReviewForm` ahora envía la nueva opinión (mock) al store mediante `addReview`. 