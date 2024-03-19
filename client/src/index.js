import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import './index.css';
import {Provider} from 'react-redux';
import App from './App';
import HomePage from './pages/HomePage';
import UserCodePage from './pages/UserCodePage';
import UserCodeDetailPage from './pages/UserCodeDetailPage';
import store from './store';
import reportWebVitals from './reportWebVitals';

const router = createBrowserRouter(
      createRoutesFromElements(
        <Route path='/' element={<App />}>
          <Route index={true} path='/' element={<HomePage />} />
          <Route path='/usercode' element={<UserCodePage />} />
          <Route path='/usercode/:id' element={<UserCodeDetailPage />} />
        </Route>
      )
)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
    <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);


reportWebVitals();
