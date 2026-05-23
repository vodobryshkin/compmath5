package com.github.vodobryshkin.compmath5.method;

import com.github.vodobryshkin.compmath5.dto.Solution;

import java.util.ArrayList;
import java.util.List;

public class LagrangeInterpolationPolynomial extends InterpolationPolynomial {
    public LagrangeInterpolationPolynomial(MathematicalFunction f, double a, double b, double n) {
        super(f, a, b, n);
    }

    public LagrangeInterpolationPolynomial(List<Double> xColumn, List<Double> yColumn) {
        super(xColumn, yColumn);
    }

    @Override
    public Solution value(double x) {
        int n = xColumn.size();
        List<Double> arguments = new ArrayList<>();

        for (int i = 0; i < n; i++) {
            double xArg = 1;
            double yi = yColumn.get(i);

            for (int j = 0; j < n; j++) {
                if (i != j) {
                    double xi = xColumn.get(i);
                    double xj = xColumn.get(j);

                    xArg *= (x - xj) / (xi - xj);
                }
            }

            arguments.add(xArg * yi);
        }

        MathematicalFunction polynomial = new Polynomial(arguments);

        return polynomial.value(x);
    }
}
