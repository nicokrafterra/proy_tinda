const colors = require('colors');
const fs = require('fs').promises;
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
});
// Define una clase Producto
class Producto {
    //se definen las instancias de la clase
    #codigoproducto;
    #nombreproducto;
    #inventarioproducto;
    #precioproducto;

    constructor() {
        this.#codigoproducto = '';
        this.#nombreproducto = '';
        this.#inventarioproducto = 0;
        this.#precioproducto = 0;
    }
    // Métodos getter y setter para las propiedades de Producto
    get codigoproducto() {
        return this.#codigoproducto;
    }

    set codigoproducto(codigo) {
        this.#codigoproducto = codigo;
    }

    get nombreproducto() {
        return this.#nombreproducto;
    }

    set nombreproducto(nombre) {
        this.#nombreproducto = nombre;
    }

    get inventarioproducto() {
        return this.#inventarioproducto;
    }

    set inventarioproducto(inventario) {
        this.#inventarioproducto = inventario;
    }

    get precioproducto() {
        return this.#precioproducto;
    }

    set precioproducto(precio) {
        this.#precioproducto = precio;
    }
}

class ProductosVenta {
    #listaproductos;

    constructor() {
        this.#listaproductos = [];
    }

    get getListaProductos(){
        return this.#listaproductos
    }
    
    set setListaProducto(lista){
        this.#listaproductos = lista
    }

    async digitarDato(mensaje) {
        return new Promise((resolve) => {
            readline.question(mensaje, (input) => {
                resolve(input);
            });
        });
    }

    async cargarArchiboProductos(){
        try {
            const data = await fs.readFile('./datos.json', 'utf-8');
            productostienda.listaproductos = JSON.parse(data);
            console.log(`Productos cargados desde datos.json`.bgBlue);
        } catch (error) {
            console.error(`Error al cargar el archivo: ${error.message}`.bgRed);
        }
    };

    async eliminarProducto(codigoProducto) {
        try {
            const listaProductos = this.#listaproductos;
            const indiceProducto = listaProductos.findIndex(producto => producto.codigoproducto === codigoProducto);

            if (indiceProducto !== -1) {
                listaProductos.splice(indiceProducto, 1);
                this.#listaproductos = listaProductos;

                // Guardar los cambios en el archivo JSON (si se desea)
                await this.guardarEnArchivo();

                console.log(`Producto con código ${codigoProducto} eliminado correctamente.`.bgGreen);
            } else {
                console.log(`No se encontró un producto con código ${codigoProducto}.`.bgYellow);
            }
        } catch (error) {
            console.error(`Error al eliminar el producto: ${error.message}`.bgRed);
        }
    }

    async guardarEnArchivo() {
        try {
            await fs.writeFile('./datos.json', JSON.stringify(this.#listaproductos, null, 2));
            console.log('Cambios guardados en datos.json'.bgBlue);
        } catch (error) {
            console.error(`Error al guardar los cambios en el archivo: ${error.message}`.bgRed);
        }
    }

    async verificarProductoEliminado(codigoProducto) {
        try {
            const listaProductos = this.#listaproductos;
            const productoExistente = listaProductos.some(producto => producto.codigoproducto === codigoProducto);

            if (!productoExistente) {
                console.log(`El producto con código ${codigoProducto} ha sido eliminado correctamente.`);
            } else {
                console.log(`El producto con código ${codigoProducto} aún existe en la lista.`);
            }
        } catch (error) {
            console.error(`Error al verificar el producto: ${error.message}`.bgRed);
        }
    }

    async nuevosProductos() {
        try {
            const codigo = await this.digitarDato('Ingrese el código del nuevo producto: ');
            const nombre = await this.digitarDato('Ingrese el nombre del nuevo producto: ');
            const inventario = parseInt(await this.digitarDato('Ingrese el inventario del nuevo producto: '));
            const precio = parseFloat(await this.digitarDato('Ingrese el precio del nuevo producto: '));

            const nuevoProducto = new Producto();
            nuevoProducto.codigoproducto = codigo;
            nuevoProducto.nombreproducto = nombre;
            nuevoProducto.inventarioproducto = inventario;
            nuevoProducto.precioproducto = precio;

            this.#listaproductos.push(nuevoProducto);

            // Guardar los cambios en el archivo JSON (si se desea)
            await this.guardarEnArchivo();

            console.log('Nuevo producto agregado correctamente.'.bgGreen);
        } catch (error) {
            console.error(`Error al agregar el nuevo producto: ${error.message}`.bgRed);
        }
    }

    verificarCodigoProducto(){ 
        
    }



















}
