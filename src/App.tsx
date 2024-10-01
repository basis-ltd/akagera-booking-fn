import { ToastContainer } from 'react-toastify';
import Router from './routes/Routes';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <>
    <ToastContainer
        closeOnClick
        hideProgressBar
        autoClose={3000}
        position="top-right"
        closeButton
      />
      <Router />
    </>
  );
};

export default App;
