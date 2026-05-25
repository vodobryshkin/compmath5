package com.github.vodobryshkin.compmath5.config;

import com.github.vodobryshkin.compmath5.dto.Solution;
import com.github.vodobryshkin.compmath5.method.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Map;

@Configuration
public class MathConfig {
    @Bean
    public Map<Integer, MathematicalFunction> functions() {
        return Map.of(
                1, x -> new Solution(4*x + 5, null, null, null, "4x + 5"),
                2, x -> new Solution(Math.sin(x), null, null, null, "sin(x)"),
                3, x -> new Solution(10 * Math.exp(5 * x), null, null, null, "10 * exp(5x)"),
                4, x -> new Solution(5 * x * x - 10 * x + 22, null, null, null, "5*x^2 - 10x + 22"),
                5, x -> new Solution(3 * Math.log(x) + 17.5, null, null, null, "3*ln(x) + 17.5")
        );
    }

    @Bean
    public Map<String, Class<? extends InterpolationPolynomial>> methodsClasses() {
        return Map.of(
                "lagrange", LagrangeInterpolationPolynomial.class,
                "gaussian", GaussianInterpolationPolynomial.class,
                "newton", NewtonInterpolationPolynomial.class
        );
    }
}
