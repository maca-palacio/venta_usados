const { Model, DataTypes } = require('sequelize');
const sequelize = require('');

class TRANSACCIONES extends Model {}
TRANSACCIONES.init({
    idTRANSACCIONES: DataTypes.INTEGER,
    fecha: DataTypes.DATE,
    cantidad: DataTypes.INTEGER,
    valor_total: DataTypes.DOUBLE,
    metodo_pago: DataTypes.ENUM,
    PRODUCTOS_id: DataTypes.INTEGER
}, 
{ 
    sequelize,
    modelName: "modelTransacciones" 
})

module.exports = TRANSACCIONES;