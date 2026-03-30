import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import DynamicListEditor from '../../../components/common/DynamicListEditor';

describe('DynamicListEditor Component', () => {
  it('renders the empty label when no items are provided', () => {
    const emptyLabel = "No items right now.";
    render(<DynamicListEditor items={[]} emptyLabel={emptyLabel} />);
    
    expect(screen.getByText(emptyLabel)).toBeInTheDocument();
  });

  it('calls onAdd when the add button is clicked', () => {
    const onAddMock = vi.fn();
    render(<DynamicListEditor onAdd={onAddMock} addLabel="Add new item" />);
    
    const addButton = screen.getByText('Add new item');
    fireEvent.click(addButton);
    
    expect(onAddMock).toHaveBeenCalledTimes(1);
  });

  it('renders items based on renderItem function', () => {
    const items = ['Item 1', 'Item 2'];
    render(
      <DynamicListEditor 
        items={items} 
        renderItem={(item) => <div data-testid="list-item">{item}</div>} 
      />
    );
    
    const renderedItems = screen.getAllByTestId('list-item');
    expect(renderedItems).toHaveLength(2);
    expect(renderedItems[0]).toHaveTextContent('Item 1');
    expect(renderedItems[1]).toHaveTextContent('Item 2');
  });

  it('calls onRemove with correct index when remove button is clicked', () => {
    const onRemoveMock = vi.fn();
    const items = ['Item 1'];
    
    render(
      <DynamicListEditor 
        items={items} 
        onRemove={onRemoveMock}
        renderItem={(item) => <div>{item}</div>} 
        addLabel="Add"
      />
    );
    
    // There are 2 buttons: "Add" and the Trash icon button
    const buttons = screen.getAllByRole('button');
    // Click the last button which should be the trash button
    fireEvent.click(buttons[buttons.length - 1]);
    
    expect(onRemoveMock).toHaveBeenCalledWith(0);
  });
});
