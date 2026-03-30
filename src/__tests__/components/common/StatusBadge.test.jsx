import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import StatusBadge from '../../../pages/Admin/components/StatusBadge';

describe('StatusBadge Component', () => {
  it('renders the correct label for "accepted" status', () => {
    render(<StatusBadge status="accepted" />);
    expect(screen.getByText('Admission Granted')).toBeInTheDocument();
  });

  it('renders the correct label for "rejected" status', () => {
    render(<StatusBadge status="rejected" />);
    expect(screen.getByText('Rejected')).toBeInTheDocument();
  });

  it('renders the correct label for "under_review" status', () => {
    render(<StatusBadge status="under_review" />);
    expect(screen.getByText('Under Review')).toBeInTheDocument();
  });

  it('renders the correct label for "interview" status', () => {
    render(<StatusBadge status="interview" />);
    expect(screen.getByText('Interviewing')).toBeInTheDocument();
  });

  it('renders the correct label for "pending" status', () => {
    render(<StatusBadge status="pending" />);
    expect(screen.getByText('Pending Review')).toBeInTheDocument();
  });

  it('falls back to "Pending Review" for an unknown status', () => {
    render(<StatusBadge status="totally_unknown_status" />);
    expect(screen.getByText('Pending Review')).toBeInTheDocument();
  });

  it('is case-insensitive — "ACCEPTED" renders correctly', () => {
    render(<StatusBadge status="ACCEPTED" />);
    expect(screen.getByText('Admission Granted')).toBeInTheDocument();
  });

  it('renders the correct label for "published" status', () => {
    render(<StatusBadge status="published" />);
    expect(screen.getByText('Published')).toBeInTheDocument();
  });

  it('renders the correct label for "revoked" status', () => {
    render(<StatusBadge status="revoked" />);
    expect(screen.getByText('Action Revoked')).toBeInTheDocument();
  });
});
