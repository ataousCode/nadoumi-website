import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  EnvelopeIcon, 
  BellIcon, 
  DevicePhoneMobileIcon,
  GlobeAltIcon,
  ClockIcon
} from "@heroicons/react/24/outline";

// Layout & Common Components
import StudentLayout from "../../components/layout/StudentLayout";
import SettingsSection from "../../components/common/SettingsSection";
import ProfileAvatarEditor from "../../components/common/ProfileAvatarEditor";
import Input from "../../components/common/Input";
import SettingsActionFooter from "../../components/common/SettingsActionFooter";
import Modal from "../../components/common/Modal";
import ConfirmDialog from "../../components/common/ConfirmDialog";

// Feature Components & Constants
import NotificationRow from "../../features/settings/components/NotificationRow";
import CheckboxRow from "../../features/settings/components/CheckboxRow";
import PasswordChangeForm from "../../features/settings/components/PasswordChangeForm";
import { LANGUAGE_OPTIONS, TIMEZONE_OPTIONS } from "../../features/settings/constants";

// Services & Context
import { authService } from "../../api/auth.service";
import { useToast } from "../../context/ToastContext";

const SettingsPage = () => {
  const queryClient = useQueryClient();
  const { success, error } = useToast();
  
  // Modal states
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);

  // Fetch profile data
  const { data: profileResponse, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: () => authService.getProfile(),
  });

  const studentData = profileResponse?.data || profileResponse;

  // Local state for form fields
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "", secondaryEmail: "", phone: "",
    notifications: { email: true, push: false, sms: true },
    privacy: { publicProfile: true, showActivity: false, shareData: true },
    language: LANGUAGE_OPTIONS[0].value,
    timezone: TIMEZONE_OPTIONS[0].value,
  });

  const [isDirty, setIsDirty] = useState(false);

  // Sync local state when data loads
  useEffect(() => {
    if (studentData) {
      setFormData({
        firstName: studentData.firstName || "",
        lastName: studentData.lastName || "",
        email: studentData.email || "",
        phone: studentData.phone || "",
        secondaryEmail: studentData.profile?.secondaryEmail || "",
        notifications: studentData.profile?.notifications || { email: true, push: false, sms: true },
        privacy: studentData.profile?.privacy || { publicProfile: true, showActivity: false, shareData: true },
        language: studentData.profile?.language || LANGUAGE_OPTIONS[0].value,
        timezone: studentData.profile?.timezone || TIMEZONE_OPTIONS[0].value,
      });
    }
  }, [studentData]);

  // Mutations
  const updateProfileMutation = useMutation({
    mutationFn: (data) => authService.updateProfile(data),
    onSuccess: (response) => {
      queryClient.setQueryData(["profile"], response);
      success("Settings saved successfully");
      setIsDirty(false);
    },
    onError: () => error("Failed to save settings"),
  });

  const uploadAvatarMutation = useMutation({
    mutationFn: (file) => authService.updateProfilePicture(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      success("Profile picture updated");
    },
    onError: () => error("Failed to upload image"),
  });

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const handleNestedChange = (category, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [category]: { ...prev[category], [field]: value },
    }));
    setIsDirty(true);
  };

  const handleSave = () => {
    updateProfileMutation.mutate({
      ...formData,
      profile: { ...studentData.profile, ...formData }, // Merge profile fields
    });
  };

  if (isLoading) return <div className="flex items-center justify-center min-h-[400px]"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" /></div>;

  return (
    <StudentLayout user={studentData}>
      <div className="max-w-4xl mx-auto space-y-12 pb-12">
        <SettingsSection title="Account Information" description="Manage your profile details and security">
          <div className="space-y-8">
            <ProfileAvatarEditor 
              src={studentData?.profilePicture}
              onUpdate={(file) => uploadAvatarMutation.mutate(file)}
              onRemove={() => {/* Implement remove logic if API exists */}}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Email Address" value={formData.email} disabled className="bg-gray-100" />
              <Input label="Secondary Email (Optional)" value={formData.secondaryEmail}
                onChange={(e) => handleFieldChange("secondaryEmail", e.target.value)} placeholder="Personal email" />
            </div>
            <div className="flex flex-col sm:flex-row items-end gap-2">
              <div className="flex-1 w-full"><Input label="Password" type="password" value="********" disabled className="bg-gray-50" /></div>
              <button type="button" onClick={() => setIsPasswordModalOpen(true)}
                className="px-4 py-2.5 text-sm font-semibold text-blue-600 border border-blue-100 rounded-xl hover:bg-blue-50 transition-colors mb-1">
                Change Password
              </button>
            </div>
          </div>
        </SettingsSection>

        <SettingsSection title="Notification Preferences" description="Control how and when you receive updates">
          <div className="divide-y divide-gray-50 -my-6">
            <NotificationRow icon={<EnvelopeIcon className="h-5 w-5 text-blue-500" />} title="Email Notifications" description="Weekly digests and course announcements"
              enabled={formData.notifications.email} onChange={(val) => handleNestedChange("notifications", "email", val)} />
            <NotificationRow icon={<BellIcon className="h-5 w-5 text-purple-500" />} title="Push Notifications" description="Real-time alerts for grade changes"
              enabled={formData.notifications.push} onChange={(val) => handleNestedChange("notifications", "push", val)} />
            <NotificationRow icon={<DevicePhoneMobileIcon className="h-5 w-5 text-orange-500" />} title="SMS Alerts" description="Urgent campus security and weather alerts"
              enabled={formData.notifications.sms} onChange={(val) => handleNestedChange("notifications", "sms", val)} />
          </div>
        </SettingsSection>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <SettingsSection title="Privacy Settings" description="Manage your visibility and data">
            <div className="space-y-4">
              <CheckboxRow label="Public profile in student directory" checked={formData.privacy.publicProfile} onChange={(e) => handleNestedChange("privacy", "publicProfile", e.target.checked)} />
              <CheckboxRow label="Show my activity to classmates" checked={formData.privacy.showActivity} onChange={(e) => handleNestedChange("privacy", "showActivity", e.target.checked)} />
              <CheckboxRow label="Share anonymized research data" checked={formData.privacy.shareData} onChange={(e) => handleNestedChange("privacy", "shareData", e.target.checked)} />
              <div className="pt-4 mt-4 border-t border-gray-50">
                <button type="button" className="w-full py-3 px-4 flex items-center justify-center gap-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50">
                  <DownloadIcon /> Download My Data
                </button>
              </div>
            </div>
          </SettingsSection>

          <SettingsSection title="Language & Region" description="Set your local preferences">
            <div className="space-y-6">
              <SelectGroup label="Display Language" icon={<GlobeAltIcon className="h-5 w-5 text-gray-400" />} 
                value={formData.language} options={LANGUAGE_OPTIONS} onChange={(e) => handleFieldChange("language", e.target.value)} />
              <SelectGroup label="Time Zone" icon={<ClockIcon className="h-5 w-5 text-gray-400" />}
                value={formData.timezone} options={TIMEZONE_OPTIONS} onChange={(e) => handleFieldChange("timezone", e.target.value)} />
            </div>
          </SettingsSection>
        </div>

        <SettingsActionFooter isDirty={isDirty} isSaving={updateProfileMutation.isPending}
          onSave={handleSave} onDiscard={() => setIsDirty(false)} onDeactivate={() => setIsDeactivateModalOpen(true)} />
      </div>

      <Modal isOpen={isPasswordModalOpen} onClose={() => setIsPasswordModalOpen(false)} title="Change Password">
        <PasswordChangeForm onSuccess={() => setIsPasswordModalOpen(false)} onCancel={() => setIsPasswordModalOpen(false)} />
      </Modal>
      <ConfirmDialog isOpen={isDeactivateModalOpen} onClose={() => setIsDeactivateModalOpen(false)} onConfirm={() => {}} title="Deactivate Account"
        message="Are you sure you want to deactivate your account? This action cannot be undone." confirmText="Deactivate" variant="danger" />
    </StudentLayout>
  );
};

const SelectGroup = ({ label, icon, value, options, onChange }) => (
  <div className="space-y-2">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">{icon}</div>
      <select className="w-full pl-11 pr-10 py-3 bg-gray-50 border border-transparent rounded-xl text-sm focus:ring-2 focus:ring-blue-600 focus:bg-white outline-none appearance-none"
        value={value} onChange={onChange}>
        {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
      </select>
    </div>
  </div>
);

const DownloadIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

export default SettingsPage;
