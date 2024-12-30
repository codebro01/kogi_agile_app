import { useState, useContext } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Team from "./scenes/team";
import Invoices from "./scenes/invoices";
import Contacts from "./scenes/contacts";
import Bar from "./scenes/bar";
import Form from "./scenes/form";
import Line from "./scenes/line";
import Pie from "./scenes/pie";
import FAQ from "./scenes/faq";
import Geography from "./scenes/geography";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Calendar from "./scenes/calendar/calendar";
import BrandingSignUpPage from "./scenes/auth/register";
import { SignInForm, EnumeratorSignInForm } from "./scenes/auth/signIn";
import CreateEnumerator from "./scenes/manage-accounts/createEnumeratorForm";
import RegistrationSelector from './scenes/manage-accounts/registrationSelector'
import {ViewAllStudentsData} from './scenes/manage-accounts/viewAllStudentsData'
import { CreateStudent } from "./scenes/manage-accounts/createStudent";
import { CreateAdmin } from "./scenes/manage-accounts/createAdmin";
import { SchoolsContext } from './components/dataContext.jsx';

function App() {
  const [theme, colorMode] = useMode();
  
  const [isSidebar, setIsSidebar] = useState(true);
  const location = useLocation();
  const {schoolsData} = useContext(SchoolsContext);

  const schools = schoolsData;
  return (
    <ColorModeContext.Provider value={colorMode}>

      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          {location.pathname !== "/dashboard/sign-in" && location.pathname !== "/sign-in" && <Sidebar isSidebar={isSidebar}  />}

          <main className={`content ${isSidebar ? "" : "collapsed"}`} >

            {location.pathname !== "/sign-in" && location.pathname !== "/dashboard/sign-in" && <Topbar setIsSidebar={setIsSidebar} />}

            <Routes>
              <Route path="/admin-dashboard" element={<Dashboard />} />
              <Route path="/enumerator-dashboard" element={<Dashboard />} />
              <Route path="/enumerator-dashboard/view-all-students-data" element={<ViewAllStudentsData />} />
              <Route path="/create-accounts" element={<RegistrationSelector schools={schools} />} />
              <Route path="/admin-dashboard/create-accounts/register-admin" element={< CreateAdmin />} />
              <Route path="/admin-dashboard/create-accounts/register-enumerator" element={<CreateEnumerator />} />
              <Route path="/admin-dashboard/create-accounts/register-student" element={<CreateStudent />} />
              <Route path="/register" element={<BrandingSignUpPage />} />
              <Route path="/dashboard/sign-in" element={<SignInForm />} />
              <Route path="/sign-in" element={<EnumeratorSignInForm />} />
              <Route path="/team" element={<Team />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/invoices" element={<Invoices />} />
              <Route path="/form" element={<Form />} />
              <Route path="/bar" element={<Bar />} />
              <Route path="/pie" element={<Pie />} />
              <Route path="/line" element={<Line />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/geography" element={<Geography />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
