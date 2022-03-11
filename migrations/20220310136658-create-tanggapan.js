'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tanggapans', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      idTanggapan: {
        type: Sequelize.INTEGER
      },
      idPengaduan: {
        type: Sequelize.INTEGER,
        onDelete:"CASCADE",
        onUpdate:"CASCADE",
        references:{
          model:"pengaduans",
          key:"idPengaduan",
          as:"idPengaduan"
        }
      },
      tglTanggapan: {
        type: Sequelize.DATE
      },
      tanggapan: {
        type: Sequelize.TEXT
      },
      idPetugas: {
        type: Sequelize.INTEGER,
        onDelete:"CASCADE",
        onUpdate:"CASCADE",
        references:{
          model:"petugas",
          key:"idPetugas",
          as:"idPetugas"
        }
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
    await queryInterface.dropTable('tanggapans');
  }
};