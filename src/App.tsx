import { ToastContainer } from 'react-toastify';
import Router from './routes/Routes';
import 'react-toastify/dist/ReactToastify.css';
import { PublicRoutes } from './routes/PublicRoutes';

const App = () => {
  return (
    <>
    <ToastContainer
        closeOnClick
        hideProgressBar
        autoClose={2000}
        position="top-center"
      />
      <Router />
      <PublicRoutes />
    </>
  );
};

export default App;
