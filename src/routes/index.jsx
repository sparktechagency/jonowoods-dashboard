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
import ViewSalesReps from "../components/SalesRepsmanagement/detailsSalesReps/SubCategoryTable";
import VideoManagement from "../components/SalesRepsManagement/detailsSalesReps/VideoManagement";
import Products from "../Pages/Dashboard/Products";
import LoyaltyProgram from "../Pages/Dashboard/LoyaltyProgram";
import OrdermanagementContainer from "../components/orderMangement/OrdermanagementContainer";
import VideomanagementSystem from "../components/retailermanagement/RetailerManageTable";
import Categorymanagement from "../components/SalesRepsmanagement/SalesRepsmanagement";
import Subsciber from "../Pages/Dashboard/Subsciber";
import Subscriptionmanagements from "../components/subscriptionmanagement/Subscriptionmanagements";
import Quotationmanagement from "../components/quatation/Quatationmanagement";
import SubCategorymanagement from "../components/SalesRepsmanagement/detailsSalesReps/CategoryDetails";
import LoginCredentials from "../components/loginCredentials/LoginCredentials";
import CommingSoonVideoPage from "../components/comingSoon/CommingSoonVideoPage";
import TodayVideos from "../components/todayVideos/TodayVideos";
import ChallengeDetails from "../components/todayVideos/ChallengeDetails";
import CourseDetailsVideomanagement from "../components/retailermanagement/CourseDetailsVideomanagement";
import DailyInspirationPage from "../components/comingSoon/DailyInspiration";
import PostmanagementSystem from "../components/createPost/CreatePostmanagement";
import Pagemanagement from "../Pages/Dashboard/LoginAndRegisterBG";
import ContactmanagementTable from "../components/contactus/ContactUsUser";
import SubscriptionmanagementTable from "../components/subscriptionUser/SubscriptionUser";
import AllVideos from "../components/SalesRepsmanagement/AllVideos";
import PrivateRoute from "./ProtectedRoute";
// import SalesRepsmanagementTable from "../components/SalesRepsmanagement/SalesRepsmanagement";

const router = createBrowserRouter([
  {
    path: "/",
    element: <PrivateRoute><Main /></PrivateRoute> ,
    // element: <Main />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/user-management",
        element: <OrdermanagementContainer />,
      },
      {
        path: "/salesmanagement",
        element: <VideomanagementSystem />,
      },
      {
        path: "/video-management",
        element: <Retailer />,
      },
      {
        path: "/video-management/:subCategoryId",
        element: <CourseDetailsVideomanagement />,
      },
      {
        path: "/category-management",
        element: <Categorymanagement />,
      },
      {
        path: "/subcategory-management/:categoryId",
        element: <SubCategorymanagement />,
      },
      {
        path: "/category-management/:categoryId",
        element: <AllVideos />,
      },
      {
        path: "/inventory",
        element: <Quotationmanagement />,
      },
      {
        path: "/salesRepsManage/:id",
        element: <ViewSalesReps />,
      },
      {
        path: "/sales-video-management/:subCategoryId",
        element: <VideoManagement />,
      },
      {
        path: "/loyalty-program",
        element: <Subscriptionmanagements />,
      },
      {
        path: "/coming-soon",
        element: <CommingSoonVideoPage />,
      },
      {
        path: "/today-video",
        element: <TodayVideos />,
      },
      {
        path: "/challenge-details/:id",
        element: <ChallengeDetails />,
      },
      {
        path: "/daily-inspiration",
        element: <DailyInspirationPage />,
      },
      {
        path: "/login-credentials",
        element: <LoginCredentials />,
      },
      {
        path: "/create-post",
        element: <PostmanagementSystem />,
      },
      {
        path: "/subsciption",
        element: <Subsciber />,
      },
      {
        path: "/category",
        element: <Category />,
      },
      {
        path: "/login-register",
        element: <Pagemanagement />,
      },
      {
        path: "/contactUs",
        element: <ContactmanagementTable />,
      },
      {
        path: "/subcription-user",
        element: <SubscriptionmanagementTable />,
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
