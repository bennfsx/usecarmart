// LoanController.java
package com.usedcarapp.controller;

import com.usedcarapp.dto.LoanCalculationRequest;
import com.usedcarapp.dto.LoanCalculationResponse;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/loan")
public class LoanController {

    @PostMapping("/calculate")
    public LoanCalculationResponse calculateLoan(@RequestBody LoanCalculationRequest request) {
        double principal = request.getPrice() - request.getDownPayment();
        double monthlyInterestRate = request.getInterestRate() / 100 / 12;
        int termInMonths = request.getLoanTermYears() * 12;

        // Calculate monthly payment using formula
        double monthlyPayment = (principal * monthlyInterestRate) / 
                                (1 - Math.pow(1 + monthlyInterestRate, -termInMonths));
        double totalPayment = monthlyPayment * termInMonths;

        return new LoanCalculationResponse(monthlyPayment, totalPayment);
    }
}
