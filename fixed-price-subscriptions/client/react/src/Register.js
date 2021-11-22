import React, { useState } from "react";
import "./App.css";
import { Redirect } from "react-router-dom";
import Loader from "./loader/loader";

const Register = (props) => {
  const [email, setEmail] = useState("");
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    const { customer } = await fetch("/create-customer", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
      }),
    }).then((r) => r.json());
    setCustomer(customer);
    setLoading(false)
  };

  if (customer) {
    return <Redirect to={{ pathname: "/billing-page" }} />;
  }

  return (
    <main>
      {loading && <Loader />}
      <h1>Sample Launch Plan</h1>

      <p>Got one time offer!!!</p>

      <form onSubmit={handleSubmit}>
        <label>
          Email
          <input
            type="text"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <button type="submit">Register / login</button>
      </form>
    </main>
  );
};

export default Register;
