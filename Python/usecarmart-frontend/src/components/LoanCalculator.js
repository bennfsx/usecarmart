import React, { useState } from 'react';
import axios from 'axios';

const LoanCalculator = () => {
  const [price, setPrice] = useState(0);
  const [downPayment, setDownPayment] = useState(0);
  const [interestRate, setInterestRate] = useState(0);
  const [loanTermYears, setLoanTermYears] = useState(0);
  const [monthlyPayment, setMonthlyPayment] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // To show loading spinner

  const handleCalculate = async () => {
    if (price <= 0 || downPayment <= 0 || interestRate <= 0 || loanTermYears <= 0) {
      setError("All fields must be filled out correctly.");
      return;
    }

    setIsLoading(true);
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
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 flex items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-lg max-w-lg w-full p-8">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">Loan Calculator</h2>
        
        <div className="space-y-6">
          {/* Car Price */}
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">Car Price</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 transition duration-200"
              placeholder="Enter Car Price"
            />
          </div>

          {/* Down Payment */}
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">Down Payment</label>
            <input
              type="number"
              value={downPayment}
              onChange={(e) => setDownPayment(Number(e.target.value))}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 transition duration-200"
              placeholder="Enter Down Payment"
            />
          </div>

          {/* Interest Rate */}
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">Interest Rate (%)</label>
            <input
              type="number"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 transition duration-200"
              placeholder="Enter Interest Rate"
            />
          </div>

          {/* Loan Term */}
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">Loan Term (Years)</label>
            <input
              type="number"
              value={loanTermYears}
              onChange={(e) => setLoanTermYears(Number(e.target.value))}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 transition duration-200"
              placeholder="Enter Loan Term (in years)"
            />
          </div>

          {/* Calculate Button */}
          <button
            onClick={handleCalculate}
            className="w-full py-3 mt-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-200 flex items-center justify-center"
          >
            {isLoading ? (
              <svg
                className="w-5 h-5 mr-3 animate-spin text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 118 8 8 8 0 01-8-8z"
                />
              </svg>
            ) : null}
            Calculate Monthly Payment
          </button>

          {/* Error Message */}
          {error && (
            <div className="text-red-500 text-sm mt-2 text-center">{error}</div>
          )}

          {/* Monthly Payment Display */}
          {monthlyPayment !== null && !isLoading && (
            <div className="mt-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-md">
              <h3 className="text-lg font-semibold text-gray-800">Your Monthly Payment</h3>
              <p className="text-2xl font-bold text-gray-900">${monthlyPayment}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoanCalculator;
