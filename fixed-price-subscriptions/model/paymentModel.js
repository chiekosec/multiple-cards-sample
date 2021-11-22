const knex = require("./connection");

let customerInfo = (data) => {
  return knex("user")
    .select("customerId", "customerName")
    .where("userEmail", data);
};

let subscriptionInfo = (data) => {
  return knex("user")
    .select(
      "subscriptionDueDate",
      "subscriptionPrice",
      "subscriptionStatus",
      "subscriptionName"
    )
    .where("userEmail", data);
};

let billingInfo = (data) => {
  return knex("user")
    .select("cardName", "cardBrand", "cardLast4", "cardExpYear", "cardExpMonth")
    .where("userEmail", data);
};

let transactionInfo = (data) => {
  return knex("user")
    .select("receiptUrl", "cardBrand", "cardLast4", "transactionId")
    .where("userEmail", data);
};

let insertCustomerInfo = (data) => {
  return knex("user").insert(data);
};

let updateCustomerInfo = (data) => {
  return knex("user")
    .where({ userEmail: data.userEmail })
    .update(data);
};

let checkSubscriptionStatus = (data) => {
  return knex("user")
    .select("subscriptionStatus")
    .where("userEmail", data);
};

let getDefaultPm = (data) => {
  return knex("user")
    .select("defaultPaymentMethodId")
    .where("userEmail", data);
};

let checkUserExist = (data) => {
  return knex("user")
    .select("userEmail")
    .where("userEmail", data);
};

let getClientSecret = (data) => {
  return knex("user")
    .select("clientSecret")
    .where("userEmail", data);
};

let getPaymentIntent = (data) => {
  return knex("user")
    .select("paymentIntentId")
    .where("userEmail", data);
};

let deleteCustomer = (email) => {
  return knex("user")
    .where("userEmail", email).del()
};

let transactionLogs = (logObject)=>{
  return knex('transactionLogs').insert(logObject)
}

let savePrefilledData = (email, data) => {
  return knex("user")
    .where("userEmail", email)
    .update(data);
};

let getPrefilledData = (email) => {
  return knex("user")
    .where("userEmail", email)
    .select("prefilledData")
};

// let getusertatus = (email) => {
//   return knex("payments")
//     .where("userEmail", email)
//     .select("subscriptionStatus")
// };

module.exports = {
  customerInfo,
  subscriptionInfo,
  billingInfo,
  transactionInfo,
  insertCustomerInfo,
  updateCustomerInfo,
  checkSubscriptionStatus,
  checkUserExist,
  getClientSecret,
  deleteCustomer,
  getPaymentIntent,
  transactionLogs,
  savePrefilledData,
  getPrefilledData,
  getDefaultPm
};