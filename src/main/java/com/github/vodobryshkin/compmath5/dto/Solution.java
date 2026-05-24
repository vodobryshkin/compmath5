package com.github.vodobryshkin.compmath5.dto;

import lombok.Value;

import java.util.List;

@Value
public class Solution {
    double result;
    List<List<Double>> differences;
    String formula;
}
