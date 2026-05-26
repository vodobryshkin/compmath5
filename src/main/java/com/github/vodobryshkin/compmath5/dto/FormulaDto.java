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

    @AssertTrue(message = "Доступны только полиномы Ньютона, Лагранжа и Гаусса")
    public boolean isMethodAvailable() {
        return "newton".equals(methodName) || "lagrange".equals(methodName) || "gaussian".equals(methodName)
                || "bessel".equals(methodName) || "stirling".equals(methodName) || "chebyshev".equals(methodName);
    }

    @AssertTrue(message = "Столбцы X и Y должны быть одного размера")
    public boolean isFormulaAvailable() {
        return formulaNumber > 0 && formulaNumber < 6;
    }
}
