import { LogOut, User } from "lucide-react";
import { useLogoutMutation } from "../services";
import { useAuth } from "../contexts/AuthContext";

const Dashboard = () => {
  const { user, logout } = useAuth();

  const logoutMutation = useLogoutMutation({
    onSuccess: () => {
      // Update auth context
      logout(false); // Don't show toast since mutation already shows one
      console.log("Goodbye!");
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate(undefined);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-purple-600 rounded-full"></div>
              <h1 className="ml-3 text-xl font-semibold text-gray-900">
                Dashboard
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-gray-700">
                <User className="w-4 h-4 mr-2" />
                Welcome back, {user?.fullName}!
              </div>

              <button
                onClick={handleLogout}
                disabled={logoutMutation.isLoading}
                className="flex items-center px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" />
                {logoutMutation.isLoading ? "Logging out..." : "Logout"}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Dashboard Content
              </h2>
              <p className="text-gray-600">
                This is where your dashboard content will go.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
