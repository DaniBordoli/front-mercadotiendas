
### Solución: Corrección del Tipo de Dato para el Stock de Productos

**Descripción:** Se identificó que el campo `stock` en el modelo `Product` estaba definido como `String`, lo cual impedía las operaciones aritméticas necesarias para la gestión del inventario. Para solucionar esto, se realizaron las siguientes modificaciones:

1.  El tipo de dato del campo `stock` en el modelo `mercadotiendasbackend-main/src/models/Products.js` se cambió de `String` a `Number`.
2.  En la función `exports.createProduct` de `mercadotiendasbackend-main/src/controllers/product.controller.js`, se añadió una conversión explícita a `Number()` para el valor del `stock` antes de crear un nuevo producto.
3.  En la función `exports.updateProduct` del mismo archivo, se implementó una conversión similar a `Number()` para el valor del `stock` al actualizar un producto.

Esta corrección asegura que el stock de los productos se maneje como un valor numérico, permitiendo que la función `updateProductStock` realice las deducciones correctamente después de cada venta y mejorando la precisión del inventario. 