import React, { useEffect, useState } from "react";
import { Link, withRouter } from "react-router-dom";
import { Redirect } from "react-router";
import Loader from "./loader/loader";

const BillingPage = () => {
  const [clientSecret, setClientSecret] = useState(null);
  const [cards, setCards] = useState([]);
  const [PIClientSecret, setPIClientSecret] = useState(null);
  const [defaultPm, setDefaultPm] = useState(null);
  const [loading, setLoading] = useState(null);

  useEffect(() => {
    setLoading(true)
    fetch("/payment-methods")
      .then((res) => res.json())
      .then((data) => {
        setCards(data.pm);
        setDefaultPm(data.defaultPm);
        setLoading(false)
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    const { client_secret } = await fetch("/checkout", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((r) => r.json());
    setClientSecret(client_secret);
    setLoading(false)
  };

  const handleSubmit2 = async (e) => {
    e.preventDefault();
    setLoading(true)
    const { client_secret } = await fetch("/create-payment-intent", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((r) => r.json());
    setPIClientSecret(client_secret);
    setLoading(false)
  };

  const changeDefault = async (PM) => {
    await fetch("/set-default", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pm: PM,
      }),
    }).then((r) => r.json());
    window.location.reload()
  }

  const removePm = async (PM) => {
    await fetch("/remove-payment-method", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pm: PM,
      }),
    }).then((r) => r.json());
    window.location.reload()
  }

  if (clientSecret) {
    return <Redirect to={{ pathname: "/checkout", state: clientSecret }} />;
  }

  if (PIClientSecret) {
    return (
      <Redirect to={{ pathname: "/checkout-payment", state: PIClientSecret }} />
    );
  }

  return (
    <div>
      {loading && <Loader />}
      <Link className='back-link' to='/'> {'⬅'} </Link>
      <h1>Billing Page</h1>
      {cards.length === 0 ? (
        <div>No payment methods found...</div>
      ) : (
        cards.map((card) => {
          return (
            <div
              key={card.id}
              className={`card-container ${
                defaultPm === card.id ? "default" : ""
              }`}
            >
              <span className='danger' onClick={() => removePm(card.id)}>X</span>
              <p>
                <span>Last4: {card.card.last4}</span>{" "}
                <span>{card.card.country}</span>
              </p>
              <p>Brand: {card.card.brand}</p>
              <p>
                Expiry: {card.card.exp_month}/{card.card.exp_year}
              </p>
              {defaultPm === card.id ? '' : <button onClick={() => changeDefault(card.id)}>Set default</button>}
            </div>
          );
        })
      )}
      <button onClick={handleSubmit}>Add new Payment Method</button>
      {cards.length === 0 ? (
        ""
      ) : (
        <button onClick={handleSubmit2}>Buy Plan ($1)</button>
      )}
    </div>
  );
};

export default withRouter(BillingPage);
