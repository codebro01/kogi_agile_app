import { useState } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import BrandingSignUpPage from "./scenes/auth/register";
import { SignInForm, EnumeratorSignInForm } from "./scenes/auth/signIn";
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
import DataTable from "./scenes/manage-accounts/manageAdmins.jsx";
import { EditUserForm } from "./components/editUserForm.jsx";
import { EditAdmin } from "./scenes/manage-accounts/editAdminData.jsx";
import { ManageEnumerators } from "./scenes/manage-accounts/manageEnumerators.jsx";
import { EditEnumerator } from "./scenes/manage-accounts/editEnumeratorData.jsx";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const location = useLocation();

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
              <Route path="/sign-in" element={<EnumeratorSignInForm />} />
              <Route path="/" element={<EnumeratorSignInForm />} />

              <Route
                path="/*"
                element={
                  <DataProvider>
                    <Routes>

                      <Route path="/admin-dashboard" element={<Dashboard />} />
                      <Route path="/enumerator-dashboard" element={<Dashboard />} />
                      <Route path="/enumerator-dashboard/view-all-students-data" element={<ViewAllStudentsData />} />
                      <Route path="/admin-dashboard/view-all-students-data" element={<AdminViewAllStudentsData />} />
                      <Route path="/admin-dashboard/create-student-school-selector" element={<RegistrationSelector />} />
                      <Route path="/admin-dashboard/role-selector" element={<RoleSelector />} />
                      <Route path="/admin-dashboard/create-accounts/register-admin" element={<CreateAdmin />} />
                      <Route path="/admin-dashboard/create-accounts/register-enumerator" element={<CreateEnumerator />} />
                      <Route path="/admin-dashboard/create-accounts/register-payroll-specialists" element={<CreatePayrollSpecialist />} />
                      <Route path="/admin-dashboard/create-accounts/register-student" element={<CreateStudent />} />
                      <Route path="/admin-dashboard/update-student/:id" element={<UpdateStudent />} />
                      <Route path="/export-attendance-sheet" element={<ExportAttendanceSheet />} />
                      {/* Data tables n  */}
                      <Route path="/admin-dashboard/manage-accounts/admins" element={<DataTable />} />
                      <Route path="/admin-dashboard/manage-accounts/enumerators" element={<ManageEnumerators />} />


                      {/* Edit form */}
                      <Route path="/admin-dashboard/manage-accounts/admins/edit-admin/:id" element={<EditAdmin />} />
                      <Route path="/admin-dashboard/manage-accounts/enumerators/edit-enumerator/:id" element={<EditEnumerator />} />


                      <Route path="/register" element={<BrandingSignUpPage />} />
                      <Route path="/index.html" element={<Navigate to="/admin-dashboard/create-accounts/register-student" />} />
                    </Routes>
                  </DataProvider>
                }
              />

            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
