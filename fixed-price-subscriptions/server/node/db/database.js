const mongoose = require("mongoose");

const conn =
  "mongodb+srv://admin:admin@twitter-clone-cluster.gwjmq.mongodb.net/stripe?retryWrites=true&w=majority";
mongoose
  .connect(
    "mongodb+srv://admin:adminadmin@twitter-clone-cluster.gwjmq.mongodb.net/stripe?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Connectin successful"))
  .catch((e) => console.log(e));
// const db = mongoose.connection;
