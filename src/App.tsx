import { ToastContainer } from 'react-toastify';
import Router from './routes/Routes';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <>
    <ToastContainer
        closeOnClick
        hideProgressBar
        autoClose={1500}
        position="top-center"
      />
      <Router />
    </>
  );
};

export default App;
