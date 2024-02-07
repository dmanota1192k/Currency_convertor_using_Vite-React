import { useState } from 'react';
import './App.css';
import countryList from './countryList';

const BaseUrl = "https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/";

function App() {
  const [fromCurr, setFromCurr] = useState('USD');
  const [toCurr, setToCurr] = useState('INR');
  const [amount, setAmount] = useState(1);
  const [msg, setMsg] = useState('');

  const updateFlag = (element, currCode) => {
    let countryCode = countryList[currCode];
    let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
    let img = element.parentElement.querySelector("img");
    img.src = newSrc;
  };

  const updateExchangeRate = async () => {
    try {
      if (amount === "" || amount < 1) {
        setAmount(1);
      }

      const url = `${BaseUrl}/${fromCurr.toLowerCase()}/${toCurr.toLowerCase()}.json`;
      let response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch exchange rate data: ${response.statusText}`);
      }

      let data = await response.json();
      let rate = data[toCurr.toLowerCase()];

      if (rate === undefined) {
        throw new Error(`Exchange rate not available for ${fromCurr} to ${toCurr}`);
      }

      let finalAmount = amount * rate;
      setMsg(`${amount} ${fromCurr} = ${finalAmount} ${toCurr}`);

      // Set background color based on the converted amount
      if (finalAmount > 0 && finalAmount < 10) {
        setMsgClass('lowAmount');
      } else if (finalAmount >= 10 && finalAmount < 100) {
        setMsgClass('mediumAmount');
      } else if (finalAmount >= 100) {
        setMsgClass('highAmount');
      } else {
        setMsgClass('defaultAmount');
      }
    } catch (error) {
      console.error(error.message);
      setMsg(`Error fetching exchange rate. Please try again.`);
      setMsgClass('errorAmount');
    }
  };

  const handleButtonClick = () => {
    updateExchangeRate();
  };

  const [msgClass, setMsgClass] = useState('defaultAmount');

  return (
    <div className="container">
      <h1>Currency Convertor</h1>
      <form>
        <div className="amount">
          <p>Enter Amount</p>
          <input value={amount} type="number" onChange={(e) => setAmount(e.target.value)} />
        </div>
        <div className="dropdown">
          <div className="from">
            <p>From</p>
            <div className="select-container">
              <img src={`https://flagsapi.com/${countryList[fromCurr]}/flat/64.png`} alt="" />
              <select
                name="from"
                value={fromCurr}
                onChange={(e) => setFromCurr(e.target.value)}
                onMouseEnter={(e) => updateFlag(e.target, e.target.value)}
              >
                {Object.keys(countryList).map((currcode) => (
                  <option key={currcode} value={currcode}>
                    {currcode}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <i className="fa-solid fa-arrow-right-arrow-left"></i>
          <div className="to">
            <p>To</p>
            <div className="select-container">
              <img src={`https://flagsapi.com/${countryList[toCurr]}/flat/64.png`} alt="" />
              <select
                name="to"
                value={toCurr}
                onChange={(e) => setToCurr(e.target.value)}
                onMouseEnter={(e) => updateFlag(e.target, e.target.value)}
              >
                {Object.keys(countryList).map((currcode) => (
                  <option key={currcode} value={currcode}>
                    {currcode}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className={`msg ${msgClass}`}>{msg}</div>
        <button type="button" onClick={handleButtonClick}>
          Get Exchange Rate
        </button>
      </form>
    </div>
  );
}

export default App;
