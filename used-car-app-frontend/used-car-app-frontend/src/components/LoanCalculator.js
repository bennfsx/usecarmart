import React, { useState } from "react";
import axios from "axios";

const LoanCalculator = () => {
  const [price, setPrice] = useState("");
  const [downPayment, setDownPayment] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [loanTermYears, setLoanTermYears] = useState("");
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8080/api/loan/calculate", {
        price: parseFloat(price),
        downPayment: parseFloat(downPayment),
        interestRate: parseFloat(interestRate),
        loanTermYears: parseInt(loanTermYears),
      });
      setResult(response.data);
    } catch (error) {
      console.error("Error calculating loan:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md mt-8">
      <h2 className="text-xl font-semibold mb-4">Loan Calculator</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Car Price:</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="border border-gray-300 rounded-md p-2 w-full"
          />
        </div>
        <div>
          <label className="block font-medium">Down Payment:</label>
          <input
            type="number"
            value={downPayment}
            onChange={(e) => setDownPayment(e.target.value)}
            className="border border-gray-300 rounded-md p-2 w-full"
          />
        </div>
        <div>
          <label className="block font-medium">Interest Rate (%):</label>
          <input
            type="number"
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
            className="border border-gray-300 rounded-md p-2 w-full"
          />
        </div>
        <div>
          <label className="block font-medium">Loan Term (years):</label>
          <input
            type="number"
            value={loanTermYears}
            onChange={(e) => setLoanTermYears(e.target.value)}
            className="border border-gray-300 rounded-md p-2 w-full"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white rounded-md py-2 px-4 w-full hover:bg-blue-600"
        >
          Calculate
        </button>
      </form>

      {result && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold">Calculation Result</h3>
          <p>Monthly Payment: ${result.monthlyPayment.toFixed(2)}</p>
          <p>Total Payment: ${result.totalPayment.toFixed(2)}</p>
        </div>
      )}
    </div>
  );
};

export default LoanCalculator;
