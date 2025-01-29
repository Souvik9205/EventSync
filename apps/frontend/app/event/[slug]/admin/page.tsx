"use client";
import {
  useState,
  useEffect,
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactNode,
  ReactPortal,
} from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserPlus, Loader2 } from "lucide-react";
import { BACKEND_URL } from "@/app/secret";

const EventAdminPage = () => {
  const [eventData, setEventData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [newUserId, setNewUserId] = useState("");
  const [addingUser, setAddingUser] = useState(false);
  const eventId = useParams().slug as string;

  useEffect(() => {
    fetchEventData();
  }, []);

  const fetchEventData = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/event/adminlist`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setEventData(data);
    } catch (error) {
      console.error("Failed to fetch event data:", error);
    } finally {
      setLoading(false);
    }
  };

  const addNewOwner = async () => {
    if (!newUserId.trim()) return;

    setAddingUser(true);
    try {
      const response = await fetch(`${BACKEND_URL}/event/ownership`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventId,
          userId: newUserId,
        }),
      });

      if (response.ok) {
        setNewUserId("");
        fetchEventData();
      }
    } catch (error) {
      console.error("Failed to add new owner:", error);
    } finally {
      setAddingUser(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="space-y-6">
        {/* Event Info Card */}
        <Card>
          <CardHeader className="flex flex-row items-center space-x-4">
            <img
              src={eventData?.orgImgURL || "/api/placeholder/64/64"}
              alt={eventData?.organization}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <CardTitle>{eventData?.name}</CardTitle>
              <p className="text-sm text-gray-500">{eventData?.organization}</p>
            </div>
          </CardHeader>
        </Card>

        {/* Creator Info */}
        <Card>
          <CardHeader>
            <CardTitle>Event Creator</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <img
                src={eventData?.createdBy?.imgURL || "/api/placeholder/40/40"}
                alt={eventData?.createdBy?.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="font-medium">{eventData?.createdBy?.name}</p>
                <p className="text-sm text-gray-500">
                  {eventData?.createdBy?.email}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Add New Admin */}
        <Card>
          <CardHeader>
            <CardTitle>Add New Admin</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              <Input
                placeholder="Enter user ID"
                value={newUserId}
                onChange={(e) => setNewUserId(e.target.value)}
                className="flex-1"
              />
              <Button
                onClick={addNewOwner}
                disabled={addingUser || !newUserId.trim()}
              >
                {addingUser ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <UserPlus className="w-4 h-4 mr-2" />
                )}
                Add Admin
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Admins List */}
        <Card>
          <CardHeader>
            <CardTitle>Event Admins</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {eventData?.admins.map(
                (admin: {
                  id: Key | null | undefined;
                  imgURL: any;
                  name:
                    | string
                    | number
                    | bigint
                    | boolean
                    | ReactElement<unknown, string | JSXElementConstructor<any>>
                    | Iterable<ReactNode>
                    | Promise<
                        | string
                        | number
                        | bigint
                        | boolean
                        | ReactPortal
                        | ReactElement<
                            unknown,
                            string | JSXElementConstructor<any>
                          >
                        | Iterable<ReactNode>
                        | null
                        | undefined
                      >
                    | null
                    | undefined;
                  email:
                    | string
                    | number
                    | bigint
                    | boolean
                    | ReactElement<unknown, string | JSXElementConstructor<any>>
                    | Iterable<ReactNode>
                    | ReactPortal
                    | Promise<
                        | string
                        | number
                        | bigint
                        | boolean
                        | ReactPortal
                        | ReactElement<
                            unknown,
                            string | JSXElementConstructor<any>
                          >
                        | Iterable<ReactNode>
                        | null
                        | undefined
                      >
                    | null
                    | undefined;
                  createdAt: string | number | Date;
                }) => (
                  <div
                    key={admin.id}
                    className="flex items-center space-x-4 p-4 rounded-lg bg-gray-50"
                  >
                    <img
                      src={admin.imgURL || "/api/placeholder/40/40"}
                      alt=""
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-medium">{admin.name}</p>
                      <p className="text-sm text-gray-500">{admin.email}</p>
                    </div>
                    <p className="text-sm text-gray-500">
                      Added: {new Date(admin.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                )
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EventAdminPage;
