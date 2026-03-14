import Navbar from "../Components/Navbar.tsx";
import "../CSS/profile.css";

export default function Profile() {
  return (
    <>
      <Navbar />

      <div className="profile-page">

        <div className="profile-sidebar">
          <div className="profile-card">
            <div className="profile-avatar">IMG</div>

            <h3>John Doe</h3>
            <p className="profile-email">john@email.com</p>

            <button className="profile-btn">Edit Profile</button>
          </div>
        </div>

        <div className="profile-content">

          <h1>Profile Overview</h1>

          <div className="profile-info-card">
            <h3>Personal Information</h3>

            <div className="info-row">
              <label>Full Name</label>
              <p>Ambot kinsa</p>
            </div>

            <div className="info-row">
              <label>Email</label>
              <p>sample@email.com</p>
            </div>


          </div>

        </div>

      </div>
    </>
  );
}