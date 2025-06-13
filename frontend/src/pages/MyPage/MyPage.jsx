// MyPage/MyPage.jsx

import ChangePassword from "./ChangePassword";
import DeactivateAccount from "./DeactivateAccount";
import MyInfo from "./MyInfo";

const MyPage = () => {
    return (
        <div>
            <MyInfo />
            <DeactivateAccount />
            <ChangePassword />
        </div>
    );
}

export default MyPage;