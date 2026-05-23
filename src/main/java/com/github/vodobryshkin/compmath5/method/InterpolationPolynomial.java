package com.github.vodobryshkin.compmath5.method;

import java.util.ArrayList;
import java.util.List;

public abstract class InterpolationPolynomial implements MathematicalFunction {
    protected final List<Double> xColumn;
    protected final List<Double> yColumn;

    public InterpolationPolynomial(MathematicalFunction f, double a, double b, double n) {
        List<Double> xColumn = new ArrayList<>();
        List<Double> yColumn = new ArrayList<>();

        double step = (b - a) / n;

        for (double x = a; x <= b; x += step) {
            xColumn.add(x);
            yColumn.add(f.value(x).getResult());
        }

        this(xColumn, yColumn);
    }

    public InterpolationPolynomial(List<Double> xColumn, List<Double> yColumn) {
        if (xColumn.size() != yColumn.size()) {
            throw new IllegalArgumentException("X and Y columns must be the same sizes.");
        }

        this.xColumn = xColumn;
        this.yColumn = yColumn;
    }
}
