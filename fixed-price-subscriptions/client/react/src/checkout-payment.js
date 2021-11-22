import { useStripe } from "@stripe/react-stripe-js";
import React, { useEffect, useState } from "react";
import { Link, withRouter } from "react-router-dom";
import { Redirect } from "react-router";
import Loader from "./loader/loader";

const CheckoutPayment = ({ location }) => {
  const stripe = useStripe();
  const [cards, setCards] = useState([]);
  const [pm, setPm] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [card, setCard] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(null);
  const [loading, setLoading] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch("/payment-methods")
      .then((res) => res.json())
      .then((data) => {
        setCards(data.pm);
        setPm(data.defaultPm);
        data.pm.forEach((item) => {
          if (item.id === data.defaultPm) {
            setCard(item);
          }
        });
        setLoading(false);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (card.billing_details.address.country === "IN") {
      try {
        await fetch("/update-payment")
      } catch (e) {
        console.log(e);
      }
    }

    let data = await stripe.confirmCardPayment(location.state, {
      payment_method: pm,
    });

    if (data.error) {
      // This point will only be reached if there is an immediate error when
      // confirming the payment. Show error to your customer (e.g., payment
      // details incomplete)
      setErrorMessage(data.error.message);
      setLoading(false);
    } else {
      setPaymentSuccess(true);
      setLoading(false);

      // Your customer will be redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer will be redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.
    }
  };

  if (paymentSuccess) {
    return <Redirect to="/billing-page" />;
  }

  return (
    <div>
      {loading && <Loader />}
      <Link className="back-link" to="/billing-page">
        {" "}
        {"⬅"}{" "}
      </Link>
      <h1>Payment Page</h1>
      <h3>Select Payment method to pay</h3>
      {cards.length === 0 ? (
        <div>No payment methods found...</div>
      ) : (
        cards.map((card) => {
          return (
            <div
              id={card.id}
              key={card.id}
              className={`card-container ${card.id === pm ? "active" : ""}`}
              style={{ cursor: "pointer" }}
              onClick={() => {
                setPm(card.id);
                setCard(card);
              }}
            >
              <p>
                <span>Last4: {card.card.last4}</span>{" "}
                <span>{card.card.country}</span>
              </p>
              <p>Brand: {card.card.brand}</p>
              <p>
                Expiry: {card.card.exp_month}/{card.card.exp_year}
              </p>
            </div>
          );
        })
      )}

      <button onClick={handleSubmit} disabled={pm ? false : true}>
        Pay Now ($1)
      </button>
      {errorMessage && <h3 className='err-msg'>{errorMessage}</h3>}
    </div>
  );
};

export default withRouter(CheckoutPayment);
