import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
//
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';

import ManufacturerInfo from './erp/ManufacturerInfo';
import CommodityManage from './erp/CommodityManage';
import OrdersManage from './erp/OrdersManage';
import SalesAmountManage from './erp/SalesAmountManage';
import ReclaimLogsManage from './erp/ReclaimLogsManage';
// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      path: '/',
      element: <Navigate to="/login" replace />,
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      path: '/manufacturer',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/info" />, index: true },
        { path: 'info', element: <ManufacturerInfo /> },
        { path: 'commodity', element: <CommodityManage /> },
        { path: 'orders', element: <OrdersManage /> },
        { path: 'salesamount', element: <SalesAmountManage /> },
        { path: 'reclaim', element: <ReclaimLogsManage /> },
      ],
    },
    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="login" />, index: true },
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
