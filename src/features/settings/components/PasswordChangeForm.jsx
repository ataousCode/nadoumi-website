import React, { useState } from "react";
import { useToast } from "../../../context/ToastContext";
import { authService } from "../../../api/auth.service";
import Input from "../../../components/common/Input";

const PasswordChangeForm = ({ onSuccess, onCancel }) => {
  const { success, error } = useToast();
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      error("New passwords do not match");
      return;
    }

    setIsSubmitting(true);
    try {
      await authService.changePassword({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      success("Password changed successfully");
      onSuccess();
    } catch (err) {
      error(err.message || "Failed to change password");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Current Password"
        type="password"
        required
        value={passwords.currentPassword}
        onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
      />
      <Input
        label="New Password"
        type="password"
        required
        value={passwords.newPassword}
        onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
      />
      <Input
        label="Confirm New Password"
        type="password"
        required
        value={passwords.confirmPassword}
        onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
      />
      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? "Changing..." : "Change Password"}
        </button>
      </div>
    </form>
  );
};

export default PasswordChangeForm;
