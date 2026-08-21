import dotenv from "dotenv";
dotenv.config();

import connectdb from "./config/db";
import { app } from "./app";

connectdb()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`⚙️ Service is running on Port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB Connection Failed ", err);
  });
