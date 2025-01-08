import axios from "axios";
import { useState, useCallback, useEffect } from "react";
import { DataTable } from "../../components/dataTableComponent";
import { useLocation, useNavigate } from "react-router-dom";

export const ManagePayrollSpecialists = () => {
    const [data, setData] = useState([]);
    const [fetchDataLoading, setDataFetchLoading] = useState(false);
    const [showModal, setShowModal] = useState(false); // Control modal visibility
    const [message, setMessage] = useState('');
    const API_URL = `${import.meta.env.VITE_API_URL}/api/v1`;
    const token = localStorage.getItem('token');
    const location = useLocation();
    const navigate = useNavigate();

    const handleResetPassword = async (id) => {
        try {

            console.log(id)
            const response = await axios.patch(
                `${API_URL}/payroll-specialists/reset-password`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    params: { id },
                    withCredentials: true,
                }
            );
            setMessage('Password reset successful!');
            setShowModal(true);
        } catch (error) {
            setMessage(error.response?.data?.message);
            setShowModal(true);
            console.error('Error resetting password:', error.response?.data || error.message);
        }
    }

    const handleToggle = useCallback(async (id, currentStatus) => {
        try {
            const response = await axios.patch(
                `${API_URL}/payroll-specialists/toggle-status`,
                {}, // Body is empty for this request
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    params: { id }, // Query parameter with id
                    withCredentials: true,
                }
            );

            // Update the status in the parent state
            setData((prevData) =>
                prevData.map((item) =>
                    item._id === id ? { ...item, isActive: !currentStatus } : item
                )
            );

            setMessage(response.data?.message);
            setShowModal(true);
        } catch (err) {
            setMessage(err.response?.data?.message);
            setShowModal(true);
            console.log(err);
        }
    }, []);  // No data in the dependency array


    // const handleDelete = useCallback((id) => {
    //     setData((prevData) => prevData.filter((row) => row.id !== id));
    // }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setDataFetchLoading(true);
                const response = await axios.get(`${API_URL}/payroll-specialists`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true,
                });
                setData(response.data.payrollSpecialists);
                setDataFetchLoading(false);
            } catch (err) {
                console.log(err);
                setDataFetchLoading(false);
            }
        };
        fetchData();
    }, [handleToggle]);

    return (
        <>
            <DataTable
                url={'admin-enumerator'}
                data={data}
                fetchDataLoading={fetchDataLoading}
                handleToggle={handleToggle}
                editNav={'edit-payroll-specialists'}
                handleResetPassword={handleResetPassword}
                registerLink={'/admin-dashboard/create-accounts/register-payroll-specialists'}
                tableHeader = {'MANAGE PAYROLL SPECIALISTS'}
            />
            {showModal && (
                <div style={overlayStyle}>
                    <div style={modalContentStyle}>
                        <h3>{message}</h3>
                        <button style={closeButtonStyle} onClick={() => setShowModal(false)}>Close</button>
                    </div>
                </div>
            )}
        </>
    );
}

const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    transition: 'all 0.3s ease',
};

const modalContentStyle = {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    width: '400px',
    maxWidth: '90%',
    animation: 'fadeIn 0.5s',
};

const closeButtonStyle = {
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    marginTop: '20px',
    transition: 'background-color 0.3s',
};
