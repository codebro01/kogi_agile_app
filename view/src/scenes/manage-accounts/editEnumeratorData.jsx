import { EditUserForm } from "../../components/editUserForm"
import { useParams } from "react-router-dom"

export const EditEnumerator = () => {
    const {id}  = useParams();
    return (
        <EditUserForm formHeader={"Update Enumerator's Data"} email={false} link={`admin-enumerator/update/${id}`} getPrevDataLink={`admin-enumerator/get-single/${id}`}  />
    )
}