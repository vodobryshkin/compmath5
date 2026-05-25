package com.github.vodobryshkin.compmath5.controller;

import com.github.vodobryshkin.compmath5.dto.FormulaDto;
import com.github.vodobryshkin.compmath5.dto.Solution;
import com.github.vodobryshkin.compmath5.dto.TableDto;
import com.github.vodobryshkin.compmath5.service.InterpolationCalculationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.lang.reflect.InvocationTargetException;

@RestController
@RequiredArgsConstructor
@RequestMapping("/interpolation")
public class InterpolationController {
    private final InterpolationCalculationService calculationService;

    @PostMapping("/formula")
    public ResponseEntity<Solution> handlePost(@Valid @RequestBody FormulaDto formulaDto) throws InvocationTargetException, NoSuchMethodException, InstantiationException, IllegalAccessException {
        return ResponseEntity
                .ok()
                .body(calculationService.solution(formulaDto));
    }

    @PostMapping("/table")
    public ResponseEntity<Solution> handlePost(@Valid @RequestBody TableDto tableDto) throws InvocationTargetException, NoSuchMethodException, InstantiationException, IllegalAccessException {
        return ResponseEntity
                .ok()
                .body(calculationService.solution(tableDto));
    }
}