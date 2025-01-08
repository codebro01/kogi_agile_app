import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, Tooltip, Legend, CategoryScale, LinearScale } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import axios from 'axios';
import { SpinnerLoader } from './spinnerLoader';
// Register Chart.js components and plugins
ChartJS.register(BarElement, Tooltip, Legend, CategoryScale, LinearScale, ChartDataLabels);

export const ResponsiveBarChart = () => {
    // Data for the Bar Chart
    const [apiDataLoading, setApiDataLoading] = useState(false)
    const [apiData, setApiData] = useState([]);
    const API_URL = `${import.meta.env.VITE_API_URL}/api/v1`;
    const token = localStorage.getItem('token');
    useEffect(() => {
        (async () => {

            try {
                setApiDataLoading(true)
                const response = await axios.get(`${API_URL}/student/enumerators-student-count`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true,
                })

                console.log(response);
                setApiDataLoading(false)
                setApiData(response.data)
            }
            catch (err) {
                console.log(err)
                setApiDataLoading(false)
            }
        })()
    }, []);

    console.log(apiData)

    const data = {
        labels: apiData.map(oneApiData => oneApiData.enumeratorName.split(' ')[0]), // Label each slice by the enumerator's name
        datasets: [
            {
                label: '# of Votes', // Title for the dataset
                data: apiData.map(oneApiData => oneApiData.totalStudents), // Get total students for each enumerator
                backgroundColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                ], // Different colors for each slice
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                ], // Border colors for each slice
                borderWidth: 1, // Border width for slices
            },
        ],
    };

    // Options for responsiveness
    const options = {
        responsive: true, // Makes the chart responsive
        maintainAspectRatio: false, // Maintains aspect ratio
        plugins: {
            legend: {
                position: 'top', // Position of the legend
            },
            tooltip: {
                enabled: true, // Enables tooltips when hovering over a slice
            },
            datalabels: {
                anchor: 'end',
                align: 'end',
                formatter: (value, ctx) => {
                    return value; // Show individual value (students count) for each slice
                },
                color: '#000', // Color for data labels
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


    if (apiDataLoading) return (<SpinnerLoader/>)


    return (
        <div style={{ width: '100%', height: '450px', padding: '20px', textAlign: 'center' }}>

            <h3
                style={{
                    marginBottom: '20px',
                    color: '#2c3e50',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    textAlign: 'center',
                    fontSize: 'clamp(0.8rem, 1.9vw, 1.5rem)', // Better scaling for all screens
                }}
            >
                Enumerators by highest students Registered
            </h3>

            <Bar data={data} options={options} />
        </div>
    );
};
