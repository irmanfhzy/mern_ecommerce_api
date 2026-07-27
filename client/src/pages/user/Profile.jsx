import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Shield, MapPin, Camera, ChevronRight } from "lucide-react";

import { AuthContext } from "../../contexts/AuthContext";

import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import ProfilePicture from "../../components/common/ProfilePicture";

export default function Profile() {
  const navigate = useNavigate();

  const { user } = useContext(AuthContext);

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const menus = [
    {
      title: "My Profile",
      description: "View and edit your personal information",
      icon: User,
      path: "/profile/edit",
    },
    {
      title: "Account & Security",
      description: "Password, email and phone settings",
      icon: Shield,
      path: "/profile/account",
    },
    {
      title: "My Addresses",
      description: "Manage your shipping addresses",
      icon: MapPin,
      path: "/profile/addresses",
    },
  ];

  return (
    <>
      <div className="mx-auto max-w-4xl p-6">
        <h1 className="mb-8 text-3xl font-bold">My Account</h1>

        <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
          <div className="border-b p-8">
            <div className="flex flex-col items-center">
              <div className="group relative">
                <Button
                  variant="transparent"
                  className="rounded-full p-0"
                  onClick={() => setIsPreviewOpen(true)}
                >
                  <ProfilePicture
                    src={user?.image?.url}
                    alt={user?.name}
                    size={120}
                  />
                </Button>

                <Button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate("/profile/picture/change");
                  }}
                  className="absolute bottom-1 right-1 rounded-full bg-black/70 p-2 text-white opacity-0 transition group-hover:opacity-100 hover:bg-black"
                >
                  <Camera size={16} />
                </Button>
              </div>

              <h2 className="mt-5 text-2xl font-semibold">{user?.name}</h2>

              <p className="mt-1 text-gray-500">{user?.email}</p>
            </div>
          </div>

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
                    <h3 className="font-semibold text-gray-900">
                      {menu.title}
                    </h3>

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

      <Modal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        title="Profile Picture"
        size="md"
        className="flex justify-center"
      >
        <ProfilePicture src={user?.image?.url} alt={user?.name} size={400} />
      </Modal>
    </>
  );
}
