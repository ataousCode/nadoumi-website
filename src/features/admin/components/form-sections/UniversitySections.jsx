import React from "react";
import { ClockIcon, LightBulbIcon, GlobeAltIcon } from "@heroicons/react/24/outline";
import FormSection from "../../../../components/common/FormSection";
import Input from "../../../../components/common/Input";
import DynamicListEditor from "../../../../components/common/DynamicListEditor";

const UniversityHistorySection = ({ register, errors }) => (
  <FormSection
    title="History & Heritage"
    description="Founding background and institutional milestones."
    icon={ClockIcon}
  >
    <Input
      type="textarea"
      label="Institutional History"
      rows={6}
      placeholder="Describe the founding..."
      error={errors.history?.message}
      {...register("history")}
    />
  </FormSection>
);

const UniversityOpportunitiesSection = ({ register, errors, watch, setValue }) => {
  const opportunities = watch("opportunities") || [];
  const partnershipCountries = watch("partnershipCountries") || [];

  return (
    <FormSection
      title="Opportunities & Global Partnerships"
      description="Exchange programs and partner countries."
      icon={LightBulbIcon}
    >
      <div className="space-y-10">
        <DynamicListEditor
          title="Student Opportunities"
          items={opportunities}
          onAdd={() => setValue("opportunities", [...opportunities, ""])}
          onRemove={(idx) => setValue("opportunities", opportunities.filter((_, i) => i !== idx))}
          renderItem={(item, idx) => (
            <Input
              key={idx}
              value={item}
              onChange={(e) => {
                const next = [...opportunities];
                next[idx] = e.target.value;
                setValue("opportunities", next);
              }}
              placeholder="e.g. Exchange with Yale"
            />
          )}
        />
        <DynamicListEditor
          title="Partner Countries"
          items={partnershipCountries}
          onAdd={() => setValue("partnershipCountries", [...partnershipCountries, ""])}
          onRemove={(idx) => setValue("partnershipCountries", partnershipCountries.filter((_, i) => i !== idx))}
          renderItem={(item, idx) => (
            <Input
              key={idx}
              value={item}
              onChange={(e) => {
                const next = [...partnershipCountries];
                next[idx] = e.target.value;
                setValue("partnershipCountries", next);
              }}
              placeholder="e.g. United Kingdom"
            />
          )}
        />
      </div>
    </FormSection>
  );
};

const UniversityScholarshipSection = ({ register, errors, fields, append, remove }) => (
  <FormSection
    title="Scholarship Availability"
    description="Indicate whether scholarships are available."
    icon={GlobeAltIcon}
  >
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
      <Input
        type="select"
        label="Scholarship Status"
        options={[
          { value: "Available", label: "✅ Scholarships Available" },
          { value: "Limited", label: "⚠️ Limited Slots" },
          { value: "Not Available", label: "❌ Not Available" },
        ]}
        {...register("scholarshipAvailability")}
      />
    </div>

    <DynamicListEditor
      title="Detailed Scholarship Notes"
      items={fields}
      onAdd={() => append({ name: "", notes: "" })}
      onRemove={(idx) => remove(idx)}
      renderItem={(item, idx) => (
        <div key={item.id} className="grid grid-cols-1 md:grid-cols-2 gap-8 p-10 bg-blue-50/20 rounded-[48px] border border-blue-100/50 transition-all hover:bg-white">
          <Input
            label="Scholarship Type / Name"
            placeholder="e.g. CSC Scholarship"
            error={errors.scholarshipNotes?.[idx]?.name?.message}
            {...register(`scholarshipNotes.${idx}.name`)}
          />
          <Input
            label="Coverage & Notes"
            placeholder="e.g. Full tuition + Monthly stipend"
            {...register(`scholarshipNotes.${idx}.notes`)}
          />
        </div>
      )}
    />
  </FormSection>
);

export { UniversityHistorySection, UniversityOpportunitiesSection, UniversityScholarshipSection };
