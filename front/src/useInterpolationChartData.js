import { useMemo } from "react";
import {
    buildFormulaFunction,
    functionValue,
    paddedDomain
} from "./math.js";
import { formulaToKatex } from "./formulaToKatex.js";

export function useInterpolationChartData({
                                              solution,
                                              usedInputMode,
                                              usedFormulaNumber,
                                              usedArgument
                                          }) {
    const xColumn = solution?.x_column ?? [];
    const yColumn = solution?.y_column ?? [];

    const polynomialFunction = useMemo(() => {
        return buildFormulaFunction(solution?.formula);
    }, [solution?.formula]);

    const katexFormula = useMemo(() => {
        return formulaToKatex(solution?.formula);
    }, [solution?.formula]);

    const xDomain = useMemo(() => {
        if (xColumn.length === 0 || usedArgument === null) {
            return [0, 1];
        }

        const minNodeX = Math.min(...xColumn);
        const maxNodeX = Math.max(...xColumn);

        return [
            Math.min(minNodeX, usedArgument),
            Math.max(maxNodeX, usedArgument)
        ];
    }, [xColumn, usedArgument]);

    const chartData = useMemo(() => {
        if (!solution || !polynomialFunction) {
            return [];
        }

        const result = [];
        const count = 1000;
        const minX = xDomain[0];
        const maxX = xDomain[1];

        for (let i = 0; i <= count; i++) {
            const x = minX + (maxX - minX) * i / count;
            const polynomialY = polynomialFunction(x);
            const sourceY = usedInputMode === "formula" ? functionValue(usedFormulaNumber, x) : null;

            result.push({
                x: x,
                polynomialY: Number.isFinite(polynomialY) ? polynomialY : null,
                sourceY: Number.isFinite(sourceY) ? sourceY : null
            });
        }

        return result;
    }, [
        solution,
        polynomialFunction,
        xDomain,
        usedInputMode,
        usedFormulaNumber
    ]);

    const nodePoints = useMemo(() => {
        return xColumn.map((x, index) => ({
            x: x,
            y: yColumn[index]
        }));
    }, [xColumn, yColumn]);

    const resultPoint = useMemo(() => {
        if (!solution || usedArgument === null) {
            return [];
        }

        return [
            {
                x: usedArgument,
                y: solution.result
            }
        ];
    }, [solution, usedArgument]);

    const yDomain = useMemo(() => {
        const values = [
            ...chartData.map(point => point.polynomialY),
            ...chartData.map(point => point.sourceY),
            ...nodePoints.map(point => point.y),
            ...resultPoint.map(point => point.y)
        ];

        return paddedDomain(values);
    }, [chartData, nodePoints, resultPoint]);

    return {
        polynomialFunction,
        katexFormula,
        xDomain,
        chartData,
        nodePoints,
        resultPoint,
        yDomain
    };
}