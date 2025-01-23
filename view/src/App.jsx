import { useEffect, useState } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import BrandingSignUpPage from "./scenes/auth/register";
import { SignInForm, EnumeratorSignInForm, PayrollSpecialistSignInForm, EnumeratorSignInFormWebView } from "./scenes/auth/signIn";
import CreateEnumerator from "./scenes/manage-accounts/createEnumeratorForm";
import RegistrationSelector from './scenes/manage-accounts/registrationSelector';
import { ViewAllStudentsData } from './scenes/manage-accounts/viewAllStudentsData';
import { CreateStudent } from "./scenes/manage-accounts/createStudent";
import { CreateAdmin } from "./scenes/manage-accounts/createAdmin";
import { UpdateStudent } from './scenes/manage-accounts/updateStudent';
import { DataProvider } from './components/dataContext.jsx';
import { RoleSelector } from "./components/roleSelector.jsx";
import { AdminViewAllStudentsData } from "./scenes/manage-accounts/adminViewAllStudentsData.jsx";
import { ExportAttendanceSheet } from "./scenes/manage-accounts/exportAttendanceSheet.jsx";
import { CreatePayrollSpecialist } from "./scenes/manage-accounts/createPayrollSpecialist.jsx";
import { ManageAdmins } from "./scenes/manage-accounts/manageAdmins.jsx";
import { EditUserForm } from "./components/editUserForm.jsx";
import { EditAdmin } from "./scenes/manage-accounts/editAdminData.jsx";
import { ManageEnumerators } from "./scenes/manage-accounts/manageEnumerators.jsx";
import { ManagePayrollSpecialists } from "./scenes/manage-accounts/managePayrollSpecialists.jsx";
import { EditEnumerator } from "./scenes/manage-accounts/editEnumeratorData.jsx";
import { EditPayrollSpecialists } from "./scenes/manage-accounts/editPayrollSpecialists.jsx";
import { ImportAttendanceSheet } from "./scenes/manage-accounts/importAttendanceSheet.jsx";
import { ViewAttendance } from "./components/viewAttendance .jsx";
import { ViewSchoolsInfo } from "./components/viewSchoolsInfo.jsx";
import { ExportAttendanceSheetPayroll } from "./scenes/manage-accounts/exportAttendanceSheetScore.jsx";
import { AdminViewAllStudentsDataNoExport } from "./scenes/manage-accounts/adminViewAllStudentsData_noExport.jsx";
import axios from 'axios';
import { ImportPaymentSheet } from "./scenes/manage-accounts/importPayment.jsx";
import { Provider } from 'react-redux';
import { store } from './components/store.js';
import { CreateSchool } from "./scenes/manage-accounts/createSchool.jsx";
import { ManageSchools } from "./scenes/manage-accounts/manageSchools.jsx";
import { ViewPaymentsRecords } from "./components/viewPaymentsRecords.jsx";






function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const location = useLocation();
  const subdomain = getSubdomain();
  const API_URL = `${import.meta.env.VITE_API_URL}/api/v1`;
  // const [allschools, setAllSchools] = useState([]);
  // const [primarySchoolsData, setPrimarySchoolsData] = useState([]);
  // const [secondarySchoolsData, setSecondarySchoolsData] = useState([]);
  // const [vocationalData, setVocationalData] = useState([]);



  // useEffect(() => {

  //   (async () => {
  //       try {
  //         const response = await axios.get(`${API_URL}/all-schools`)
  //         setAllSchools(response.data.allSchools);


  //       }
  //       catch(err) {
  //         console.log(err)
  //       }
  //   })()
  // }, []);



  // console.log(allschools);

  // console.log(window.location.hostname);

  if (subdomain === 'portal') {
    return (
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <div className="app">
            {location.pathname !== "/dashboard/sign-in" && location.pathname !== "/" && location.pathname !== "/sign-in" && <Sidebar isSidebar={isSidebar} />}

            <main className={`content ${isSidebar ? "" : "collapsed"}`}>
              {location.pathname !== "/sign-in" && location.pathname !== "/" && location.pathname !== "/dashboard/sign-in" && <Topbar setIsSidebar={setIsSidebar} />}

              <Routes>
                <Route path="/dashboard/sign-in" element={<SignInForm />} />
                <Route path="/" element={<SignInForm />} />

                <Route
                  path="/*"
                  element={
                    <Provider store={store}>
                      <Routes>
                        <Route path="/admin-dashboard" element={<Dashboard />} />
                        <Route path="/admin-dashboard/create-student-school-selector" element={<RegistrationSelector />} />
                        <Route path="/admin-dashboard/role-selector" element={<RoleSelector />} />
                        <Route path="/admin-dashboard/create-accounts/register-admin" element={<CreateAdmin />} />
                        <Route path="/admin-dashboard/view-all-students-data" element={<AdminViewAllStudentsData />} />
                        <Route path="/admin-dashboard/admin-view-all-students-no-export" element={<AdminViewAllStudentsDataNoExport />} />
                        <Route path="/view-all-schools-info" element={<ViewSchoolsInfo />} />
                        <Route path="/admin-dashboard/create-accounts/register-enumerator" element={<CreateEnumerator />} />
                        <Route path="/admin-dashboard/create-accounts/register-payroll-specialists" element={<CreatePayrollSpecialist />} />
                        <Route path="/admin-dashboard/create-accounts/register-school" element={<CreateSchool />} />
                        <Route path="/admin-dashboard/manage-accounts/admins" element={<ManageAdmins />} />
                        <Route path="/admin-dashboard/manage-accounts/enumerators" element={<ManageEnumerators />} />
                        <Route path="/admin-dashboard/manage-accounts/payroll-specialists" element={<ManagePayrollSpecialists />} />
                        <Route path="/admin-dashboard/manage-accounts/admins/edit-admin/:id" element={<EditAdmin />} />
                        <Route path="/admin-dashboard/manage-accounts/enumerators/edit-enumerator/:id" element={<EditEnumerator />} />
                        <Route path="/admin-dashboard/manage-accounts/payroll-specialists/edit-payroll-specialists/:id" element={<EditPayrollSpecialists />} />
                        <Route path="/admin-dashboard/manage-accounts/schools" element={<ManageSchools />} />

                        <Route path="/index.html" element={<Navigate to="/" />} />
                        <Route path="*" element={<Navigate to="/admin-dashboard" />} />

                      </Routes>
                    </Provider>
                  }
                />

              </Routes>
            </main>
          </div>
        </ThemeProvider>
      </ColorModeContext.Provider>
    )
  }

  if (subdomain === 'enrolment' || subdomain === 'enrollment') {
    return (
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <div className="app">
            {location.pathname !== "/dashboard/sign-in" && location.pathname !== "/" && location.pathname !== "/sign-in" && <Sidebar isSidebar={isSidebar} />}

            <main className={`content ${isSidebar ? "" : "collapsed"}`}>
              {location.pathname !== "/sign-in" && location.pathname !== "/" && location.pathname !== "/dashboard/sign-in" && <Topbar setIsSidebar={setIsSidebar} />}

              <Routes>
                <Route path="/sign-in" element={<EnumeratorSignInForm />} />
                <Route path="/" element={<EnumeratorSignInForm />} />
                <Route path="/webview" element={<EnumeratorSignInFormWebView />} />

                <Route
                  path="/*"
                  element={
                    <Provider store={store}>
                      <Routes>
                        <Route path="/enumerator-dashboard" element={<Dashboard />} />
                        <Route path="/enumerator-dashboard/webview" element={<Dashboard />} />
                        <Route path="/enumerator-dashboard/view-all-students-data" element={<ViewAllStudentsData />} />
                        <Route path="/export-attendance-sheet" element={<ExportAttendanceSheet />} />
                        <Route path="/import-attendance-sheet" element={<ImportAttendanceSheet />} />
                        <Route path="/enumerator-dashboard/create-student-school-selector" element={<RegistrationSelector />} />
                        <Route path="/enumerator-dashboard/create-accounts/register-student" element={<CreateStudent />} />
                        <Route path="/enumerator-dashboard/update-student/:id" element={<UpdateStudent />} />
                        <Route path="/view-attendance-sheet" element={<ViewAttendance />} />
                        <Route path="/index.html" element={<Navigate to="/" />} />
                        <Route path="*" element={<Navigate to="/enumerator-dashboard" />} />

                      </Routes>
                    </Provider>
                  }
                />
              </Routes>
            </main>
          </div>
        </ThemeProvider>
      </ColorModeContext.Provider>
    )
  }

  if (subdomain === 'cct') {
    return (
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <div className="app">
            {location.pathname !== "/dashboard/sign-in" && location.pathname !== "/" && location.pathname !== "/sign-in" && <Sidebar isSidebar={isSidebar} />}

            <main className={`content ${isSidebar ? "" : "collapsed"}`}>
              {location.pathname !== "/sign-in" && location.pathname !== "/" && location.pathname !== "/dashboard/sign-in" && <Topbar setIsSidebar={setIsSidebar} />}

              <Routes>
                <Route path="/sign-in" element={<PayrollSpecialistSignInForm />} />
                <Route path="/" element={<PayrollSpecialistSignInForm />} />

                <Route
                  path="/*"
                  element={
                    <Provider store={store}>
                      <Routes>
                        <Route path="/payroll-specialist-dashboard" element={<Dashboard />} />
                        <Route path="/export-attendance-sheet/" element={<ExportAttendanceSheetPayroll />} />
                        <Route path="/payroll-specialist-dashboard/view-students" element={<AdminViewAllStudentsDataNoExport />} />
                        <Route path="payroll-specialist-dashboard/upload-payment" element={<ImportPaymentSheet />} />
                        <Route path="/payroll-specialist-dashboard/view-payments-records" element={<ViewPaymentsRecords />} />
                        <Route path="/index.html" element={<Navigate to="/" />} />

                        <Route path="*" element={<Navigate to="/payroll-specialist-dashboard" />} />

                      </Routes>
                    </Provider>
                  }
                />
              </Routes>
            </main>
          </div>
        </ThemeProvider>
      </ColorModeContext.Provider>
    )
  }
}

export default App;



const getSubdomain = () => {
  const hostname = window.location.hostname; // e.g., 'www.subdomain.something.org'
  const parts = hostname.split('.');

  return parts.length >= 2
    ? parts[0].toLowerCase() === 'www'
      ? parts[1] // Subdomain after 'www'
      : parts[0] // Direct subdomain
    : 'default'; // No subdomain
}
