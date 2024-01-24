
const colors = require('colors');
const fs = require('fs').promises;
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
});
// Define una clase ProductosTienda
class ProductosTienda {
    #listaproductos;

    constructor() {
        this.#listaproductos = [];
    }

    get listaproductos() {
        return this.#listaproductos;
    }

    set listaproductos(lista) {
        this.#listaproductos = lista;
    }

    cargaarchivoproductos = async () => {
        try {
            const data = await fs.readFile('./datos.json', 'utf-8');
            this.listaproductos = JSON.parse(data);
            console.log(`Productos cargados desde datos.json`.bgBlue);
        } catch (error) {
            console.error(`Error al cargar el archivo: ${error.message}`.bgRed);
        }
    };


    agregarProducto(nuevoProducto) {
        this.#listaproductos.push(nuevoProducto);
        this.guardarListaEnArchivo();
    }

    guardarListaEnArchivo() {
        const cadenaJson = JSON.stringify(this.#listaproductos, null, 2);
        const nombrearchivo = './datos.json';
        fs.writeFile(nombrearchivo, cadenaJson, 'utf-8')
            .then(() => {
                console.log(`Nuevo producto guardado en ${nombrearchivo}`.bgMagenta);
            })
            .catch((error) => {
                console.error(`Error al guardar el archivo: ${error.message}`.bgRed);
            });
    }
}

class ProgramaTienda {
    #productosTienda;
    #carrito;

    constructor() {
        this.#productosTienda = new ProductosTienda();
        this.#carrito = new CarritoCompras();
    }

    async main() {
        console.clear();
        console.log('//////////////////////////////'.rainbow);
        console.log('//   PROYECTO TIENDA JNOM   //'.rainbow);
        console.log('//////////////////////////////\n'.rainbow);

        let salir = false;
        while (!salir) {
            const opcion = await this.mostrarMenu();

            switch (opcion) {
                case '1':
                    console.clear()
                    await cargaarchivoproductos(productostienda);
                    console.log('Lista productos'.bgBlue)
                    Productostienda.mostrarproductos()
                    productosCargados = true;
                    await pausa();
                    break;
                case '2':
                    if (productosCargados) {
                        console.clear()
                        copiaDeRespaldo();
                    } else {
                        console.log('Debe cargar los productos primero (Opción 1) antes de realizar una copia de respaldo.'.bgRed);
                    }
                    await pausa();
                    break;
                case '3':
                    if (productosCargados) {
                        console.clear()
                        usarCopiaReciente();
                    } else {
                        console.log('Debe cargar los productos primero (Opción 1) antes de realizar una reparación de datos.'.bgRed);
                    }
                    await pausa();
                    break;
                case '4':
                    if (productosCargados) {
                        console.clear()
                        console.log(`Lista de productos:`.bgBlue)
                        Productostienda.mostrarproductos()
                        console.log(`Ingrese los detalles del nuevo producto:`.bgBlue);
                        let nuevoProducto = await obtenerDetallesProducto();
                        await pausa();
                    } else {
                        console.log('Debe cargar los productos primero (Opción 1) antes de agregar un nuevo producto.'.bgRed);
                        await pausa();
                    }
                    break;
                case '5':
                    if (productosCargados) {
                        console.clear()
                        console.log(`Lista de Productos`.bgBlue)
                        Productostienda.mostrarproductos()
                    } else {
                        console.log('Debe cargar los productos primero (Opción 1) antes de borrar un producto.'.bgRed);
                    }
                    await pausa();
                    break;
                case '6':
                    if (productosCargados) {
                        console.clear()
                        console.log(`Listado Productos Disponibles:`)
                        Productostienda.mostrarproductos()
    
                    } else {
                        console.log('Debe cargar los productos primero (Opción 1) antes de comprar productos.'.bgRed);
                    }
                    await pausa();
                    break;
                case '7':
                    if (productosCargados) {
                        console.clear()
                        carrito.mostrarFactura();
                    } else {
                        console.log('Debe cargar los productos primero (Opción 1) antes de mostrar la factura.'.bgRed);
                    }
                    await pausa();
                    break;
                case '0':
                    grabarProductosEnArchivo()
                    salir = true;
                    break;
                default:
                    console.clear()
                    console.log(`Opción no válida. Por favor, seleccione una opción válida.`.bgRed);
                    await pausa();
                    break;
            }

        readline.close();
        console.log('Adios'.bgGreen);
    }

    const mostrarMenu = () => {
        return new Promise((resolve) => {
            console.log(`//////////////////////////////`.green);
            console.log(`//   Seleccione una opción  //`.green);
            console.log(`//////////////////////////////\n`.green);
            console.log(`${'1'.red} Cargar Datos`);
            console.log(`${'2'.red} Copia de Respaldo`);
            console.log(`${'3'.red} Reparación Datos`);
            console.log(`${'4'.red} Grabar Nuevos Productos`);
            console.log(`${'5'.red} Borrar Producto`);
            console.log(`${'6'.red} Comprar productos`);
            console.log(`${'7'.red} Imprimir Factura`);
            console.log(`${'0'.red} Cerrar App`);
            readline.question('Seleccione una opción: ', (opt) => {
                resolve(opt);
            });
        });
    };
    // Función para pausar y esperar una entrada del usuario
    const pausa = () => {
        return new Promise((resolve) => {
            readline.question(`\nPresione ${'ENTER'.yellow} para continuar\n`, (opt) => {
                resolve();
            });
        });
    };
    // Función para obtener detalles de un nuevo producto del usuario
    const obtenerDetallesProducto = async () => {
        return new Promise((resolve) => {
            const nuevoProducto = new Producto();
    
            readline.question('Código del producto: '.green, (codigo) => {
                nuevoProducto.codigoproducto = codigo;
                readline.question('Nombre del producto: '.green, (nombre) => {
                    nuevoProducto.nombreproducto = nombre;
                    readline.question('Inventario del producto: '.green, (inventario) => {
                        nuevoProducto.inventarioproducto = parseInt(inventario);
                        readline.question('Precio del producto: '.green, (precio) => {
                            nuevoProducto.precioproducto = parseFloat(precio);
                            resolve(nuevoProducto);
                        });
                    });
                });
            });
        });
    };


}

class carritoCompras {
    #listaComprasCarrito;
    carritoItems;
    facturaItems; 
    #nombreComprador;
    #documentoComprador;

    constructor() {
        this.#listaComprasCarrito = [];
        this.carritoItems = [];
        this.facturaItems = []; // Inicializa la lista de la factura
        this.#documentoComprador = [];
        this.#nombreComprador=[];
    }

    get getListaComprasCarrito() {
        return this.#listaComprasCarrito;
    }

    set setListaComprasCarrito(lista) {
        this.#listaComprasCarrito = lista;
    }

    get getDocumentoComprador(){
        return this.#documentoComprador
    }

    set setDocumentoComprador(documento){
        this.#documentoComprador = documento
    }

    comprarProducto(codigoProducto, cantidad, listaProductos) {
        // Buscar el producto en la lista por su código
        const producto = listaProductos.find((producto) => producto.codigoproducto === codigoProducto);
        if (producto) {
            if (producto.inventarioproducto >= cantidad) {
                // Reducir el inventario
                producto.inventarioproducto -= cantidad;

                // Agregar el producto al carritoItems
                this.carritoItems.push({
                    codigo: producto.codigoproducto,
                    nombre: producto.nombreproducto,
                    cantidad: cantidad,
                    precioUnitario: producto.precioproducto,
                });

                console.log('Producto añadido al carrito.');
            } else {
                console.log('No hay suficiente inventario para este producto.');
            }
        } else {
            console.log('Producto no encontrado en la lista.');
        }
    }


    mostrarCarrito() {
        console.log(`Carrito de Compras:`.bgBlue);
        this.#listaComprasCarrito.forEach((item) => {
            console.log(`|     ${item.producto.codigoproducto}     |      ${item.producto.nombreproducto}     |      ${item.cantidad}     |      ${item.producto.precioproducto}     |`);
        });

        const total = this.calcularTotal();
        console.log(`Total: ${total}`.bgCyan);
    }

    calcularTotal() {
        let total = 0;
        this.#listaComprasCarrito.forEach((item) => {
            total += item.producto.precioproducto * item.cantidad;
        });
        return total;
    }



    // Método para mostrar la factura con los productos en el carritoItems
    mostrarFactura() {
        console.log(`Factura de Compra:`.bgBlue);
        console.log(`|     Código     |      Nombre     |      Cantidad     |      Precio Unitario     |      Subtotal     |`);
        let total = 0;

        this.carritoItems.forEach((item) => {
            const subtotal = item.cantidad * item.precioUnitario;
            total += subtotal;
            console.log(`|     ${item.codigo}     |      ${item.nombre}     |      ${item.cantidad}     |      ${item.precioUnitario}     |      ${subtotal}     |`);
        });

        console.log(`Total: ${total}`.bgCyan);
    }

    comprarProducto(codigoProducto, cantidad, listaProductos) {
        const producto = listaProductos.find((producto) => producto.codigoproducto === codigoProducto);
        if (producto) {
            if (producto.inventarioproducto >= cantidad) {
                producto.inventarioproducto -= cantidad;
                this.carritoItems.push({
                    codigo: producto.codigoproducto,
                    nombre: producto.nombreproducto,
                    cantidad: cantidad,
                    precioUnitario: producto.precioproducto,
                });
                console.log('Producto añadido al carrito.');

                // Agrega el producto a la lista de la factura
                this.facturaItems.push({
                    codigo: producto.codigoproducto,
                    nombre: producto.nombreproducto,
                    cantidad: cantidad,
                    precioUnitario: producto.precioproducto,
                });
            } else {
                console.log('No hay suficiente inventario para este producto.');
            }
        } else {
            console.log('Producto no encontrado en la lista.');
        }
    };

}



// Crear una instancia de ProductosTienda
let Productostienda = new ProductosTienda();

// Función para cargar productos desde un archivo JSON
const 

// Función para agregar un producto a la lista de productos

// Función para grabar la lista de productos en un archivo JSON
const grabararchivoproductos = async (listaproductos) => {
    try {
        const cadenaJson = JSON.stringify(listaproductos, null, 2);
        const nombrearchivo = './datos.json';
        await fs.writeFile(nombrearchivo, cadenaJson, 'utf-8');
        console.log(`DATOS GUARDADOS EN ${nombrearchivo}`.bgMagenta);
    } catch (error) {
        console.error(`Error al guardar el archivo: ${error.message}`.bgRed);
    }
};
// Función para mostrar un menú de opciones
const mostrarMenu = () => {
    return new Promise((resolve) => {
        console.log(`//////////////////////////////`.green);
        console.log(`//   Seleccione una opción  //`.green);
        console.log(`//////////////////////////////\n`.green);
        console.log(`${'1'.red} Cargar Datos`);
        console.log(`${'2'.red} Copia de Respaldo`);
        console.log(`${'3'.red} Reparación Datos`);
        console.log(`${'4'.red} Grabar Nuevos Productos`);
        console.log(`${'5'.red} Borrar Producto`);
        console.log(`${'6'.red} Comprar productos`);
        console.log(`${'7'.red} Imprimir Factura`);
        console.log(`${'0'.red} Cerrar App`);
        readline.question('Seleccione una opción: ', (opt) => {
            resolve(opt);
        });
    });
};
// Función para pausar y esperar una entrada del usuario
const pausa = () => {
    return new Promise((resolve) => {
        readline.question(`\nPresione ${'ENTER'.yellow} para continuar\n`, (opt) => {
            resolve();
        });
    });
};
// Función para obtener detalles de un nuevo producto del usuario
const obtenerDetallesProducto = async () => {
    return new Promise((resolve) => {
        const nuevoProducto = new Producto();

        readline.question('Código del producto: '.green, (codigo) => {
            nuevoProducto.codigoproducto = codigo;
            readline.question('Nombre del producto: '.green, (nombre) => {
                nuevoProducto.nombreproducto = nombre;
                readline.question('Inventario del producto: '.green, (inventario) => {
                    nuevoProducto.inventarioproducto = parseInt(inventario);
                    readline.question('Precio del producto: '.green, (precio) => {
                        nuevoProducto.precioproducto = parseFloat(precio);
                        resolve(nuevoProducto);
                    });
                });
            });
        });
    });
};
// Función para generar la fecha actual formateada
const obtenerFechaActualFormateada = () => {
    //se crea una constante llamada "now" que nos permite alamcenar la fecha actual  
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
};
//Funcion que permita crear la copia de respaldo de datos.json 
const copiaDeRespaldo = async () => {
    const fechaActual = obtenerFechaActualFormateada();
    const nombreCopiaRespaldo = `respaldo_${fechaActual}.json`;

    try {
        // Lee el archivo datos.json
        const data = await fs.readFile('./datos.json', 'utf-8');
        // Crea una copia de respaldo con la fecha en el nombre del archivo
        await fs.copyFile('./datos.json', `./copias_respaldo/${nombreCopiaRespaldo}`);
        console.log(`Copia de respaldo creada: ${nombreCopiaRespaldo}`.bgGreen);
    } catch (error) {
        console.error(`Error al crear la copia de respaldo: ${error.message}`.bgRed);
    }
};
// Función para usar la copia más reciente de la carpeta "copias_respaldo"
const usarCopiaReciente = async () => {
    try {
        // Lee la lista de archivos en la carpeta "copias_respaldo"
        const archivosCopias = await fs.readdir('./copias_respaldo');
        if (archivosCopias.length === 0) {
            console.log('No se encontraron copias de respaldo en la carpeta "copias_respaldo"'.bgRed);
            return;
        }
        // Encuentra la copia más reciente
        let copiaMasReciente = archivosCopias[0];
        for (const archivo of archivosCopias) {
            if (archivo > copiaMasReciente) {
                copiaMasReciente = archivo;
            }
        }
        // Copia la copia más reciente y reemplaza "datos.json"
        await fs.copyFile(`./copias_respaldo/${copiaMasReciente}`, './datos.json');
        console.log(`Se ha utilizado la copia más reciente: ${copiaMasReciente}`.bgGreen);
    } catch (error) {
        console.error(`Error al utilizar la copia de respaldo: ${error.message}`.bgRed);
    }
};
const carrito = new carritoCompras();
const obtenerCantidadCompra = () => {
    return new Promise((resolve) => {
        readline.question('Cantidad a comprar: ', (cantidad) => {
            resolve(cantidad);
        });
    });
};

const grabarProductosEnArchivo = async () => {
    try {
        await grabararchivoproductos(Productostienda.listaproductos);
    } catch (error) {
        console.error(`Error al guardar el archivo: ${error.message}`.bgRed);
    }
};

let productosCargados = false; // Variable para rastrear si los productos se han cargado

// Función principal que ejecuta el programa
const main = async () => {
    console.clear();
    console.log('//////////////////////////////'.rainbow);
    console.log('//   PROYECTO TIENDA JNOM   //'.rainbow);
    console.log('//////////////////////////////\n'.rainbow);

    let productostienda = new ProductosTienda();



    let salir = false;
    while (!salir) {
        const opcion = await mostrarMenu();

        switch (opcion) {
            case '1':
                console.clear()
                await cargaarchivoproductos(productostienda);
                console.log('Lista productos'.bgBlue)
                Productostienda.mostrarproductos()
                productosCargados = true;
                await pausa();
                break;
            case '2':
                if (productosCargados) {
                    console.clear()
                    copiaDeRespaldo();
                } else {
                    console.log('Debe cargar los productos primero (Opción 1) antes de realizar una copia de respaldo.'.bgRed);
                }
                await pausa();
                break;
            case '3':
                if (productosCargados) {
                    console.clear()
                    usarCopiaReciente();
                } else {
                    console.log('Debe cargar los productos primero (Opción 1) antes de realizar una reparación de datos.'.bgRed);
                }
                await pausa();
                break;
            case '4':
                if (productosCargados) {
                    console.clear()
                    console.log(`Lista de productos:`.bgBlue)
                    Productostienda.mostrarproductos()
                    console.log(`Ingrese los detalles del nuevo producto:`.bgBlue);
                    let nuevoProducto = await obtenerDetallesProducto();
                    await pausa();
                } else {
                    console.log('Debe cargar los productos primero (Opción 1) antes de agregar un nuevo producto.'.bgRed);
                    await pausa();
                }
                break;
            case '5':
                if (productosCargados) {
                    console.clear()
                    console.log(`Lista de Productos`.bgBlue)
                    Productostienda.mostrarproductos()
                } else {
                    console.log('Debe cargar los productos primero (Opción 1) antes de borrar un producto.'.bgRed);
                }
                await pausa();
                break;
            case '6':
                if (productosCargados) {
                    console.clear()
                    console.log(`Listado Productos Disponibles:`)
                    Productostienda.mostrarproductos()

                } else {
                    console.log('Debe cargar los productos primero (Opción 1) antes de comprar productos.'.bgRed);
                }
                await pausa();
                break;
            case '7':
                if (productosCargados) {
                    console.clear()
                    carrito.mostrarFactura();
                } else {
                    console.log('Debe cargar los productos primero (Opción 1) antes de mostrar la factura.'.bgRed);
                }
                await pausa();
                break;
            case '0':
                grabarProductosEnArchivo()
                salir = true;
                break;
            default:
                console.clear()
                console.log(`Opción no válida. Por favor, seleccione una opción válida.`.bgRed);
                await pausa();
                break;
        }
    }

    readline.close();
    console.log('Adios'.bgGreen);
};
// Llama a la función principal para iniciar el programa
main();