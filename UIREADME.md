# MercadoTiendas -- Documentación de UI

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

## Plan de Implementación de Nuevas Funcionalidades

### Fase 1: Mejoras de UI/UX
- [ ] Implementar modo oscuro
- [ ] Mejorar responsividad para dispositivos móviles
- [ ] Añadir animaciones de transición entre páginas
- [ ] Actualizar componentes de la página principal (carousel, cards)

### Fase 1.5: Mejoras de Búsqueda
- [x] Crear componente de sugerencias (`SearchSuggestions.tsx`)
- [x] Integrar sugerencias en `Navbar.tsx` (con datos mock y debounce)
- [x] Gestionar estado de búsqueda con Zustand (`searchStore.ts`)
- [x] Crear página de resultados de búsqueda (`SearchResultsPage.tsx`)
- [x] Configurar ruta para `/search`
- [x] Implementar navegación desde Navbar/Sugerencias a página de resultados
- [x] Implementar vista de lista de productos (`ProductListItem.tsx`)
- [x] Implementar ordenamiento en página de resultados
- [x] Implementar filtros básicos (Marca, Condición, Precio) en UI y lógica de store
- [ ] (Pendiente) Refactorizar/eliminar barra de búsqueda duplicada en `Dashboard.tsx`
- [ ] (Futuro) Integrar con API Backend para búsqueda real
- [ ] (Futuro) Implementar filtros avanzados (Color, Talle, Modelo, Ubicación)
- [ ] (Futuro) Implementar selector de rango de precio deslizante (slider)

### Fase 2: Funcionalidades de Tienda
- [ ] Sistema de gestión de productos
  - [ ] Formulario de creación de productos
  - [ ] Listado de productos
  - [ ] Edición y eliminación de productos
- [ ] Catálogo público de productos
- [ ] Sistema de pedidos básico

### Fase 3: Integraciones y Analíticas
- [ ] Integración de pasarelas de pago
- [ ] Panel de estadísticas de venta
- [ ] Sistema de notificaciones
- [ ] Exportación de datos

## Registro de Cambios
- **26/04/2025**: Creación de la documentación inicial
- **26/04/2025**: Análisis de la estructura actual del proyecto 