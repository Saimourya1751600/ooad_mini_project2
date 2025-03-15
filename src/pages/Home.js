import { Link } from "react-router-dom";
import "../styles/homestyle.css"; // Import the new CSS file

const Home = () => {
    return (
        <div className="home-container">
            <div className="content">
                <h1 className="title">Welcome to Urban-Connect</h1>
                <p className="subtitle">
                    A One-Stop Service Booking and Management Solution
                </p>
                <div className="buttons">
                    <Link to="/auth" className="btn btn-primary">Get Started</Link>
                    <Link to="/dashboard" className="btn btn-secondary">Dashboard</Link>
                </div>
            </div>
        </div>
    );
};

export default Home;
