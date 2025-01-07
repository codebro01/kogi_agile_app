import { EditUserForm } from "../../components/editUserForm"
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export const EditAdmin = () => {
     
    const { id } = useParams();

    return <EditUserForm formHeader={"Update Admin"} bvn={false} nin={false} phone={false} bankName={false} accountNumber={false} gender={false} lga={false} link={`admin-admin/update/${id}`} pwd= {false} passport = {false}/>   
}