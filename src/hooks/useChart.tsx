import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import type { Chart as ChartType, ChartData, ChartOptions, ChartType as ChartJSType } from 'chart.js';

interface ChartHookProps {
    canvasRef: React.RefObject<HTMLCanvasElement>;
    type: ChartJSType;
    data: ChartData;
    options?: ChartOptions;
}

export function useChart({ canvasRef, type, data, options }: ChartHookProps) {
    const chartInstance = useRef<ChartType | null>(null); // Referencia para la instancia del gráfico

    useEffect(() => {
        console.log("useEffect en useChart disparado");
        console.log("canvasRef:", canvasRef);
        console.log("type:", type);
        console.log("data:", data);
        console.log("options:", options);
        console.log("--------------------");
        if (canvasRef.current) {
            if (chartInstance.current) {
                chartInstance.current.destroy(); // Destruye la instancia anterior
            }

            const ctx = canvasRef.current.getContext('2d');

            if (ctx) {
                chartInstance.current = new Chart(ctx, {
                    type: type,
                    data: data,
                    options: options,
                });
            }
        }

        // Función de limpieza: destruye el gráfico cuando el componente se desmonta
        return () => {
            console.log("Función de limpieza de useChart disparada");
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
            console.log("--------------------");
        };

    }, [canvasRef, type, data, options]); // Dependencias del efecto: re-crear gráfico si cambian

    // Opcional: podrías devolver la instancia del gráfico si necesitas interactuar con ella externamente
    // return chartInstance.current;
}
