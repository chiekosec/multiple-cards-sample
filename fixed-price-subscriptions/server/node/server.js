const express = require("express");
const mongoose = require("mongoose");
const app = express();
const { resolve } = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const User = require("./db/models");
const paymentModel = require("../../model/paymentModel");
// Replace if using a different env file or config
require("dotenv").config({ path: "./.env" });

if (
  !process.env.STRIPE_SECRET_KEY ||
  !process.env.STRIPE_PUBLISHABLE_KEY ||
  !process.env.STATIC_DIR
) {
  console.log(
    "The .env file is not configured. Follow the instructions in the readme to configure the .env file. https://github.com/stripe-samples/subscription-use-cases"
  );
  console.log("");
  process.env.STRIPE_SECRET_KEY
    ? ""
    : console.log("Add STRIPE_SECRET_KEY to your .env file.");

  process.env.STRIPE_PUBLISHABLE_KEY
    ? ""
    : console.log("Add STRIPE_PUBLISHABLE_KEY to your .env file.");

  process.env.STATIC_DIR
    ? ""
    : console.log(
        "Add STATIC_DIR to your .env file. Check .env.example in the root folder for an example"
      );

  process.exit();
}

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2020-08-27",
});

// Use static to serve static assets.
app.use(express.static(process.env.STATIC_DIR));

// Use cookies to simulate logged in user.
app.use(cookieParser());

// Use JSON parser for parsing payloads as JSON on all non-webhook routes.
app.use((req, res, next) => {
  if (req.originalUrl === "/webhook") {
    next();
  } else {
    bodyParser.json()(req, res, next);
  }
});

// creates user in local db and stripe 👨⬇
app.post("/create-customer", async (req, res) => {
  // Create a new customer object

  let userExist = await paymentModel.checkUserExist(req.body.email);

  console.log("userExist", userExist);

  if (!userExist[0]) {
    const customer = await stripe.customers.create({
      email: req.body.email,
    });

    paymentModel
      .insertCustomerInfo({
        userEmail: req.body.email,
        customerId: customer.id,
      })
      .then((data) => {
        res.cookie("customer", customer.id, {
          maxAge: 86400000,
          httpOnly: true,
        });
        res.cookie("user", req.body.email, {
          maxAge: 86400000,
          httpOnly: true,
        });

        res.send({ customer: customer });
      })
      .catch((e) => {
        res.status(400).json({ error: "DB ERROR!!!" });
      });
  } else {
    paymentModel.customerInfo(req.body.email).then((data) => {
      res.cookie("user", req.body.email, { maxAge: 86400000, httpOnly: true });
      res.cookie("customer", data[0].customerId, {
        maxAge: 86400000,
        httpOnly: true,
      });

      res.send({ customer: data[0].customerId });
    });
  }

  // const user = new User({
  //   userId: req.body.email,
  //   customerId: customer.id,
  //   productId: null,
  //   subscriptionId: null,
  //   subscriptionStatus: null,
  // });

  // await user.save();
  // Save the customer.id in your database alongside your user.
  // We're simulating authentication with a cookie.
  // res.cookie("customer", customer.id, { maxAge: 86400000, httpOnly: true });
  // res.cookie("user", user.userId, { maxAge: 86400000, httpOnly: true });

  // res.send({ customer: customer });
});

app.post("/checkout", async (req, res) => {
  const { client_secret } = await stripe.setupIntents.create({
    customer: req.cookies["customer"],
    payment_method_types: ["card"],
  });

  res.send({ client_secret });
});

app.post("/set-default", async (req, res) => {
  paymentModel
    .updateCustomerInfo({
      userEmail: req.cookies["user"],
      defaultPaymentMethodId: req.body.pm,
    })
    .then((data) => {
      res.send({ success: 1 });
    })
    .catch((e) => {
      res.status(400).json({ error: "DB ERROR!!!" });
    });
});

app.post("/remove-payment-method", async (req, res) => {
  const paymentMethod = await stripe.paymentMethods.detach(req.body.pm);

  const data = await paymentModel.getDefaultPm(req.cookies["user"]);

  if (data[0].defaultPaymentMethodId === req.body.pm) {
    paymentModel
      .updateCustomerInfo({
        userEmail: req.cookies["user"],
        defaultPaymentMethodId: null,
      })
      .then((data) => {
        res.send({ success: 1 });
      })
      .catch((e) => {
        res.status(400).json({ error: "DB ERROR!!!" });
      });
  } else {
    res.send({ success: 1 });
  }
});

app.post("/create-payment-intent", async (req, res) => {
  const paymentIntent = await stripe.paymentIntents.create({
    customer: req.cookies["customer"],
    setup_future_usage: "off_session",
    amount: 100,
    currency: "usd",
    payment_method_types: ["card"],
    description: "Sample Launch Plan",
  });

  const { client_secret } = paymentIntent;

  paymentModel
    .updateCustomerInfo({
      clientSecret: client_secret,
      userEmail: req.cookies["user"],
      paymentIntentId: paymentIntent.id,
    })
    .then((data) => {
      res.send({ client_secret });
    })
    .catch((e) => {
      res.status(400).json({ error: "DB ERROR!!!" });
    });
});

app.get("/payment-methods", async (req, res) => {
  const data = await paymentModel.getDefaultPm(req.cookies["user"]);
  console.log("DEFAULT PM", data);
  const paymentMethods = await stripe.paymentMethods.list({
    customer: req.cookies["customer"],
    type: "card",
  });

  // console.log("PM",paymentMethods);
  return res.json({
    pm: paymentMethods.data,
    defaultPm: data[0].defaultPaymentMethodId,
  });
});

app.get("/update-payment", async (req, res) => {
  let data = await paymentModel.getPaymentIntent(req.cookies["user"]);
  // console.log(data);
  const paymentIntent = await stripe.paymentIntents.update(
    data[0].paymentIntentId,
    {
      amount: 100,
      currency: "inr",
    }
  );

  // console.log("Updated",paymentIntent);
  res.status(200).json({ PI: paymentIntent });
});

app.listen(4242, () =>
  console.log(`Node server listening on port http://localhost:${4242}!`)
);
