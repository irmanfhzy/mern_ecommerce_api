import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { ConfirmationDialogContext } from "../../contexts/ConfirmationDialogContext";

import AddressCard from "../../components/user/AddressCard";
import Button from "../../components/common/Button";
import Loading from "../../components/common/Loading";

import { getProfile, deleteAddress } from "../../services/user.service";

export default function Addresses() {
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  const { openDialog, closeDialog } = useContext(ConfirmationDialogContext);

  const fetchUser = async () => {
    try {
      const res = await getProfile();
      setAddresses(res.data.data.addresses);
    } catch (error) {
      alert(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleDelete = async (address) => {
    try {
      setLoading(true);
      await deleteAddress(address._id);
      await fetchUser();
    } catch (error) {
      alert(error.response?.data?.message || error.message);
    } finally {
      closeDialog();
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading fullScreen={true} />;
  }

  return (
    <div className="mx-auto max-w-5xl p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Addresses</h1>

        <p className="mt-2 text-gray-500">Manage your shipping addresses.</p>
      </div>

      {addresses.length === 0 ? (
        <div className="rounded-2xl border bg-white p-12 text-center">
          <p className="text-gray-500">You don't have any addresses yet.</p>

          <Button className="mt-6" onClick={() => navigate("new")}>
            Add Address
          </Button>
        </div>
      ) : (
        <>
          <div className="space-y-5">
            {addresses.map((address) => (
              <AddressCard
                key={address._id}
                address={address}
                selectable={false}
                actions={
                  <>
                    <Button
                      variant="outline"
                      onClick={() => navigate(`${address._id}/edit`)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() =>
                        openDialog({
                          title: "Delete Address",
                          message:
                            "Are you sure you want to delete this address?",
                          confirmVariant: "danger",
                          onConfirm: () => {
                            handleDelete(address);
                          },
                        })
                      }
                    >
                      Delete
                    </Button>
                  </>
                }
              />
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <Button variant="primary" size="lg" onClick={() => navigate("new")}>
              Add Address
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
