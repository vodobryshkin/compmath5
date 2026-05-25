const API_PREFIX = "/api/v1/interpolation";

export async function calculateByFormula(payload) {
    return postJson(`${API_PREFIX}/formula`, payload);
}

export async function calculateByTable(payload) {
    return postJson(`${API_PREFIX}/table`, payload);
}

async function postJson(url, payload) {
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok || data.calculation_error) {
        throw new Error(extractErrorMessage(data));
    }

    return data;
}

function extractErrorMessage(data) {
    if (data.calculation_error) {
        return data.calculation_error;
    }

    if (data.errors) {
        return Object.entries(data.errors)
            .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
            .join("\n");
    }

    return "Ошибка запроса.";
}