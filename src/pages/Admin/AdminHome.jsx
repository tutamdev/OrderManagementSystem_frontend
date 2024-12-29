import { Outlet } from "react-router-dom";
import { Nav } from "../../admin_components/Nav/Nav";
import { Sidebar } from "../../admin_components/Sidebar/Sidebar";

export default function AdminHome() {
    return (
        <div className="flex h-screen">
            <Sidebar />
            <div className="flex-grow ml-52">
                <Nav />
                <Outlet />
            </div>
        </div>
    )
}
