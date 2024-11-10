import React, { useState } from 'react';
import axios from 'axios';

const LoanCalculator = () => {
  const [price, setPrice] = useState(0);
  const [downPayment, setDownPayment] = useState(0);
  const [interestRate, setInterestRate] = useState(0);
  const [loanTermYears, setLoanTermYears] = useState(0);
  const [monthlyPayment, setMonthlyPayment] = useState(null);
  const [error, setError] = useState(null);

  const handleCalculate = async () => {
    try {
      const response = await axios.post('http://localhost:8000/loan-calculator', {
        price,
        down_payment: downPayment,
        interest_rate: interestRate,
        loan_term_years: loanTermYears
      });

      setMonthlyPayment(response.data.monthly_payment);
      setError(null);
    } catch (err) {
      setError('Error calculating monthly payment. Please try again.');
      setMonthlyPayment(null);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6">
          <h2 className="text-3xl font-semibold mb-4">Loan Calculator</h2>

          {/* Form to get loan details */}
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700">Car Price</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-md p-2"
                placeholder="Enter Car Price"
              />
            </div>

            <div>
              <label className="block text-gray-700">Down Payment</label>
              <input
                type="number"
                value={downPayment}
                onChange={(e) => setDownPayment(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-md p-2"
                placeholder="Enter Down Payment"
              />
            </div>

            <div>
              <label className="block text-gray-700">Interest Rate (%)</label>
              <input
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-md p-2"
                placeholder="Enter Interest Rate"
              />
            </div>

            <div>
              <label className="block text-gray-700">Loan Term (Years)</label>
              <input
                type="number"
                value={loanTermYears}
                onChange={(e) => setLoanTermYears(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-md p-2"
                placeholder="Enter Loan Term (in years)"
              />
            </div>

            <button
              onClick={handleCalculate}
              className="mt-4 bg-blue-600 text-white p-2 rounded-md"
            >
              Calculate Monthly Payment
            </button>
          </div>

          {/* Display Monthly Payment or Error */}
          {monthlyPayment !== null && (
            <div className="mt-6">
              <h3 className="text-xl font-semibold">Monthly Payment: ${monthlyPayment}</h3>
            </div>
          )}

          {error && (
            <div className="mt-6 text-red-500">{error}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoanCalculator;
