import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, Tooltip, Legend, CategoryScale, LinearScale } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

// Register Chart.js components and plugins
ChartJS.register(BarElement, Tooltip, Legend, CategoryScale, LinearScale, ChartDataLabels);

export const ResponsiveBarChart = () => {
    // Data for the Bar Chart
    const data = {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [
            {
                label: '# of Votes',
                data: [12, 19, 3, 5, 2, 3],
                backgroundColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    // Options for responsiveness
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                enabled: true,
            },
            datalabels: {
                anchor: 'end',
                align: 'end',
                formatter: (value, ctx) => {
                    const total = ctx.dataset.data.reduce((acc, val) => acc + val, 0);
                    const percentage = ((value / total) * 100).toFixed(1) + '%';
                    return percentage;
                },
                color: '#000',
                font: {
                    size: 12,
                    weight: 'bold',
                },
            },
        },
        scales: {
            x: {
                beginAtZero: true,
                grid: {
                    display: false,
                },
            },
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 5,
                },
                grid: {
                    color: 'rgba(200, 200, 200, 0.5)',
                },
            },
        },
    };

    return (
        <div style={{ width: '100%', height: '450px', padding: '20px', textAlign: 'center' }}> 

            <h3
                style={{
                    marginBottom: '20px',
                    color: '#2c3e50',
                    fontWeight: '600',
                    textTransform: 'capitalize',
                    letterSpacing: '1px',
                    textAlign: 'center',
                    fontSize: 'clamp(1rem, 2.5vw, 1.8rem)', // Better scaling for all screens
                }}
            >
                Enumerators by highest students Registered
            </h3>

            <Bar data={data} options={options} />
        </div>
    );
};
