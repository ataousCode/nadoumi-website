import React from "react";
import { ClipboardDocumentCheckIcon } from "@heroicons/react/24/outline";
import FormSection from "../../../../components/common/FormSection";
import Input from "../../../../components/common/Input";

const ScholarshipProgramDetailsSection = ({ register, errors }) => {
  return (
    <FormSection
      title="Program & Scholarship Details"
      description="Specifics about the degree, intake and policy."
      icon={ClipboardDocumentCheckIcon}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Input
          label="Program Name"
          required
          placeholder="e.g. Mechanical Engineering"
          error={errors.programName?.message}
          {...register("programName")}
        />
        <Input
          label="Academic Field"
          placeholder="e.g. Engineering & Technology"
          error={errors.field?.message}
          {...register("field")}
        />
        <Input
          label="Degree Level"
          placeholder="e.g. Bachelor"
          error={errors.degree?.message}
          {...register("degree")}
        />
        <Input
          label="Intake Session"
          placeholder="e.g. September 2026"
          error={errors.intake?.message}
          {...register("intake")}
        />
        <Input
          label="Scholarship Duration (Text)"
          placeholder="e.g. 4 Years (Full-time)"
          error={errors.scholarshipDurationText?.message}
          {...register("scholarshipDurationText")}
        />
        <Input
          type="date"
          label="Application Deadline"
          required
          placeholder="e.g. 2026-06-30"
          error={errors.applicationDeadline?.message}
          {...register("applicationDeadline")}
        />
        <div className="md:col-span-2">
          <Input
            type="textarea"
            label="Scholarship Policy"
            placeholder="e.g. Covers 100% of tuition and accommodation fees..."
            error={errors.scholarshipPolicy?.message}
            {...register("scholarshipPolicy")}
            rows={3}
          />
        </div>
      </div>
    </FormSection>
  );
};

export default ScholarshipProgramDetailsSection;
