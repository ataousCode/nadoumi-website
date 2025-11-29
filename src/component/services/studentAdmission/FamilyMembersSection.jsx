import React from 'react'
import Input from '../../common/Input.jsx'
import Card from '../../common/Card.jsx'
import Button from '../../common/Button.jsx'
import { useI18n } from '../../../i18n/LocaleProvider.jsx'

function FamilyMembersSection({ members = [], onChange }) {
    const { t } = useI18n()
    const max = 3

    const addMember = () => {
        const next = [...members, { name: '', nationality: '', relationship: '', email: '', phone: '', jobTitle: '' }]
        onChange('familyMembers', next)
    }

    const removeMember = (index) => {
        const next = members.filter((_, i) => i !== index)
        onChange('familyMembers', next)
    }

    const updateMember = (index, field, val) => {
        const next = members.map((m, i) => (i === index ? { ...m, [field]: val } : m))
        onChange('familyMembers', next)
    }

    return (
        <div className="mt-6 space-y-4">
            {(members || []).map((m, idx) => (
                <Card key={idx} className="relative">
                    <button
                        type="button"
                        className="absolute right-4 top-4 text-sm text-red-600 hover:underline"
                        onClick={() => removeMember(idx)}
                        aria-label={`Remove family member ${idx + 1}`}
                    >
                        {t('contact.form.status.remove')}
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            type="text"
                            label={t('contact.form.status.family.name')}
                            value={m.name || ''}
                            onChange={(e) => updateMember(idx, 'name', e.target.value)}
                        />
                        <Input
                            type="text"
                            label={t('contact.form.status.family.nationality')}
                            value={m.nationality || ''}
                            onChange={(e) => updateMember(idx, 'nationality', e.target.value)}
                        />
                        <Input
                            type="text"
                            label={t('contact.form.status.family.relationship')}
                            value={m.relationship || ''}
                            onChange={(e) => updateMember(idx, 'relationship', e.target.value)}
                        />
                        <Input
                            type="email"
                            label={t('contact.form.status.family.email')}
                            value={m.email || ''}
                            onChange={(e) => updateMember(idx, 'email', e.target.value)}
                        />
                        <Input
                            type="tel"
                            label={t('contact.form.status.family.phone')}
                            value={m.phone || ''}
                            onChange={(e) => updateMember(idx, 'phone', e.target.value)}
                        />
                        <Input
                            type="text"
                            label={t('contact.form.status.family.job')}
                            value={m.jobTitle || ''}
                            onChange={(e) => updateMember(idx, 'jobTitle', e.target.value)}
                        />
                    </div>
                </Card>
            ))}

            <div className="flex">
                <Button
                    variant="primary"
                    size="sm"
                    type="button"
                    onClick={addMember}
                    disabled={(members || []).length >= max}
                    ariaLabel="Add Family Member"
                >
                    + Add Family Member
                </Button>
            </div>
        </div>
    )
}

export default FamilyMembersSection
