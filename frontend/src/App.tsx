import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import SignupPage from "./pages/SignupPage";
import SigninPage from "./pages/SigninPage";
import useUserStore from "./store/user.store";
import HomePage from "./pages/HomePage";
import Layout from "./pages/Layout";
import { useEffect } from "react";
import RedirectIfLoggedIn from "./components/RedirectIfLoggedIn";
import ProductDetailPage from "./pages/ProductDetailPage";

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
        <Route path="/" element={isUserLoggedIn ? <Layout /> : <Landing />}>
          {isUserLoggedIn && <Route index element={<HomePage />} />}
        </Route>
        <Route
          path="/signup"
          element={
            <RedirectIfLoggedIn>
              <SignupPage />
            </RedirectIfLoggedIn>
          }
        />
        <Route
          path="/signin"
          element={
            <RedirectIfLoggedIn>
              <SigninPage />
            </RedirectIfLoggedIn>
          }
        />
        <Route element={<Layout />}>
          <Route path="/items/:itemId" element={<ProductDetailPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
