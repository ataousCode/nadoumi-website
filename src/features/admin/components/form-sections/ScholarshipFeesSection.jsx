import React from "react";
import { ClipboardDocumentCheckIcon } from "@heroicons/react/24/outline";
import FormSection from "../../../../components/common/FormSection";
import Input from "../../../../components/common/Input";

const ScholarshipFeesSection = ({ register, errors }) => {
  return (
    <FormSection
      title="Fee Structure"
      description="University and Agent fees."
      icon={ClipboardDocumentCheckIcon}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b pb-2">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-orange-600">
              University Fees
            </h4>
            <Input
              type="select"
              className="w-24"
              {...register("universityFeeCurrency")}
              options={[
                { value: "RMB", label: "¥ RMB" },
                { value: "USD", label: "$ USD" },
              ]}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Input
              type="number"
              label="Original Tuition"
              placeholder="e.g. 25000"
              error={errors.originalTuitionFee?.message}
              {...register("originalTuitionFee", { valueAsNumber: true })}
            />
            <Input
              type="number"
              label="Tuition After"
              placeholder="e.g. 5000"
              error={errors.tuitionFeeAfterScholarship?.message}
              {...register("tuitionFeeAfterScholarship", { valueAsNumber: true })}
            />
            <Input
              label="University Register Fees"
              placeholder="e.g. 400 RMB"
              error={errors.registrationFee?.message}
              {...register("registrationFee")}
              className="md:col-span-2"
            />
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-gray-100">
              <Input
                type="number"
                label="Accommodation (Quad)"
                placeholder="e.g. 2400"
                error={errors.accommodationFeeQuad?.message}
                {...register("accommodationFeeQuad", { valueAsNumber: true })}
              />
              <Input
                type="number"
                label="Acc. After"
                placeholder="e.g. 500"
                error={errors.accommodationFeeAfterScholarship?.message}
                {...register("accommodationFeeAfterScholarship", { valueAsNumber: true })}
              />
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b pb-2">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-600">
              Nadoumi Agent Fees
            </h4>
            <Input
              type="select"
              className="w-24"
              {...register("nadoumiFeeCurrency")}
              options={[
                { value: "RMB", label: "¥ RMB" },
                { value: "USD", label: "$ USD" },
              ]}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="number"
              label="Application Fee"
              placeholder="e.g. 400"
              error={errors.nadoumiApplicationFee?.message}
              {...register("nadoumiApplicationFee", { valueAsNumber: true })}
            />
            <Input
              type="number"
              label="Service Fee"
              placeholder="e.g. 500"
              error={errors.nadoumiServiceFee?.message}
              {...register("nadoumiServiceFee", { valueAsNumber: true })}
            />
          </div>
        </div>
      </div>
    </FormSection>
  );
};

export default ScholarshipFeesSection;
