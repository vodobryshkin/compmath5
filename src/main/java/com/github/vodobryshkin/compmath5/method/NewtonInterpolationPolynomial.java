package com.github.vodobryshkin.compmath5.method;

import com.github.vodobryshkin.compmath5.dto.Solution;

import java.util.ArrayList;
import java.util.List;

public class NewtonInterpolationPolynomial extends InterpolationPolynomial {
    public NewtonInterpolationPolynomial(MathematicalFunction f, double a, double b, double n) {
        List<Double> xList = new ArrayList<>();
        List<Double> yList = new ArrayList<>();

        int segments = (int) n;

        for (int i = 0; i <= segments; i++) {
            double t = (double) i / segments;

            double x = a + (b - a) * t * t;

            xList.add(x);
            yList.add(f.value(x).getResult());
        }

        this(xList, yList);
    }

    public NewtonInterpolationPolynomial(List<Double> xColumn, List<Double> yColumn) {
        if (xColumn.size() > 2) {
            double diff = xColumn.get(1) - xColumn.getFirst();

            boolean flag = false;

            for (int i = 2; i < xColumn.size(); i++) {
                if (xColumn.get(i) - xColumn.get(i - 1) != diff) {
                    flag = true;
                    break;
                }
            }

            if (!flag) {
                throw new IllegalArgumentException("Для того, чтобы использовать метод Ньютона с разделенными разностями, разница между соседними элементами не должна быть постоянной.");
            }
        }
        super(xColumn, yColumn);
    }

    @Override
    public Solution value(double x) {
        double firstX = xColumn.getFirst();
        double lastX = xColumn.getLast();

        if (Math.abs(x - firstX) <= Math.abs(x - lastX)) {
            return firstFormula(x);
        }

        return secondFormula(x);
    }

    private Solution firstFormula(double x) {
        int size = xColumn.size();
        List<List<Double>> differences = table();

        double result = differences.getFirst().getFirst();
        double product = 1.0;

        for (int order = 1; order < size; order++) {
            product *= x - xColumn.get(order - 1);
            result += product * differences.getFirst().get(order);
        }

        return new Solution(result, xColumn, yColumn, differences, firstFormulaString());
    }

    private Solution secondFormula(double x) {
        int size = xColumn.size();
        List<List<Double>> differences = table();

        double result = differences.getLast().getFirst();
        double product = 1.0;

        for (int order = 1; order < size; order++) {
            product *= x - xColumn.get(size - order);
            result += product * differences.get(size - order - 1).get(order);
        }

        return new Solution(result, xColumn, yColumn, differences, secondFormulaString());
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
                double denominator = xColumn.get(i + order) - xColumn.get(i);

                table.get(i).add((next - current) / denominator);
            }
        }

        return table;
    }

    private String firstFormulaString() {
        int size = xColumn.size();
        List<List<Double>> differences = table();

        StringBuilder result = new StringBuilder();
        result.append(differences.getFirst().getFirst());

        List<String> factors = new ArrayList<>();

        for (int order = 1; order < size; order++) {
            factors.add("(x - " + xColumn.get(order - 1) + ")");

            result.append(" + (").append(String.join(" * ", factors)).append(") * ").append(differences.getFirst().get(order));
        }

        return result.toString();
    }

    private String secondFormulaString() {
        int size = xColumn.size();
        List<List<Double>> differences = table();

        StringBuilder result = new StringBuilder();
        result.append(differences.getLast().getFirst());

        List<String> factors = new ArrayList<>();

        for (int order = 1; order < size; order++) {
            factors.add("(x - " + xColumn.get(size - order) + ")");

            result.append(" + (").append(String.join(" * ", factors)).append(") * ").append(differences.get(size - order - 1).get(order));
        }

        return result.toString();
    }
}