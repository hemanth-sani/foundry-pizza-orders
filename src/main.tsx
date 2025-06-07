import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthCallback from "./AuthCallback";
import Home from "./Home";
import PizzaMenu from "./pages/PizzaMenu";
import OrdersPage from "./pages/OrdersPage";
import "./index.css";
import CartPage from "./pages/CartPage";
import { CartProvider } from "./model/CartProvider";
import InventoryDashboard from "./pages/InventoryDashboard";



const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/menu",
      element: <PizzaMenu />,
    },
    {
      path: "/orders",
      element: <OrdersPage />,
    },
    { path: "/cart",
      element: <CartPage /> 
    },
    { path: "/inventory",
      element: <InventoryDashboard /> 
    },
    {
      path: "/auth/callback",
      element: <AuthCallback />,
    },
  ],
  { basename: import.meta.env.BASE_URL }
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <CartProvider> 
  <RouterProvider router={router} />
</CartProvider>
);
