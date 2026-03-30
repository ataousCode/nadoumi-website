import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import StatsCard from '../../../components/common/StatsCard';
import { ArrowTrendingUpIcon } from '@heroicons/react/24/solid';

describe('StatsCard Component', () => {
  it('renders the title and value correctly', () => {
    render(<StatsCard title="Total Users" value={1500} icon={ArrowTrendingUpIcon} color="blue" />);
    
    expect(screen.getByText('Total Users')).toBeInTheDocument();
    expect(screen.getByText('1,500')).toBeInTheDocument();
  });

  it('renders the trend indicator if provided', () => {
    render(
      <StatsCard 
        title="Revenue" 
        value="$50k" 
        icon={ArrowTrendingUpIcon} 
        color="green" 
        trend="up" 
        trendValue="+12%" 
      />
    );
    
    expect(screen.getByText('+12%')).toBeInTheDocument();
  });
});
