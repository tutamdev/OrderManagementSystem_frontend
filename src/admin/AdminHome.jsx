import { Outlet } from "react-router-dom";
import { Dashboard } from "../admin_components/Dashboard/Dashboard";
import { Nav } from "../admin_components/Nav/Nav";
import { Sidebar } from "../admin_components/Sidebar/Sidebar";

export default function AdminHome() {
    return (
        <div className="flex h-screen">
            <Sidebar />
            <div className="flex-grow">
                <Nav />
                {/* <Dashboard /> */}
                <Outlet />
            </div>
        </div>
    )
}
