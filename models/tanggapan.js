'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tanggapan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  tanggapan.init({
    idTanggapan: DataTypes.INTEGER,
    idPengaduan: DataTypes.INTEGER,
    tglTanggapan: DataTypes.DATE,
    tanggapan: DataTypes.TEXT,
    idPetugas: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'tanggapan',
  });
  return tanggapan;
};