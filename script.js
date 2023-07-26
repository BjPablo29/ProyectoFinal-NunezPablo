// Array 
let productos = []

// Elementos del DOM
const productosContainer = document.getElementById('productos')
const carritoContainer = document.getElementById('items-carrito')
const totalGastado = document.getElementById('total-gastado')
const totalItems = document.getElementById('total-items')
const mostrarCarritoBtn = document.getElementById('mostrar-carrito')
const carrito = document.getElementById('carrito')
const buscador = document.getElementById('buscador')

// Carrito 
let carritoItems = []
let carritoTotal = 0

// Función para mostrar los productos 
function mostrarProductos(array) {
  productosContainer.innerHTML = ''

  array.forEach(producto => {
    const productoCard = crearProductoCard(producto)
    productosContainer.appendChild(productoCard)
  })
}

// Crear una tarjeta de producto
function crearProductoCard(producto) {
  const { id, nombre, categoria, precio, stock, imagen } = producto

  const productoCard = document.createElement('div')
  productoCard.classList.add('producto')

  const imagenProducto = document.createElement('img')
  imagenProducto.src = imagen
  imagenProducto.alt = nombre

  const nombreProducto = document.createElement('h3')
  nombreProducto.textContent = nombre

  const categoriaProducto = document.createElement('p')
  categoriaProducto.textContent = categoria

  const precioProducto = document.createElement('p')
  precioProducto.textContent = `Precio: $${precio}`

  const stockProducto = document.createElement('p')
  stockProducto.textContent = `Stock: ${stock}`

  const agregarCarritoBtn = document.createElement('button')
  agregarCarritoBtn.textContent = 'Agregar al carrito'
  agregarCarritoBtn.addEventListener('click', () => agregarAlCarrito(producto))

  productoCard.appendChild(imagenProducto)
  productoCard.appendChild(nombreProducto)
  productoCard.appendChild(categoriaProducto)
  productoCard.appendChild(precioProducto)
  productoCard.appendChild(stockProducto)
  productoCard.appendChild(agregarCarritoBtn)

  return productoCard
}

// Saludo de bienvenida
swal({
  title: "¡Bienvenido!",
  text: "¡Gracias por visitar By Gio Haircare!",
  icon: "success",
  button: "¡Gracias!",
})

// Función para agregar un producto al carrito
function agregarAlCarrito(producto) {
  const index = carritoItems.findIndex(item => item.id === producto.id)

  if (index !== -1) {
    if (carritoItems[index].cantidad < producto.stock) {
      carritoItems[index].cantidad++
      swal("¡Agregado al carrito!", `${producto.nombre} se ha agregado al carrito.`, "success")
    } else {
      swal("¡Sin stock!", "No hay más stock disponible.", "error")
    }
  } else {
    if (producto.stock > 0) {
      const nuevoItem = {
        id: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        cantidad: 1,
      }
      carritoItems.push(nuevoItem);
      swal("¡Agregado al carrito!", `${producto.nombre} se ha agregado al carrito.`, "success")
    } else {
      swal("¡Sin stock!", "No hay más stock disponible.", "error")
    }
  }

  actualizarCarrito()
}

// Función para actualizar el carrito en el DOM y almacenamiento local
function actualizarCarrito() {
  carritoContainer.innerHTML = ''
  carritoTotal = 0
  let cantidadTotal = 0

  carritoItems.forEach(item => {
    const { id, nombre, precio, cantidad } = item

    const itemCarrito = document.createElement('div')
    itemCarrito.innerHTML = `${nombre} x ${cantidad} - $${precio * cantidad}`

    carritoContainer.appendChild(itemCarrito)

    carritoTotal += precio * cantidad
    cantidadTotal += cantidad
  })

  totalGastado.textContent = `$${carritoTotal}`
  totalItems.textContent = cantidadTotal

  localStorage.setItem('carritoItems', JSON.stringify(carritoItems))
  localStorage.setItem('carritoTotal', JSON.stringify(carritoTotal))
}

// Limpiar el carrito

function limpiarCarrito() {
  if (carritoItems.length === 0) {
    swal("¡Carrito vacío!", "El carrito ya está vacío.", "info")
  } else {
    swal({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará todos los elementos del carrito.",
      icon: "warning",
      buttons: ["Cancelar", "Sí, limpiar"],
      dangerMode: true,
    }).then((willClear) => {
      if (willClear) {
        carritoItems = []
        carritoTotal = 0
        actualizarCarrito()
        swal("¡Carrito limpiado!", "El carrito se ha vaciado correctamente.", "success")
      }
    })
  }
}

const limpiarCarritoBtn = document.getElementById('limpiar-carrito')
limpiarCarritoBtn.addEventListener('click', limpiarCarrito)


// Función para obtener el carrito almacenado en el localStorage al cargar la página
function obtenerCarritoGuardado() {
  const carritoItemsGuardado = localStorage.getItem('carritoItems')
  const carritoTotalGuardado = localStorage.getItem('carritoTotal')

  if (carritoItemsGuardado && carritoTotalGuardado) {
    carritoItems = JSON.parse(carritoItemsGuardado)
    carritoTotal = parseFloat(carritoTotalGuardado)
    actualizarCarrito()
    if (carritoItems.length > 0) {
      limpiarCarritoBtn.classList.remove('oculto')
    }
  }
}

// Evento para cargar el carrito almacenado al cargar la página
window.addEventListener('load', obtenerCarritoGuardado)


// Función para mostrar u ocultar el carrito
function toggleCarrito() {
  carrito.classList.toggle('oculto')
}

mostrarCarritoBtn.addEventListener('click', toggleCarrito)

// Función para filtrar los productos por categoría
function filtrarPorCategoria(categoria) {
  const productosFiltrados = productos.filter(producto => producto.categoria === categoria);
  mostrarProductos(productosFiltrados)
}

// Eventos de click en los botones /
document.getElementById('mostrar-todos').addEventListener('click', () => mostrarProductos(productos))
document.getElementById('productos-con-formol').addEventListener('click', () => filtrarPorCategoria('Productos con Formol'))
document.getElementById('productos-sin-formol').addEventListener('click', () => filtrarPorCategoria('Productos sin formol'))

// Función para ordenar los productos por precio (de menor a mayor)
function ordenarPorPrecioMenor() {
  const productosOrdenados = productos.slice().sort((a, b) => a.precio - b.precio)
  mostrarProductos(productosOrdenados)
}

// Función para ordenar los productos por precio (de mayor a menor)
function ordenarPorPrecioMayor() {
  const productosOrdenados = productos.slice().sort((a, b) => b.precio - a.precio)
  mostrarProductos(productosOrdenados)
}

// Eventos de clic en los botones de ordenamiento
document.getElementById('ordenar-precio-menor').addEventListener('click', ordenarPorPrecioMenor)
document.getElementById('ordenar-precio-mayor').addEventListener('click', ordenarPorPrecioMayor)

// Función para filtrar los productos
function buscarProductos(termino) {
  const productosFiltrados = productos.filter(producto => {
    const nombreProducto = producto.nombre.toLowerCase()
    return nombreProducto.includes(termino.toLowerCase())
  });
mostrarProductos(productosFiltrados)
}

// Evento de entrada en el campo de búsqueda
buscador.addEventListener('input', () => {
  const terminoBusqueda = buscador.value
  buscarProductos(terminoBusqueda)
})

// Mostrar los productos en orden por defecto al cargar la página
mostrarProductos(productos)

// Cargar los productos desde JSON
function cargarProductosDesdeJSON() {
  fetch('productos.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('No se pudo cargar el archivo JSON')
      }
      return response.json()
    })
    .then(data => {
      productos = data
      mostrarProductos(productos)
    })
    .catch(error => {
      console.error(error)
      // Mensaje de error
      swal("¡Error!", "No se pudo cargar el archivo JSON de productos.", "error")
    })
}


// Cargar los productos desde el JSON al cargar la página
window.addEventListener('load', cargarProductosDesdeJSON)

