package com.github.vodobryshkin.compmath5.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class TableDto {
    @NotNull
    @JsonProperty("method_name")
    private String methodName;

    private double x;

    @NotNull
    @JsonProperty("x_column")
    private List<Double> xColumn;

    @NotNull
    @JsonProperty("y_column")
    private List<Double> yColumn;

    @AssertTrue(message = "Доступны только полиномы Ньютона, Лагранжа и Гаусса")
    public boolean isMethodAvailable() {
        return "newton".equals(methodName) || "lagrange".equals(methodName) || "gaussian".equals(methodName);
    }

    @AssertTrue(message = "Столбцы X и Y должны быть одного размера")
    public boolean isSameSizes() {
        return xColumn.size() == yColumn.size();
    }
}
