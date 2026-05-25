package com.github.vodobryshkin.compmath5.method;

import java.util.ArrayList;
import java.util.List;

public abstract class InterpolationPolynomial implements MathematicalFunction {
    protected final List<Double> xColumn;
    protected final List<Double> yColumn;

    public InterpolationPolynomial(MathematicalFunction f, double a, double b, double n) {
        List<Double> xColumn = new ArrayList<>();
        List<Double> yColumn = new ArrayList<>();

        double step = (b - a) / (n - 1);

        for (int i = 0; i < n; i++) {
            double x = i == n - 1 ? b : a + i * step;

            xColumn.add(x);
            yColumn.add(f.value(x).getResult());
        }

        this(xColumn, yColumn);
    }

    public InterpolationPolynomial(List<Double> xColumn, List<Double> yColumn) {
        if (xColumn.size() != yColumn.size()) {
            throw new IllegalArgumentException("Столбцы X и Y должны иметь один размер.");
        }

        this.xColumn = xColumn;
        this.yColumn = yColumn;
    }
}
