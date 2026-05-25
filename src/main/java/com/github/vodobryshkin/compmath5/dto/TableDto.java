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

    @AssertTrue(message = "Only Three Methods Are Available")
    public boolean isMethodAvailable() {
        return "newton".equals(methodName) || "lagrange".equals(methodName) || "gaussian".equals(methodName);
    }

    @AssertTrue(message = "X column and Y column must have the same sizes")
    public boolean isSameSizes() {
        return xColumn.size() == yColumn.size();
    }
}
