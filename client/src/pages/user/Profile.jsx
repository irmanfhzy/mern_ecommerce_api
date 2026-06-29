import { useNavigate } from "react-router-dom";
import { User, Shield, MapPin, Camera, ChevronRight } from "lucide-react";

import Button from "../../components/common/Button";

export default function Profile() {
  const navigate = useNavigate();

  const menus = [
    {
      title: "My Profile",
      description: "View and edit your personal information",
      icon: User,
      path: "/account/profile/edit",
    },
    {
      title: "Account & Security",
      description: "Password, email and phone settings",
      icon: Shield,
      path: "/account",
    },
    {
      title: "My Addresses",
      description: "Manage your shipping addresses",
      icon: MapPin,
      path: "/account/addresses",
    },
  ];

  return (
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="mb-8 text-3xl font-bold">My Account</h1>

      <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
        {/* Header */}

        <div className="border-b p-8">
          <div className="flex flex-col items-center">
            <button type="button" className="group relative">
              <img
                src="https://ui-avatars.com/api/?name=John+Doe&size=256"
                alt="Profile"
                className="h-28 w-28 rounded-full border-4 border-white object-cover shadow"
              />

              <div className="absolute bottom-1 right-1 rounded-full bg-black/70 p-2 text-white opacity-0 transition group-hover:opacity-100">
                <Camera size={16} />
              </div>
            </button>

            <h2 className="mt-5 text-2xl font-semibold">John Doe</h2>

            <p className="mt-1 text-gray-500">john@example.com</p>

            <Button
              variant="outline"
              size="sm"
              className="mt-5"
              onClick={() => navigate("/account/profile/edit")}
            >
              Edit Profile
            </Button>
          </div>
        </div>

        {/* Menu */}

        <div>
          {menus.map((menu) => {
            const Icon = menu.icon;

            return (
              <button
                key={menu.title}
                type="button"
                onClick={() => navigate(menu.path)}
                className="flex w-full items-center gap-5 border-b border-gray-100 px-6 py-5 text-left transition hover:bg-gray-50 last:border-b-0"
              >
                <div className="rounded-xl bg-gray-100 p-3">
                  <Icon size={22} />
                </div>

                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{menu.title}</h3>

                  <p className="mt-1 text-sm text-gray-500">
                    {menu.description}
                  </p>
                </div>

                <ChevronRight size={20} className="text-gray-400" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
