package com.github.vodobryshkin.compmath5.method;

import com.github.vodobryshkin.compmath5.dto.Solution;

import java.util.ArrayList;
import java.util.List;

public class BesselInterpolationPolynomial extends InterpolationPolynomial {
    public BesselInterpolationPolynomial(MathematicalFunction f, double a, double b, double n) {
        super(f, a, b, n);

        if (xColumn.size() < 4) {
            throw new IllegalArgumentException("Метод Бесселя требует минимум четыре узла.");
        }

        if (xColumn.size() % 2 != 0) {
            throw new IllegalArgumentException("Метод Бесселя строится по чётному количеству узлов.");
        }
    }

    public BesselInterpolationPolynomial(List<Double> xColumn, List<Double> yColumn) {
        if (xColumn.size() < 4) {
            throw new IllegalArgumentException("Метод Бесселя требует минимум четыре узла.");
        }

        if (xColumn.size() % 2 != 0) {
            throw new IllegalArgumentException("Метод Бесселя строится по чётному количеству узлов.");
        }

        double diff = xColumn.get(1) - xColumn.getFirst();

        for (int i = 2; i < xColumn.size(); i++) {
            if (Math.abs((xColumn.get(i) - xColumn.get(i - 1)) - diff) > 1e-9) {
                throw new IllegalArgumentException("Метод Бесселя можно использовать только для конечных разностей.");
            }
        }

        super(xColumn, yColumn);
    }

    @Override
    public Solution value(double x) {
        int size = xColumn.size();
        int centerIndex = size / 2 - 1;

        double centerX = xColumn.get(centerIndex);
        double h = xColumn.get(1) - xColumn.getFirst();
        double t = (x - centerX) / h;

        return formula(t);
    }

    private Solution formula(double t) {
        int size = xColumn.size();
        int centerIndex = size / 2 - 1;

        List<List<Double>> differences = table();

        double result = (differences.get(centerIndex).getFirst() + differences.get(centerIndex + 1).getFirst()) / 2.0;

        double factorial = 1.0;

        for (int order = 1; order < size; order++) {
            factorial *= order;

            if (order % 2 == 1) {
                int shift = (order - 1) / 2;

                int row = centerIndex - shift;

                if (row < 0 || row >= size || order >= differences.get(row).size()) {
                    break;
                }

                double numerator = t - 0.5;

                for (int i = 0; i < shift; i++) {
                    numerator *= t + i;
                    numerator *= t - i - 1;
                }

                result += numerator / factorial * differences.get(row).get(order);
            } else {
                int shift = order / 2;

                int firstRow = centerIndex - shift;
                int secondRow = centerIndex - shift + 1;

                if (firstRow < 0 || secondRow < 0 || secondRow >= size || order >= differences.get(firstRow).size() || order >= differences.get(secondRow).size()) {
                    break;
                }

                double numerator = 1.0;

                for (int i = 0; i < shift; i++) {
                    numerator *= t + i;
                    numerator *= t - i - 1;
                }

                double difference = (differences.get(firstRow).get(order) + differences.get(secondRow).get(order)) / 2.0;

                result += numerator / factorial * difference;
            }
        }

        return new Solution(result, xColumn, yColumn, differences, formulaString());
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

    private String formulaString() {
        int size = xColumn.size();
        int centerIndex = size / 2 - 1;

        double centerX = xColumn.get(centerIndex);
        double h = xColumn.get(1) - xColumn.getFirst();

        String t = "((x - " + centerX + ") / " + h + ")";

        List<List<Double>> differences = table();

        StringBuilder result = new StringBuilder();
        result.append("((")
                .append(differences.get(centerIndex).getFirst())
                .append(" + ")
                .append(differences.get(centerIndex + 1).getFirst())
                .append(") / 2)");

        long factorial = 1L;

        for (int order = 1; order < size; order++) {
            factorial *= order;

            if (order % 2 == 1) {
                int shift = (order - 1) / 2;

                int row = centerIndex - shift;

                if (row < 0 || order >= differences.get(row).size()) {
                    break;
                }

                List<String> factors = new ArrayList<>();
                factors.add("(" + t + " - 0.5)");

                for (int i = 0; i < shift; i++) {
                    factors.add("(" + t + " + " + i + ")");
                    factors.add("(" + t + " - " + (i + 1) + ")");
                }

                result.append(" + (")
                        .append(String.join(" * ", factors))
                        .append(") / ")
                        .append(factorial)
                        .append(" * ")
                        .append(differences.get(row).get(order));
            } else {
                int shift = order / 2;

                int firstRow = centerIndex - shift;
                int secondRow = centerIndex - shift + 1;

                if (firstRow < 0 || secondRow < 0 || firstRow >= size || secondRow >= size
                        || order >= differences.get(firstRow).size()
                        || order >= differences.get(secondRow).size()) {
                    break;
                }

                List<String> factors = new ArrayList<>();

                for (int i = 0; i < shift; i++) {
                    factors.add("(" + t + " + " + i + ")");
                    factors.add("(" + t + " - " + (i + 1) + ")");
                }

                result.append(" + (")
                        .append(String.join(" * ", factors))
                        .append(") / ")
                        .append(factorial)
                        .append(" * ((")
                        .append(differences.get(firstRow).get(order))
                        .append(" + ")
                        .append(differences.get(secondRow).get(order))
                        .append(") / 2)");
            }
        }

        return result.toString();
    }
}