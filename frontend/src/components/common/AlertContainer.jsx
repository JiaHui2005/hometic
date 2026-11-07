import React, { useState, useCallback } from "react";
import Alert from "./Alert";
import "./Alert.css";

export default function AlertContainer() {
  const [alerts, setAlerts] = useState([]);

  const removeAlert = useCallback((id) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  }, []);

  const addAlert = useCallback((type, title, message, autoClose = 5000) => {
    const id = Date.now() + Math.random();
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
    <div className="toast-stack" aria-live="polite">
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
