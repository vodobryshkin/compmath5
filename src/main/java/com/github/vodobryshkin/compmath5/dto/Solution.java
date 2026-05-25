package com.github.vodobryshkin.compmath5.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Value;

import java.util.List;

@Value
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Solution {
    double result;
    @JsonProperty("x_column")
    List<Double> xColumn;
    @JsonProperty("y_column")
    List<Double> yColumn;
    List<List<Double>> differences;
    String formula;
}
