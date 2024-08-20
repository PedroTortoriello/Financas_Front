import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import ECommerce from './pages/Dashboard/ECommerce';
import ComparisonPage from './pages/Principal/page';
import InvestmentManagementPage from './pages/Investments/page';
import AddCreditCard from './pages/CreditCard/page';

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <>
      <Routes>
        <Route
          index
          element={
            <>
              <PageTitle title="Binance X" />
              <SignIn />
            </>
          }
        />
        <Route 
          path="/Dashboard/ECommerce"
          element={
            <>
              <PageTitle title="Binance X" />
              <ECommerce />
            </>
          }
        />

        <Route
          path="/Principal/page"
          element={
            <>
              <PageTitle title="Binance X" />
              <ComparisonPage />
            </>
          }
        />

        <Route
          path="/Investments/page"
          element={
            <>
              <PageTitle title="Binance X" />
              <InvestmentManagementPage />
            </>
          }
        />


        <Route
          path="/CreditCard/page"
          element={
            <>
              <PageTitle title="Binance X" />
              <AddCreditCard />
            </>
          }
        />

        <Route
          path="/auth/signin"
          element={
            <>
              <PageTitle title="Binance X" />
              <SignIn />
            </>
          }
        />
        <Route
          path="/auth/signup"
          element={
            <>
              <PageTitle title="Binance X" />
              <SignUp />
            </>
          }
        />
      </Routes>
    </>
  );
}

export default App;
