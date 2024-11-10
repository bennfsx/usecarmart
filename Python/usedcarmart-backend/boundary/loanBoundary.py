import time
from flask import Blueprint, request, jsonify
from controller.controller import calculate_monthly_payment

loan_blueprint = Blueprint('loan', __name__)

@loan_blueprint.route('/loan-calculator', methods=['POST'])
def loan_calculator():
    start_time = time.time()
    
    data = request.json
    price = data.get('price')
    down_payment = data.get('down_payment', 0)
    interest_rate = data.get('interest_rate')
    loan_term_years = data.get('loan_term_years')

    if None in [price, interest_rate, loan_term_years]:
        return jsonify({'error': 'Missing required fields'}), 400

    monthly_payment = calculate_monthly_payment(price, down_payment, interest_rate, loan_term_years)

    end_time = time.time()
    duration = end_time - start_time
    print(f"Loan calculation took {duration:.4f} seconds")

    return jsonify({'monthly_payment': round(monthly_payment, 2)})
