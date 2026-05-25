package com.github.vodobryshkin.compmath5.method;
import com.github.vodobryshkin.compmath5.dto.Solution;

import java.util.ArrayList;
import java.util.List;

public class GaussianInterpolationPolynomial extends InterpolationPolynomial {
    public GaussianInterpolationPolynomial(MathematicalFunction f, double a, double b, double n) {
        super(f, a, b, n);
    }

    public GaussianInterpolationPolynomial(List<Double> xColumn, List<Double> yColumn) {
        if (xColumn.size() > 2) {
            double diff = xColumn.get(1) - xColumn.getFirst();

            for (int i = 2; i < xColumn.size(); i++) {
                if (xColumn.get(i) - xColumn.get(i - 1) != diff) {
                    throw new IllegalArgumentException("Gaussian method should be running with the same difference between x column elements.");
                }
            }
        }

        super(xColumn, yColumn);
    }

    @Override
    public Solution value(double x) {
        double centerX = xColumn.get(xColumn.size() / 2 - (xColumn.size() + 1) % 2);
        double h = xColumn.get(1) - xColumn.getFirst();
        double t = (x - centerX) / h;

        if (x > centerX) {
            return firstFormula(t);
        }

        return secondFormula(t);
    }

    private Solution firstFormula(double t) {
        int size = xColumn.size();
        int centerIndex = (size - 1) / 2;

        List<List<Double>> differences = table();

        double result = differences.get(centerIndex).getFirst();

        int order = 1;
        double numerator = t;
        double factorial = 1.0;

        int row = centerIndex;

        if (row < size && order < differences.get(row).size()) {
            result += numerator / factorial * differences.get(row).get(order);
        }

        int shift = 1;

        while (order < size - 1) {
            order++;
            factorial *= order;
            numerator *= t - shift;

            row = centerIndex - shift;

            if (row < 0 || row >= size || order >= differences.get(row).size()) {
                break;
            }

            result += numerator / factorial * differences.get(row).get(order);

            if (order >= size - 1) {
                break;
            }

            order++;
            factorial *= order;
            numerator *= t + shift;

            row = centerIndex - shift;

            if (row < 0 || row >= size || order >= differences.get(row).size()) {
                break;
            }

            result += numerator / factorial * differences.get(row).get(order);

            shift++;
        }

        return new Solution(result, xColumn, yColumn, differences, firstFormulaString(t));
    }

    private Solution secondFormula(double t) {
        int size = xColumn.size();
        int centerIndex = (size - 1) / 2;

        List<List<Double>> differences = table();

        double result = differences.get(centerIndex).getFirst();

        int order = 1;
        double numerator = t;
        double factorial = 1.0;

        int row = centerIndex - 1;

        if (row >= 0 && row < size && order < differences.get(row).size()) {
            result += numerator / factorial * differences.get(row).get(order);
        }

        int shift = 1;

        while (order < size - 1) {
            order++;
            factorial *= order;
            numerator *= t + shift;

            row = centerIndex - shift;

            if (row < 0 || row >= size || order >= differences.get(row).size()) {
                break;
            }

            result += numerator / factorial * differences.get(row).get(order);

            if (order >= size - 1) {
                break;
            }

            order++;
            factorial *= order;
            numerator *= t - shift;

            row = centerIndex - shift - 1;

            if (row < 0 || row >= size || order >= differences.get(row).size()) {
                break;
            }

            result += numerator / factorial * differences.get(row).get(order);

            shift++;
        }

        return new Solution(result, xColumn, yColumn, differences, secondFormulaString(t));
    }

    private List<List<Double>> table() {
        int n = yColumn.size();
        List<List<Double>> table = new ArrayList<>(n);

        for (Double y : yColumn) {
            table.add(new ArrayList<>(List.of(y)));
        }

        for (int order = 1; order < n; order++) {
            for (int i = 0; i < n - order; i++) {
                double next = table.get(i + 1).get(order - 1);
                double current = table.get(i).get(order - 1);

                table.get(i).add(next - current);
            }
        }

        return table;
    }

    private String firstFormulaString(double t) {
        int size = xColumn.size();
        int centerIndex = (size - 1) / 2;

        List<List<Double>> differences = table();

        StringBuilder result = new StringBuilder();
        result.append(differences.get(centerIndex).getFirst());

        int order = 1;
        long factorial = 1L;
        int shift = 1;

        List<String> factors = new ArrayList<>();
        factors.add(String.valueOf(t));

        int row = centerIndex;

        if (order < differences.get(row).size()) {
            result.append(" + ").append(String.join(" * ", factors)).append(" * ").append(differences.get(row).get(order));
        }

        while (order < size - 1) {
            order++;
            factorial *= order;
            factors.add("(" + t + " - " + shift + ")");

            row = centerIndex - shift;

            if (row < 0 || row >= size || order >= differences.get(row).size()) {
                break;
            }

            result.append(" + (").append(String.join(" * ", factors)).append(") / ").append(factorial).append(" * ").append(differences.get(row).get(order));

            if (order >= size - 1) {
                break;
            }

            order++;
            factorial *= order;
            factors.addFirst("(" + t + " + " + shift + ")");

            row = centerIndex - shift;

            if (row < 0 || row >= size || order >= differences.get(row).size()) {
                break;
            }

            result.append(" + (").append(String.join(" * ", factors)).append(") / ").append(factorial).append(" * ").append(differences.get(row).get(order));

            shift++;
        }

        return result.toString();
    }

    private String secondFormulaString(double t) {
        int size = xColumn.size();
        int centerIndex = (size - 1) / 2;

        List<List<Double>> differences = table();

        StringBuilder result = new StringBuilder();
        result.append(differences.get(centerIndex).getFirst());

        int order = 1;
        long factorial = 1L;
        int shift = 1;

        List<String> factors = new ArrayList<>();
        factors.add(String.valueOf(t));

        int row = centerIndex - 1;

        if (row >= 0 && order < differences.get(row).size()) {
            result.append(" + ").append(String.join(" * ", factors)).append(" * ").append(differences.get(row).get(order));
        }

        while (order < size - 1) {
            order++;
            factorial *= order;
            factors.addFirst("(" + t + " + " + shift + ")");

            row = centerIndex - shift;

            if (row < 0 || row >= size || order >= differences.get(row).size()) {
                break;
            }

            result.append(" + (").append(String.join(" * ", factors)).append(") / ").append(factorial).append(" * ").append(differences.get(row).get(order));

            if (order >= size - 1) {
                break;
            }

            order++;
            factorial *= order;
            factors.add("(" + t + " - " + shift + ")");

            row = centerIndex - shift - 1;

            if (row < 0 || row >= size || order >= differences.get(row).size()) {
                break;
            }

            result.append(" + (").append(String.join(" * ", factors)).append(") / ").append(factorial).append(" * ").append(differences.get(row).get(order));

            shift++;
        }

        return result.toString();
    }
}
