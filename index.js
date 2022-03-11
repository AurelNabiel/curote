const express = require("express");
const app = express();
const port = process.env.PORT || 9500
const cors = require("cors");
const { router } = require("./routes");


app.use(cors())
app.use(express.json())
app.use(router)





////////////////////////////////////////////////////////////////////
app.listen(port, () => {
  console.log(`Server Berjalan di port ${port}`);
});
////////////////////////////////////////////////////////////////////