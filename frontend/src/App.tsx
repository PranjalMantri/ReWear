import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import SignupPage from "./pages/SignupPage";
import SigninPage from "./pages/SigninPage";
import useUserStore from "./store/user.store";
import HomePage from "./pages/HomePage";
import Layout from "./pages/Layout";
import { useEffect } from "react";
import ProductDetailPage from "./pages/ProductDetailPage";
import ProfilePage from "./pages/ProfilePage";

function App() {
  const isUserLoggedIn = useUserStore((state) => state.isUserLoggedIn);
  const isAuthChecked = useUserStore((state) => state.isAuthChecked);
  useEffect(() => {
    useUserStore.getState().checkAuth();
  }, []);

  if (!isAuthChecked) {
    return <div></div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        {isUserLoggedIn ? (
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/items/:itemId" element={<ProductDetailPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        ) : (
          <>
            <Route path="/" element={<Landing />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/signin" element={<SigninPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
