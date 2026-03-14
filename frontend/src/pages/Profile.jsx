import React, { useEffect } from "react";
import Profile_Header from "../components/profile/Profile_Header";
import Address_Section from "../components/profile/Address_Section";
import Previous_Order from "../components/profile/Previous_Order"
import Bottom_Section from "../components/profile/Bottom_Section";
const Profile = () => {
  return (
    <div className="px-5 lg:px-13 flex flex-col lg:flex-row gap-5 mb-5">
      <div>
        <Profile_Header/>
      </div>
      <div className="flex flex-col gap-3">
        <Address_Section/>
        <Previous_Order/>
        <Bottom_Section/>
      </div>
    </div>
  );
};

export default Profile;
