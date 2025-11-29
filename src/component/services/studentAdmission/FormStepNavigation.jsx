import React from 'react'
import Button from '../../common/Button.jsx'
import { useI18n } from '../../../i18n/LocaleProvider.jsx'

function FormStepNavigation({
    currentStep,
    totalSteps,
    onNext,
    onPrev,
    onSubmit,
    isSubmitting = false
}) {
    const { t } = useI18n()
    const isLastStep = currentStep >= totalSteps - 1

    return (
        <div className="flex justify-between">
            <Button
                variant="secondary"
                size="md"
                ariaLabel={t('contact.form.status.previous')}
                type="button"
                onClick={onPrev}
                disabled={currentStep === 0 || isSubmitting}
            >
                {t('contact.form.status.previous')}
            </Button>

            {!isLastStep ? (
                <Button
                    variant="primary"
                    size="md"
                    ariaLabel={t('contact.form.status.next')}
                    type="button"
                    onClick={onNext}
                    disabled={isSubmitting}
                >
                    {t('contact.form.status.next')}
                </Button>
            ) : (
                <Button
                    variant="primary"
                    size="md"
                    ariaLabel={t('contact.form.status.submit')}
                    type="submit"
                    disabled={isSubmitting}
                    onClick={onSubmit}
                >
                    {isSubmitting ? (
                        <span className="flex items-center gap-2">
                            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            {t('common.status.submitting')}...
                        </span>
                    ) : (
                        t('contact.form.status.submit')
                    )}
                </Button>
            )}
        </div>
    )
}

export default FormStepNavigation
