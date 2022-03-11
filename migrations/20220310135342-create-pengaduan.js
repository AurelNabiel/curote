'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('pengaduans', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      idPengaduan: {
        type: Sequelize.INTEGER,
        unique:true
      },
      tglPengaduan: {
        type: Sequelize.DATE
      },
      nik: {
        type: Sequelize.STRING,
        onDelete:"CASCADE",
        onUpdate:"CASCADE",
        references:{
          model:"masyarakats",
          key:"nik",
          as:"nik"
        }
      },
      isiLaporan: {
        type: Sequelize.STRING
      },
      foto: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.ENUM('0','proses','selesai')
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('pengaduans');
  }
};