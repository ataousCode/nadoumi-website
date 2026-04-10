import React from "react";
import { ClipboardDocumentCheckIcon } from "@heroicons/react/24/outline";
import FormSection from "../../../../components/common/FormSection";
import Input from "../../../../components/common/Input";

const ScholarshipRequirementsSection = ({ register, errors }) => {
  return (
    <FormSection
      title="Application Requirements"
      description="Eligibility criteria for candidates."
      icon={ClipboardDocumentCheckIcon}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Input
          type="number"
          label="Age Min"
          placeholder="e.g. 18"
          error={errors.ageMin?.message}
          {...register("ageMin", { valueAsNumber: true })}
        />
        <Input
          type="number"
          label="Age Max"
          placeholder="e.g. 28"
          error={errors.ageMax?.message}
          {...register("ageMax", { valueAsNumber: true })}
        />
        <Input
          label="China Visit History"
          placeholder="e.g. Accept"
          error={errors.chinaVisitPolicy?.message}
          {...register("chinaVisitPolicy")}
        />
        <Input
          type="checkbox"
          label="Allow Minors"
          className="mt-8"
          {...register("acceptMinors")}
        />
        <Input
          label="Current Location Requirement"
          placeholder="e.g. Unlimited"
          error={errors.currentLocationPolicy?.message}
          {...register("currentLocationPolicy")}
        />
        <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-5 gap-8 bg-white p-8 rounded-[40px] border border-orange-100/50 shadow-sm">
          <Input
            type="number"
            label="Min. GPA"
            placeholder="e.g. 3.0"
            step="0.1"
            error={errors.gpaMin?.message}
            {...register("gpaMin", { valueAsNumber: true })}
          />
          <Input
            type="number"
            label="IELTS Score"
            placeholder="6.0"
            step="0.5"
            error={errors.ieltsScore?.message}
            {...register("ieltsScore", { valueAsNumber: true })}
          />
          <Input
            type="number"
            label="TOEFL Score"
            placeholder="80"
            error={errors.toeflScore?.message}
            {...register("toeflScore", { valueAsNumber: true })}
          />
          <Input
            type="number"
            label="Duolingo"
            placeholder="105"
            error={errors.duolingoScore?.message}
            {...register("duolingoScore", { valueAsNumber: true })}
          />
          <Input
            type="number"
            label="HSK Level"
            placeholder="4"
            error={errors.hskLevel?.message}
            {...register("hskLevel", { valueAsNumber: true })}
          />
        </div>
        <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-8">
          <Input
            type="textarea"
            label="English Taught Score Requirements"
            placeholder="e.g. Cumulative GPA of 3.0 or higher, IELTS 6.0..."
            error={errors.scoreRequirementsEnglish?.message}
            {...register("scoreRequirementsEnglish")}
            rows={4}
          />
          <Input
            type="textarea"
            label="Chinese Taught Score Requirements"
            placeholder="e.g. HSK Level 4 for Chinese-taught programs, GPA 3.0+..."
            error={errors.scoreRequirementsChinese?.message}
            {...register("scoreRequirementsChinese")}
            rows={4}
          />
        </div>
      </div>
    </FormSection>
  );
};

export default ScholarshipRequirementsSection;
