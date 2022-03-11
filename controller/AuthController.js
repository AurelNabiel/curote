const UserModel = require("../models").petugas;
const forgotPasswordModel = require("../models").forgotPassword;
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const { Op } = require("sequelize");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const { validationResult } = require("express-validator");
const { sequelize } = require("../models");

const register = async (req, res) => {
  try {
    let body = req.body;
    body.password = await bcrypt.hashSync(body.password, 10);
    const users = await UserModel.create(body);
    console.log(users);

    res.status(200).json({
      status: "Succes",
      messege: "Register Berhasil",
    });
  } catch (error) {}
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const data = await UserModel.findOne({
      where: { username: username },
    });
    if (!data) return res.status(442).json({ messege: "tidak terdaftar" });
    const verify = await bcrypt.compareSync(password, data.password);
    if(!verify) return res.status(442).json({messege:"password salah"})
    res.status(200).json({
      messege:"berhasil",
      token:""
    })

  } catch (err) {
    console.log(err);
  }
};

const authme = async (req, res) => {
  const { authorization } = req.headers;
  const token = authorization.split(" ")[1];
  jwt.verify(token, process.env.JWT_ACCESS_TOKEN, async (err, decode) => {
    if (err) {
      return res.status(401).json({
        status: "fail",
        msg: "invalid",
        data: err,
      });
    } else {
      try {
        req.name = decode?.name;
        const token = jwt.sign(
          {
            name: req.name,
          },
          process.env.JWT_ACCESS_TOKEN,
          { expiresIn: "1d" }
        );
        return res.json({
          status: "succes",
          msg: "Berhasil mendapat Token baru",
          token: token,
        });
      } catch (error) {
        return res.status(401).json({
          status: "fail",
          msg: "invalid",
          data: error,
        });
      }
    }
  });
};

const lupaPassword = async (req, res) => {
  let { name } = req.body;

  const user = await UserModel.findOne({
    where: {
      name: name,
    },
  });
  if (!user) {
    return res.status(404).json({
      status: "fail",
      msg: "Nama tidak ditemukan, Silahkan gunakan Nama yang terdaftar",
    });
  }
  let token = crypto.randomBytes(32).toString("hex");

  const link = `${process.env.MAIL_CLIENT_URL}/reset-password/${user.id}/${token}`;
  const context = {
    url: link,
  };
  const mail = await sendEmail(
    user.email,
    "Reset Password",
    "lupa_Password",
    context
  );

  if (mail === "error") {
    return res.status(422).json({
      status: "Fail",
      msg: "Email tidak terkirim",
    });
  }
  await forgotPasswordModel.create({
    userId: user.id,
    token: token,
  });

  return res.json({
    status: "Success",
    msg: "Silahkan Periksa Email Masuk",
  });
};
const resetPassword = async (req, res) => {
  let { userId, token } = req.params;
  let { passwordBaru } = req.body;

  const verify = await forgotPasswordModel.findOne({
    where: {
      [Op.and]: [{ userId: userId }, { token: token }],
    },
  });
  if (verify === null) {
    return res.json({
      status: "Fail",
      msg: "Token tidak Valid",
    });
  }

  passwordBaru = await bcrypt.hashSync(passwordBaru, 10);
  await UserModel.update(
    {
      password: passwordBaru,
    },
    {
      where: {
        id: userId,
      },
    }
  );

  await forgotPasswordModel.destroy({
    where: {
      userId: userId,
    },
  });

  return res.status(201).json({
    status: "Success",
    msg: "Password berhasil di perbaharui",
  });
};

const googleAccountRegister = async (req, res) => {
  try {
    const data = await client.verifyIdToken({
      idToken: req.body.token,
    });
    const dataUser = data.getPayload();

    const payload = {
      name: dataUser.name,
      email: dataUser.email,
    };
    const cekUser = await UserModel.findOne({
      where: {
        email: dataUser.email,
      },
    });

    if (cekUser) {
      return res.status(422).json({
        status: "Fail",
        msg: "Email sudah terdaftar",
      });
    }
    await UserModel.create(payload);

    const user = await UserModel.findOne({
      where: {
        email: dataUser.email,
      },
    });

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_ACCESS_TOKEN,
      {
        expiresIn: "1d",
      }
    );
    res.status(201).json({
      status: "Success",
      msg: "Register Berhasil",
      token: true,
    });
  } catch (err) {
    console.log(err);
    return res.status(403).json({
      status: "Fail",
      msg: "Token tidak valid",
    });
  }
};

const googleAccountLogin = async (req, res) => {
  res.send("google Login");
};

module.exports = {
  register,
  login,
  authme,
  lupaPassword,
  resetPassword,
  googleAccountRegister,
  googleAccountLogin,
};
