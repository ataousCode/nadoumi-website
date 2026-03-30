import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import FormSection from '../../../components/common/FormSection';
import { DocumentTextIcon } from '@heroicons/react/24/outline';

describe('FormSection Component', () => {
  it('renders the title and description', () => {
    render(
      <FormSection title="General Info" description="Fill out the basic details." icon={DocumentTextIcon}>
        <p>Child content</p>
      </FormSection>
    );
    expect(screen.getByText('General Info')).toBeInTheDocument();
    expect(screen.getByText('Fill out the basic details.')).toBeInTheDocument();
  });

  it('renders children correctly', () => {
    render(
      <FormSection title="Section">
        <input data-testid="inner-input" />
      </FormSection>
    );
    expect(screen.getByTestId('inner-input')).toBeInTheDocument();
  });

  it('renders action slot when provided', () => {
    render(
      <FormSection title="Section" action={<button>Edit</button>} />
    );
    expect(screen.getByText('Edit')).toBeInTheDocument();
  });

  it('does not render description if omitted', () => {
    render(<FormSection title="Section" />);
    // Only the title should be present
    expect(screen.getByText('Section')).toBeInTheDocument();
    expect(screen.queryByText('Fill out the basic details.')).not.toBeInTheDocument();
  });
});
