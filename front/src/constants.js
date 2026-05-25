export const METHOD_NAMES = {
    lagrange: "Многочлен Лагранжа",
    newton: "Многочлен Ньютона с разделенными разностями",
    gaussian: "Многочлен Гаусса",
    stirling: "Многочлен Стирлинга",
    bessel: "Многочлен Бесселя"
};

export const METHOD_OPTIONS = [
    {
        value: "lagrange",
        label: "Многочлен Лагранжа"
    },
    {
        value: "newton",
        label: "Многочлен Ньютона с разделенными разностями"
    },
    {
        value: "gaussian",
        label: "Многочлен Гаусса"
    },
    {
        value: "stirling",
        label: "Многочлен Стирлинга"
    },
    {
        value: "bessel",
        label: "Многочлен Бесселя"
    }
];

export const FUNCTION_NAMES = {
    1: "4x + 5",
    2: "sin(x)",
    3: "10 * exp(5x)",
    4: "5x² - 10x + 22",
    5: "3ln(x) + 17.5"
};

export const FUNCTION_OPTIONS = [
    {
        value: 1,
        label: "4x + 5"
    },
    {
        value: 2,
        label: "sin(x)"
    },
    {
        value: 3,
        label: "10 * exp(5x)"
    },
    {
        value: 4,
        label: "5x² - 10x + 22"
    },
    {
        value: 5,
        label: "3ln(x) + 17.5"
    }
];