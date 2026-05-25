import { useRef } from "react";
import {
    Chart as ChartJS,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
    Title
} from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";
import { Scatter } from "react-chartjs-2";
import { formatNumber } from "./math.js";

ChartJS.register(
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
    Title,
    zoomPlugin
);

export default function InterpolationChart({
                                               chartData,
                                               nodePoints,
                                               resultPoint,
                                               usedInputMode,
                                               xDomain,
                                               yDomain
                                           }) {
    const chartRef = useRef(null);

    const datasets = [];

    if (usedInputMode === "formula") {
        datasets.push({
            label: "Исходная функция",
            data: chartData
                .filter(point => Number.isFinite(point.sourceY))
                .map(point => ({
                    x: point.x,
                    y: point.sourceY
                })),
            showLine: true,
            borderColor: "#D55E00",
            backgroundColor: "#D55E00",
            borderWidth: 2,
            borderDash: [8, 5],
            pointRadius: 0,
            pointHoverRadius: 3
        });
    }

    datasets.push({
        label: "Интерполяционный многочлен",
        data: chartData
            .filter(point => Number.isFinite(point.polynomialY))
            .map(point => ({
                x: point.x,
                y: point.polynomialY
            })),
        showLine: true,
        borderColor: "#0072B2",
        backgroundColor: "#0072B2",
        borderWidth: 3,
        pointRadius: 0,
        pointHoverRadius: 3
    });

    datasets.push({
        label: "Узлы интерполяции",
        data: nodePoints,
        showLine: false,
        borderColor: "#111111",
        backgroundColor: "#111111",
        pointRadius: 4,
        pointHoverRadius: 6
    });

    datasets.push({
        label: "Точка расчёта",
        data: resultPoint,
        showLine: false,
        borderColor: "#009E73",
        backgroundColor: "#009E73",
        pointRadius: 6,
        pointHoverRadius: 8
    });

    const data = {
        datasets
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        normalized: true,
        parsing: false,
        interaction: {
            mode: "nearest",
            intersect: false
        },
        scales: {
            x: {
                type: "linear",
                min: xDomain[0],
                max: xDomain[1],
                title: {
                    display: true,
                    text: "x"
                },
                ticks: {
                    callback: value => formatNumber(value)
                }
            },
            y: {
                type: "linear",
                min: yDomain[0],
                max: yDomain[1],
                title: {
                    display: true,
                    text: "y"
                },
                ticks: {
                    callback: value => formatNumber(value)
                }
            }
        },
        plugins: {
            legend: {
                position: "bottom"
            },
            tooltip: {
                callbacks: {
                    label: context => {
                        const point = context.raw;

                        return `${context.dataset.label}: x = ${formatNumber(point.x)}, y = ${formatNumber(point.y)}`;
                    }
                }
            },
            zoom: {
                pan: {
                    enabled: true,
                    mode: "xy",
                    modifierKey: "shift"
                },
                zoom: {
                    wheel: {
                        enabled: true
                    },
                    pinch: {
                        enabled: true
                    },
                    drag: {
                        enabled: true
                    },
                    mode: "xy"
                }
            }
        }
    };

    function resetZoom() {
        chartRef.current?.resetZoom();
    }

    return (
        <>
            <div className="chart-toolbar">
                <button type="button" onClick={resetZoom}>
                    Сбросить масштаб
                </button>
            </div>

            <div className="chart-wrapper">
                <Scatter ref={chartRef} data={data} options={options} />
            </div>
        </>
    );
}