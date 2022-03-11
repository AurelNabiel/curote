const { sequelize } = require("../models");
const { QueryTypes, where } = require("sequelize");
const res = require("express/lib/response");

const userList = async (req, res) => {
  // res.send("ok");
  try {
    const { name, jenisKelamin } = req.query;
    const users = await sequelize.query(
      "SELECT a.id, a.name, a.email,a.password, a.jenisKelamin, b.alamat, b.tanggalLahir,b.tempatLahir  FROM usrs AS a LEFT JOIN identitas AS b ON (a.id = b.userId) WHERE name LIKE :name OR jenisKelamin LIKE :jenisKelamin",
      {
        type: QueryTypes.SELECT,
        raw: true,
        replacements: {
           name: `%${name === undefined ? "" : name}%`,
          jenisKelamin: `%${jenisKelamin === undefined ? "" : jenisKelamin}%`,
        },
      }
    );
    if (users.length === 0) {
      return res.json({
        status: "Fail",
        msg: "Tidak ada users yang terdaftar",
      });
    }
    return res.json({
      status: "Success",
      msg: "users ditemukan",
      data: users,
    });
  } catch (err) {
    console.log(err);
    return res.status(403).json({
      status: "Fail",
      msg: "Ada Kesalahan",
    });
  }
};

module.exports = { userList };
