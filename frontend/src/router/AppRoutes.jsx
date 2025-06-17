import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Auth/LoginPage";
import Signup from "../pages/Auth/SignupPage";
import MyInfo from "../pages/MyPage/MyInfo";
import ChangePassword from "../pages/MyPage/ChangePassword";
import DeactivateAccount from "../pages/MyPage/DeactivateAccount";
import Calendar from "../pages/Calendar/Calendar";
import Challenge from "../pages/Challenge/Challenge";
import Suggestion from "../pages/Suggestion/Suggestion";
import CommunityList from "../pages/Community/CommunityList";
import CommunityWrite from "../pages/Community/CommunityWrite";
import CommunityEdit from "../pages/Community/CommunityEdit";
import BoardRequestPage from "../pages/Community/BoardRequestPage";
import PostDetail from "../pages/Community/PostDetail";
import MyPage from "../pages/MyPage/MyPage";
import PrivateRoutes from "./PrivateRoutes";
import ChallengeCreate from "../pages/Challenge/ChallengeCreate";
import ChallengeDetail from "../pages/Challenge/ChallengeDetail";
import Attendance from "../pages/Challenge/Attendance";
import ReviewList from "../pages/Challenge/ReviewList";
import ReviewCreate from "../pages/Challenge/ReviewCreate";
import ChallengeEdit from "../pages/Challenge/ChallengeEdit";
import ReviewEdit from "../pages/Challenge/ReviewEdit";
import TimeRecommendation from "../pages/Suggestion/TimeRecommendation";
import PreferenceInterest from "../pages/Suggestion/PreferenceInterest";
import PreferenceVision from "../pages/Suggestion/PreferenceVision";
import RecommendationResult from "../pages/Suggestion/RecommendationResult";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Calendar />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/challenge" element={<Challenge />} />
            <Route path="/challenge/create" element={<ChallengeCreate />} />
            <Route path="/suggestion" element={<Suggestion />} />
            <Route path="/attendance/:challengeId" element={<Attendance />} />
            <Route path="/challenge/:challengeId/reviews" element={<ReviewList />} />
            <Route path="/challenge/:challengeId/review/create" element={<ReviewCreate />} />
            <Route path="/challenge/:id" element={<ChallengeDetail />} />
            <Route path="/challenge/:id/edit" element={<ChallengeEdit />} />
            <Route path="/challenge/:challengeId/review/:reviewId/edit" element={<ReviewEdit />} />
            <Route path="/recommendation/time" element={<TimeRecommendation />} /> 
            <Route path="/suggestion/preferences" element={<PreferenceInterest />} />
            <Route path="/suggestion/preferences/vision" element={<PreferenceVision />} />
            <Route path="/suggestion/recommendation" element={<RecommendationResult />} />
            <Route path="/community" element={<CommunityList />} />
            {/*<Route
                path="/community"
                element={
                    <PrivateRoutes>
                        <CommunityList />
                    </PrivateRoutes>
                }
            />*/}
            <Route path="/community/:board_id/write" element={<CommunityWrite />} />
            <Route path="/posts/:post_id" element={<PostDetail />} />
            <Route path="/community/board-requests" element={<BoardRequestPage />} />

            <Route
                path="/mypage"
                element={
                    <PrivateRoutes>
                        <MyPage />
                    </PrivateRoutes>
                }
            />
            <Route path="/mypage/info" element={<PrivateRoutes><MyInfo /></PrivateRoutes>} />
            <Route path="/mypage/password" element={<PrivateRoutes><ChangePassword /></PrivateRoutes>} />
            <Route path="/mypage/deactivate" element={<PrivateRoutes><DeactivateAccount /></PrivateRoutes>} />
        </Routes>
    );
};

export default AppRoutes;