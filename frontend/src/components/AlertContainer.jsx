import React, { useState, useCallback } from "react";
import Alert from "./Alert";

export default function AlertContainer() {
  const [alerts, setAlerts] = useState([]);

  const removeAlert = useCallback((id) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  }, []);

  const addAlert = useCallback((type, title, message, autoClose = 5000) => {
    const id = Date.now();
    setAlerts((prev) => [
      ...prev,
      { id, type, title, message, autoClose }
    ]);
    return id;
  }, []);

  React.useEffect(() => {
    window.showAlert = addAlert;
  }, [addAlert]);

  return (
    <div>
      {alerts.map((alert) => (
        <Alert
          key={alert.id}
          id={alert.id}
          type={alert.type}
          title={alert.title}
          message={alert.message}
          autoClose={alert.autoClose}
          onClose={() => removeAlert(alert.id)}
        />
      ))}
    </div>
  );
}
