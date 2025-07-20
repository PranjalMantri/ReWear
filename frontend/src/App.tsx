import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import SignupPage from "./pages/SignupPage";
import SigninPage from "./pages/SigninPage";
import useUserStore from "./store/user.store";
import HomePage from "./pages/HomePage";
import Layout from "./pages/Layout";

function App() {
  const isUserLoggedIn = useUserStore((state) => state.isUserLoggedIn);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            isUserLoggedIn ? (
              <Layout>
                <HomePage />{" "}
              </Layout>
            ) : (
              <Landing />
            )
          }
        />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/signin" element={<SigninPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
