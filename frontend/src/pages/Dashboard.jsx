import { Link } from "react-router-dom";
import NavBar from "../components/NavBar";

const Dashboard = () => {
  return (
    <>
      <NavBar />
      <div className="p-8">
        <h1>Dashboard</h1>
        <div>
          <Link></Link>
          <Link></Link>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
