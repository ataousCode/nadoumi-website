import React from "react";
import Button from "./Button";
import { cn } from "../../utils/cn";

const SettingsActionFooter = ({
  onSave,
  onDiscard,
  onDeactivate,
  isDirty = false,
  isSaving = false,
  className = "",
}) => {
  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 mt-8 border-t border-gray-100",
        className
      )}
    >
      <button
        type="button"
        onClick={onDeactivate}
        className="text-sm font-semibold text-red-500 hover:text-red-600 transition-colors order-2 sm:order-1"
      >
        Deactivate my account
      </button>

      <div className="flex items-center gap-3 w-full sm:w-auto order-1 sm:order-2">
        <Button
          type="button"
          variant="secondary"
          onClick={onDiscard}
          disabled={!isDirty || isSaving}
          className="flex-1 sm:flex-none py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-900 border-none"
        >
          Discard Changes
        </Button>
        <Button
          type="submit"
          onClick={onSave}
          disabled={!isDirty || isSaving}
          className="flex-1 sm:flex-none py-2.5 bg-blue-600 hover:bg-blue-700 text-white border-none shadow-sm shadow-blue-200"
        >
          {isSaving ? "Saving..." : "Save All Settings"}
        </Button>
      </div>
    </div>
  );
};

export default SettingsActionFooter;
