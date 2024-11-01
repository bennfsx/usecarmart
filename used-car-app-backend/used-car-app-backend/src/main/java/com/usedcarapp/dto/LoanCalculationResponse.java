// LoanCalculationResponse.java
package com.usedcarapp.dto;

public class LoanCalculationResponse {
    private double monthlyPayment;
    private double totalPayment;

    // Constructor
    public LoanCalculationResponse(double monthlyPayment, double totalPayment) {
        this.monthlyPayment = monthlyPayment;
        this.totalPayment = totalPayment;
    }

    // Getters and Setters
    public double getMonthlyPayment() {
        return monthlyPayment;
    }

    public void setMonthlyPayment(double monthlyPayment) {
        this.monthlyPayment = monthlyPayment;
    }

    public double getTotalPayment() {
        return totalPayment;
    }

    public void setTotalPayment(double totalPayment) {
        this.totalPayment = totalPayment;
    }
}
