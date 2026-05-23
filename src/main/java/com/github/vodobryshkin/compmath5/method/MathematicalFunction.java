package com.github.vodobryshkin.compmath5.method;

import com.github.vodobryshkin.compmath5.dto.Solution;

/**
 * Интерфейс для описания функциональности нелинейных уравнений.
 */
public interface MathematicalFunction {
    /**
     * Метод для подстановки x в f(x)
     *
     * @param x параметр x
     * @return результат подстановки.
     */
    Solution value(double x);
}

