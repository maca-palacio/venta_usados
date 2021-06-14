const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const db = require('./database');

// instancia de Express
const server = express();
const PORT = 3000;
// instanciar modelos
const Producto = require('./database/models/Producto');
const Transaccion = require('./database/models/Transaccion');
const Usuario = require('./database/models/Usuario');

// middlewares
server.use(helmet());
server.use(express.json());
server.use(compression());
server.use(cors());



// ======== ROUTING ===========

//=================================================Usuario=================================================

// validación body login
const validarBodyLogin = (req, res, next) => {
    if (
        !req.body.correo ||
        !req.body.password
    ) {
        res.status(400).json({
            error: "debe loguearse con su correo y contraseña",
        });
    } else {
        next();
    }
};

// validación body register
const validarBodyRegister = (req, res, next) => {
    if (
        !req.body.nombre ||
        !req.body.correo ||
        !req.body.password
    ) {
        res.status(400).json({
            error: "debe loguearse con su correo y contraseña",
        });
    } else {
        next();
    }
};

// validación de usuario en DB (validar nombre y mail por separado)
const validarUsuarioNombre = async (req, res, next) => {
    const usuarioExistente = await Usuario.findOne({
        where:{
            nombre: req.body.nombre
            }
    });

    if (usuarioExistente) {
        res.status(409).json({ error: `El nombre pertenece a un usuario registrado` });
    } else {
        req.usuarioNombre = usuarioExistente.nombre;
        next();
    }
}

const validarUsuarioCorreo = async (req, res, next) => {
    const usuarioExistente = await Usuario.findOne({
        where:{
            nombre: req.body.correo
            }
    });

    if (usuarioExistente) {
        res.status(409).json({ error: `Ya existe una cuenta registrada con ese correo` });
    } else {
        req.usuarioCorreo = usuarioExistente.correo;
        next();
    }
}


// POST USUARIO (resgistrarse/login)
server.post('/register', validarBodyRegister, validarUsuarioNombre, validarUsuarioCorreo, (req, res) => {
    Usuario.create({
        nombre: req.usuarioNombre,
        correo: req.usuarioCorreo,
        password: req.body.password
    }).then(usuario => {
        res.status(200).json({ usuario });
    }).catch(error => {
        res.status(400).json({ error: error.message });
    });

})


server.post('/login', validarBodyLogin, (req, res) => {
    const correoPost = req.body.correo;
    const passwordPost = req.body.password;

    // buscar en DB  FALTA VALIDACION VER VIEN CÓMO FUNCIONA EL FIND ALL
    const user_ok = Usuario.findAll({
        attributes: [correoPost, passwordPost]
    });

    if (!user_ok) {
        res.status(401).json({ error: "compruebe usuario y contraseña" });
    } else {
        res.status(200).json({ message: "Log in exitoso, falta crear JWT" });
        // crear el token con data que no sea tan confidencial
        /*const token = jwt.sign(
            {
                nombre: user_ok.nombre,
                id: user_ok.id,
                correo: user_ok.correo,
            },
            secretJWT,
            { expiresIn: "60m" }
        );

        res.status(200).json({ token });*/
    }
})



// GET USUARIOS
server.get('/usuarios', (req, res) => {
    Usuario.findAll().then(usuarios => {
        res.json(usuarios);
    }).catch(error => {
        res.send(error.message);
    })
})

//=================================================Transacción=================================================
//Validación body de transacción 
const validarBodyTransaccion = (req, res, next) => {
    if (
        !req.body.fecha ||
        !req.body.cantidad ||
        !req.body.metodo_pago ||
        !req.body.comprador ||
        !req.body.USUARIOS_id ||
        !req.body.idproducto
    ) {
        res.status(400).json({
            error: "debe enviar los datos completos de la transacción",
        });
    } else {
        next();
    }
};

const validarproduct = async (req, res, next) => {
    const idstockproducto = await Producto.findOne({
        where:{
            USUARIOS_id: req.body.USUARIOS_id,
            idproducto: req.body.idproducto,}
    });
    console.log("================el producto encontrado================");
    console.log(idstockproducto);
    if (!idstockproducto) {
        res.status(400).json({ error: `El producto no existe para la venta` });
    } else {
        req.idstockproducto = idstockproducto.id;
        console.log("================el producto encontrado================");
        console.log(req.idstockproducto);
        next();
    }

}

const validarstock = async (req, res, next) => {
    const stockproducto = await Producto.findOne({
        where:{
            USUARIOS_id: req.body.USUARIOS_id,
            idproducto: req.body.idproducto
        }
    });
    console.log("================el producto encontrado================");
    console.log(stockproducto);
    if (stockproducto.stock == 0) {
        res.status(400).json({ error: `No hay unidades disponibles para la venta` });
    } else if (stockproducto.stock < req.body.cantidad) {
        req.stockproducto = stockproducto.stock;
        //busca por id del producto y actualiza el stock
        actualizarstock(stockproducto.id,stockproducto.stock,stockproducto.stock);
        console.log("================solo el valor del stock================");
        console.log(req.stockproducto);
    } else {
        req.stockproducto = req.body.cantidad;
        //busca por id del producto y actualiza el stock
        actualizarstock(stockproducto.id,stockproducto.stock,req.body.cantidad);
        req.valortotal=req.body.cantidad*stockproducto.valor;
        next();
    }

}


//========================Actualiza el stock de productos=======================//

const actualizarstock = async (idpro,n1,n2) => {
    const stocknew = n1-n2;
    Producto.update(
        { stock: stocknew },
        { where: {id: idpro} }
   ).then(product => {
        console.log("================================Actualización de stock=================================");
        console.log(product);
   }).catch(err => console.log('error: ' + err));
};


//Crear transacción =================================================================
server.post('/transaccion', validarBodyTransaccion, validarproduct, validarstock, (req, res) => {
    Transaccion.create({
        fecha: req.body.fecha,
        cantidad: req.stockproducto,
        valor_total: req.valortotal,
        metodo_pago: req.body.metodo_pago,
        comprador: req.body.comprador,
        PRODUCTOS_idPRODUCTOS: req.idstockproducto
    }).then(usuario => {
        res.json({ usuario })
    }).catch(error => {
        res.status(400).json({ error: error.message });
    });

})

// endpoint consulta todos las transacciones 
server.get('/transacciones', (req, res) => {
    Transaccion.findAll().then(transa => {
        res.json(transa);
    }).catch(error => {
        res.send(error.message);
    })
})
//=================================================Fin transacción======================================================




// =======================================
// ======= Inicializar el SERVIDOR =======
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);

    // Conectarse a la base de datos cuando levanta el servidor
    // force true: DROP TABLES (no queremos que reinicie las tablas constantemente!)
    db.sync({ force: false }).then(() => {
        console.log("Succesfully connected to database");
    }).catch(error => {
        console.log("Se ha producido un error: " + error);
    });
});


//******** clonar de  https://github.com/maca-palacio/venta_usados.git