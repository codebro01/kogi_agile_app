import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import axios from 'axios';
import { SpinnerLoader } from './spinnerLoader';
// Register Chart.js components and plugins
ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

export const ResponsivePieChart = () => {
    const [apiDataLoading, setApiDataLoading] = useState(false)
    const [apiData, setApiData] = useState([]);
    const API_URL = `${import.meta.env.VITE_API_URL}/api/v1`;
    const token = localStorage.getItem('token');
    useEffect(() => {
        (async () => {

            try {
                setApiDataLoading(true)

                const response = await axios.get(`${API_URL}/student/top-lga-count`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true,
                })
                setApiDataLoading(false)

                setApiData(response.data.lgaCounts)
            }
            catch (err) {
                console.log(err)
            }
        })()
    }, []);
    // Data for the Pie Chart
    const data = {
        labels: apiData.map(oneApiData => oneApiData._id),
        datasets: [
            {
                label: '# of Votes',
                data: apiData.map(oneApiData => oneApiData.totalStudents),
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
                formatter: (value, ctx) => {
                    const total = ctx.dataset.data.reduce((acc, val) => acc + val, 0);
                    const percentage = ((value / total) * 100).toFixed(1) + '%';
                    return percentage;
                },
                color: '#fff',
                font: {
                    weight: 'bold',
                },
            },
        },
    };

    if (apiDataLoading) return (<SpinnerLoader />)


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
                Top 5 LGA of Enrollment
            </h3>

            <Pie data={data} options={options} />
        </div>
    );
};
