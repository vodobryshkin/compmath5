package com.github.vodobryshkin.compmath5.method;

import com.github.vodobryshkin.compmath5.dto.Solution;

import java.util.Arrays;
import java.util.List;

public class Polynomial implements MathematicalFunction {
    private final List<Double> arguments;

    public Polynomial(Number... arguments) {
        this(Arrays.stream(arguments).map(Number::doubleValue).toList());
    }

    public Polynomial(List<Double> arguments) {
        this.arguments = arguments;
    }

    @Override
    public Solution value(double x) {
        double sum = 0;

        for (int i = 0; i < arguments.size(); i++) {
            sum += arguments.get(i) * Math.pow(x, arguments.size() - i - 1);
        }

        return new Solution(sum, null);
    }

    @Override
    public String toString() {
        return String.join(";", arguments.stream().map(Object::toString).toList());
    }
}
