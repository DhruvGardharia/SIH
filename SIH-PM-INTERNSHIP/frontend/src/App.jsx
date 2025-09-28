import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Onboarding from "./pages/Onboarding"; // Import onboarding
import OnboardingForm from "./pages/OnboardingForm"; // Import new onboarding form
import { UserData } from "./context/UserContext";
import { Loading } from "./components/Loading";
import Forgot from "./pages/Forgot";
import Reset from "./pages/Reset";
import OtpVerify from "./pages/OtpVerify";
import InternshipDashboard from "./pages/InternshipDashboard";

const App = () => {
  const { loading, isAuth, user } = UserData();
  console.log(isAuth);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <BrowserRouter>
          <Routes>
            {/* Home route */}
            <Route path="/" element={isAuth ? <Home /> : <Login />} />

            {/* Login and Register routes */}
            <Route path="/login" element={isAuth ? <Home /> : <Login />} />
            <Route path="/register" element={<Register />} />

                         
            {/* Onboarding route 
            <Route path="/onboarding" element={isAuth ? <Onboarding /> : <Login />} />
             */}

             {/* Onboarding route (old multi-step) */}
            <Route path="/onboarding" element={<Onboarding />} />

            {/* New onboarding form route */}
            <Route path="/onboardingForm" element={isAuth ? <OnboardingForm /> : <Login />} />
             

            {/* OTP Verification */}
            <Route
              path="/verify/:token"
              element={isAuth ? <Home /> : <OtpVerify />}
            />

            {/* Forgot Password */}
            <Route path="/forgot" element={!isAuth ? <Forgot /> : <Home />} />

            {/* Reset Password */}
            <Route path="/reset-password/:token" element={<Reset />} />
            <Route path="/in" element={<InternshipDashboard />} />

            {/* You can add protected dashboard later */}
            {/* <Route path="/dashboard" element={isAuth ? <Dashboard /> : <Login />} /> */}
          </Routes>
        </BrowserRouter>
      )}
    </>
  );
};

export default App;
