
exports.up = function(knex) {
  knex.schema.hasTable("payments").then(function (exists) {
		if (!exists) {
			return knex.schema.createTable("user", function (t) {
				t.increments("userId").primary();
				t.string("userEmail");
				t.string("customerId");
				t.string("customerName");
				t.string("subscriptionId");
				t.string("clientSecret");
				t.string("paymentIntentId");
				t.string("subscriptionName");
				t.string("subscriptionInterval");
				t.string("subscriptionDueDate");
				t.string("subscriptionStatus");
				t.integer("subscriptionPrice");
				t.string("defaultPaymentMethodId");
				t.string("priceId");
				t.string("cardName");
				t.string("cardBrand");
				t.string("cardLast4");
				t.string("cardExpYear");
				t.string("cardExpMonth");
				t.string("receiptUrl");
				t.string("transactionId");
				t.string("prefilledData");
				t.text("customerAddress");
			});
		}
	})
};

exports.down = function(knex) {
  return knex.schema.dropTable("user");
};
