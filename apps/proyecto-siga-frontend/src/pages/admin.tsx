import Header from "../components/adminHeader";
import Sidebar from "../components/adminSidebar";

export default function AdminPanelPage() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-auto">
        <div className="max-w-7x1 mx-auto w-full">
          <Header />
        </div>
      </div>
    </div>
  );
}
