import { useState } from "react";
import { calculateByFormula, calculateByTable } from "./api.js";
import {
    parseJsonTableData,
    parseTableData
} from "./math.js";
import {
    readRequiredNumber,
    validateFormulaInput
} from "./validation.js";

export function useInterpolationCalculator() {
    const [inputMode, setInputMode] = useState("formula");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [fileText, setFileText] = useState("");

    const [form, setForm] = useState({
        methodName: "lagrange",
        formulaNumber: 2,
        x: "",
        a: "",
        b: "",
        n: "",
        tableData: ""
    });

    const [solution, setSolution] = useState(null);
    const [usedInputMode, setUsedInputMode] = useState("formula");
    const [usedFormulaNumber, setUsedFormulaNumber] = useState(2);
    const [usedMethodName, setUsedMethodName] = useState("lagrange");
    const [usedArgument, setUsedArgument] = useState(null);

    const isLogFunction = inputMode === "formula" && Number(form.formulaNumber) === 5;

    function changeField(event) {
        const { name, value } = event.target;

        setForm(previous => ({
            ...previous,
            [name]: value
        }));
    }

    async function handleFile(event) {
        const file = event.target.files?.[0];

        setFileText("");

        if (!file) {
            return;
        }

        const text = await file.text();

        setFileText(text);

        try {
            const parsed = parseJsonTableData(text);

            setForm(previous => ({
                ...previous,
                x: String(parsed.x)
            }));
        } catch {
            // Ошибка будет показана после нажатия "Рассчитать".
        }
    }

    async function submit(event) {
        event.preventDefault();

        setLoading(true);
        setError("");
        setSolution(null);

        try {
            const { data, argument } = await calculate();

            setSolution(data);
            setUsedInputMode(inputMode);
            setUsedFormulaNumber(Number(form.formulaNumber));
            setUsedMethodName(form.methodName);
            setUsedArgument(argument);

            if (inputMode === "file") {
                setForm(previous => ({
                    ...previous,
                    x: String(argument)
                }));
            }
        } catch (exception) {
            setError(exception.message);
        } finally {
            setLoading(false);
        }
    }

    async function calculate() {
        if (inputMode === "formula") {
            return calculateFormulaMode();
        }

        if (inputMode === "table") {
            return calculateTableMode();
        }

        return calculateFileMode();
    }

    async function calculateFormulaMode() {
        const argument = readRequiredNumber(form.x, "x");
        const a = readRequiredNumber(form.a, "a");
        const b = readRequiredNumber(form.b, "b");
        const n = readRequiredNumber(form.n, "n");

        validateFormulaInput(Number(form.formulaNumber), argument, a, b, n);

        const data = await calculateByFormula({
            method_name: form.methodName,
            formula_number: Number(form.formulaNumber),
            x: argument,
            a: a,
            b: b,
            n: n
        });

        return {
            data,
            argument
        };
    }

    async function calculateTableMode() {
        const argument = readRequiredNumber(form.x, "x");
        const table = parseTableData(form.tableData);

        const data = await calculateByTable({
            method_name: form.methodName,
            x: argument,
            x_column: table.xColumn,
            y_column: table.yColumn
        });

        return {
            data,
            argument
        };
    }

    async function calculateFileMode() {
        const table = parseJsonTableData(fileText);
        const argument = table.x;

        const data = await calculateByTable({
            method_name: form.methodName,
            x: argument,
            x_column: table.xColumn,
            y_column: table.yColumn
        });

        return {
            data,
            argument
        };
    }

    return {
        inputMode,
        setInputMode,
        loading,
        error,
        form,
        solution,
        usedInputMode,
        usedFormulaNumber,
        usedMethodName,
        usedArgument,
        isLogFunction,
        changeField,
        handleFile,
        submit
    };
}