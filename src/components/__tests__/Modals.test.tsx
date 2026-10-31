import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { AddExpenseModal } from '@/components/modals/AddExpenseModal';
import { AddMilestoneModal } from '@/components/modals/AddMilestoneModal';
import { AddGuestModal } from '@/components/modals/AddGuestModal';

describe('Modal Dialogs Suite', () => {
  it('renders AddExpenseModal with proper ARIA attributes and submits valid form', () => {
    const handleAdd = vi.fn();
    const handleClose = vi.fn();

    render(<AddExpenseModal isOpen={true} onClose={handleClose} onAdd={handleAdd} />);

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby', 'add-expense-modal-title');

    const nameInput = screen.getByLabelText(/Item or Service Name/i);
    fireEvent.change(nameInput, { target: { value: 'Bespoke Floral Arch' } });

    const submitBtn = screen.getByRole('button', { name: /Add to Ledger/i });
    fireEvent.click(submitBtn);

    expect(handleAdd).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Bespoke Floral Arch',
      })
    );
    expect(handleClose).toHaveBeenCalled();
  });

  it('renders AddMilestoneModal with proper dialog attributes and handles close', () => {
    const handleAdd = vi.fn();
    const handleClose = vi.fn();

    render(<AddMilestoneModal isOpen={true} onClose={handleClose} onAdd={handleAdd} />);

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');

    const closeBtn = screen.getByRole('button', { name: /Close dialog/i });
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalled();
  });

  it('renders AddGuestModal and adds an attendee record', () => {
    const handleAdd = vi.fn();
    const handleClose = vi.fn();

    render(<AddGuestModal isOpen={true} onClose={handleClose} onAdd={handleAdd} />);

    const nameInput = screen.getByLabelText(/Guest or Household Name/i);
    fireEvent.change(nameInput, { target: { value: 'Eleanor Vance' } });

    const submitBtn = screen.getByRole('button', { name: /Confirm Guest/i });
    fireEvent.click(submitBtn);

    expect(handleAdd).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Eleanor Vance',
      })
    );
  });
});
