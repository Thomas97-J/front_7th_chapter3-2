import { useCallback } from "react";
import { useAtom } from "jotai";
import { notificationsAtom, Notification } from "../atoms/notificationAtom";
import { TIMING } from "../../constants";

export const useNotificationActions = () => {
  const [notifications, setNotifications] = useAtom(notificationsAtom);

  const addNotification = useCallback(
    (message: string, type: Notification["type"] = "success") => {
      const id = Date.now().toString();
      setNotifications((prev) => [...prev, { id, message, type }]);

      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, TIMING.NOTIFICATION_AUTO_DISMISS_MS);
    },
    [setNotifications]
  );

  const removeNotification = useCallback(
    (id: string) => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    },
    [setNotifications]
  );

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, [setNotifications]);

  return {
    notifications,
    addNotification,
    removeNotification,
    clearNotifications,
  };
};
