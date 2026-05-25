package com.github.vodobryshkin.compmath5.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.AssertTrue;
import lombok.Data;

@Data
public class FormulaDto {
    @JsonProperty("method_name")
    private String methodName;

    @JsonProperty("formula_number")
    private int formulaNumber;

    private double x;

    private double a;
    private double b;
    private int n;

    @AssertTrue(message = "Only Three Methods Are Available")
    public boolean isMethodAvailable() {
        return "newton".equals(methodName) || "lagrange".equals(methodName) || "gaussian".equals(methodName);
    }

    @AssertTrue(message = "X column and Y column must have the same sizes")
    public boolean isFormulaAvailable() {
        return formulaNumber > 0 && formulaNumber < 6;
    }
}
