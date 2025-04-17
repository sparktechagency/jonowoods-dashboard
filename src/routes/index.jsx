import { createBrowserRouter } from "react-router-dom";
import Auth from "../Layout/Auth/Auth";
import Main from "../Layout/Main/Main";
import Home from "../Pages/Dashboard/Home";
import Users from "../Pages/Dashboard/Subsciber";
import Admin from "../Pages/Dashboard/Admin";
import Category from "../Pages/Dashboard/PushNotification";
import Events from "../Pages/Dashboard/UpdatePassword";
import Banner from "../Pages/Dashboard/Banner";
import AboutUs from "../Pages/Dashboard/AboutUs";
import PrivacyPolicy from "../Pages/Dashboard/PrivacyPolicy";
import TermsAndConditions from "../Pages/Dashboard/TermsAndCondition";
import ChangePassword from "../Pages/Auth/ChangePassword";
import Login from "../Pages/Auth/Login";
import ForgotPassword from "../Pages/Auth/ForgotPassword";
import VerifyOtp from "../Pages/Auth/VerifyOtp";
import ResetPassword from "../Pages/Auth/ResetPassword";
import NotFound from "../NotFound";
import Notifications from "../Pages/Dashboard/Notifications";
import SubCategory from "../Pages/Dashboard/SubCategory";
import AdminProfile from "../Pages/Dashboard/AdminProfile/AdminProfile";
import Retailer from "../Pages/Dashboard/Retailer";
import ViewSalesReps from "../components/SalesRepsManagement/detailsSalesReps/SubCategoryTable";
import Products from "../Pages/Dashboard/Products";
import LoyaltyProgram from "../Pages/Dashboard/LoyaltyProgram";
import SubscriptionTable from "../components/subscriber/SubscriberTable";
import OrderManagementContainer from "../components/orderMangement/OrderManagementContainer";
import VideoManagementSystem from "../components/retailerManagement/RetailerManageTable";
import CategoryManagement from "../components/SalesRepsManagement/SalesRepsManagement";
import SubscriptionManagement from "../components/loyaltyProgram/LoyalityProgramTable";
// import SalesRepsManagementTable from "../components/SalesRepsManagement/SalesRepsManagement";

const router = createBrowserRouter([
  {
    path: "/",
    // element: <ProtectedRoute><Main /></ProtectedRoute> ,
    element: <Main />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/orderManagement",
        element: <OrderManagementContainer />,
      },
      {
        path: "/salesManagement",
        element: <VideoManagementSystem />,
      },
      {
        path: "/retailer",
        element: <Retailer />,
      },
      {
        path: "/salesRepsManage",
        element: <CategoryManagement />,
      },
      {
        path: "/inventory",
        element: <Products />,
      },
      {
        path: "/salesRepsManage/:id",
        element: <ViewSalesReps />,
      },
      {
        path: "/loyaltyProgram",
        element: <SubscriptionManagement />,
      },
      {
        path: "/subsciption",
        element: <SubscriptionTable />,
      },
      {
        path: "/category",
        element: <Category />,
      },
      {
        path: "/events",
        element: <Events />,
      },
      {
        path: "/banner",
        element: <Banner />,
      },
      {
        path: "/about-us",
        element: <AboutUs />,
      },
      {
        path: "/privacy-policy",
        element: <PrivacyPolicy />,
      },
      {
        path: "/terms-and-conditions",
        element: <TermsAndConditions />,
      },
      {
        path: "/change-password",
        element: <ChangePassword />,
      },
      {
        path: "/sub-category",
        element: <SubCategory />,
      },
      {
        path: "/profile",
        element: <AdminProfile />,
      },
      {
        path: "/notification",
        element: <Notifications />,
      },
    ],
  },
  {
    path: "/auth",
    element: <Auth />,
    children: [
      {
        path: "/auth",
        element: <Login />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "verify-otp",
        element: <VerifyOtp />,
      },
      {
        path: "reset-password",
        element: <ResetPassword />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
