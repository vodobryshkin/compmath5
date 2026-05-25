package com.github.vodobryshkin.compmath5.service;

import com.github.vodobryshkin.compmath5.dto.FormulaDto;
import com.github.vodobryshkin.compmath5.dto.Solution;
import com.github.vodobryshkin.compmath5.dto.TableDto;
import com.github.vodobryshkin.compmath5.method.InterpolationPolynomial;
import com.github.vodobryshkin.compmath5.method.MathematicalFunction;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.lang.reflect.InvocationTargetException;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class InterpolationCalculationService {
    private final Map<Integer, MathematicalFunction> functions;
    private final Map<String, Class<? extends InterpolationPolynomial>> methods;

    public Solution solution(FormulaDto formulaDto) throws NoSuchMethodException, InvocationTargetException, InstantiationException, IllegalAccessException {
        MathematicalFunction function = functions.get(formulaDto.getFormulaNumber());
        double x = formulaDto.getX();
        double a = formulaDto.getA();
        double b = formulaDto.getB();
        int n = formulaDto.getN();
        Class<? extends InterpolationPolynomial> methodClass =
                methods.get(formulaDto.getMethodName());

        InterpolationPolynomial polynomial = methodClass
                .getConstructor(MathematicalFunction.class, double.class, double.class, double.class)
                .newInstance(function, a, b, (double) n);

        return polynomial.value(x);
    }

    public Solution solution(TableDto tableDto) throws NoSuchMethodException, InvocationTargetException, InstantiationException, IllegalAccessException {
        double x = tableDto.getX();
        List<Double> xColumn = tableDto.getXColumn();
        List<Double> yColumn = tableDto.getYColumn();
        Class<? extends InterpolationPolynomial> methodClass =
                methods.get(tableDto.getMethodName());

        InterpolationPolynomial polynomial = methodClass
                .getConstructor(List.class, List.class)
                .newInstance(xColumn, yColumn);

        return polynomial.value(x);
    }
}
