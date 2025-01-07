import { EditUserForm } from "../../components/editUserForm"
import { useParams } from "react-router-dom"

export const EditPayrollSpecialists = () => {
    const {id}  = useParams();
    return (
        <EditUserForm formHeader={"Update Payroll Specialist's Data"} email={false} link={`payroll-specialists/update/${id}`} getPrevDataLink={`get-single/${id}`}  />
    )
}