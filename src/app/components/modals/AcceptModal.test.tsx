/**
 * Tests para AcceptModal
 *
 * Cubre:
 *  - Render condicional (open=true/false)
 *  - Defaults (08:00 - 10:00)
 *  - Validación: endTime > startTime
 *  - Submit con formato "HH:mm:00"
 *  - Cancelar llama onClose
 *  - loading deshabilita los botones
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AcceptModal } from './AcceptModal';

function defaultProps() {
  return {
    open: true,
    loading: false,
    onClose: vi.fn(),
    onSubmit: vi.fn(),
  };
}

describe('AcceptModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ──────────────────────────────────────────────────────────
  describe('render', () => {
    it('no renderiza nada cuando open=false', () => {
      const { container } = render(<AcceptModal {...defaultProps()} open={false} />);
      expect(container).toBeEmptyDOMElement();
    });

    it('muestra el título "Aceptar solicitud" cuando está abierto', () => {
        render(<AcceptModal {...defaultProps()} />);

        expect(screen.getByRole('heading', { name: 'Aceptar solicitud' })).toBeInTheDocument();
    });

    it('renderiza los campos de inicio y fin con defaults 08:00 y 10:00', () => {
      render(<AcceptModal {...defaultProps()} />);
      const start = screen.getByLabelText(/hora de inicio/i) as HTMLInputElement;
      const end = screen.getByLabelText(/hora de fin/i) as HTMLInputElement;
      expect(start.value).toBe('08:00');
      expect(end.value).toBe('10:00');
    });
  });

  // ──────────────────────────────────────────────────────────
  describe('submit válido', () => {
    it('al aceptar con defaults, llama onSubmit con "08:00:00" y "10:00:00"', async () => {
      const onSubmit = vi.fn();
      render(<AcceptModal {...defaultProps()} onSubmit={onSubmit} />);
      const user = userEvent.setup();

      await user.click(screen.getByRole('button', { name: /aceptar solicitud/i }));

      expect(onSubmit).toHaveBeenCalledTimes(1);
      expect(onSubmit).toHaveBeenCalledWith('08:00:00', '10:00:00');
    });

    it('respeta horarios personalizados en el submit', async () => {
      const onSubmit = vi.fn();
      render(<AcceptModal {...defaultProps()} onSubmit={onSubmit} />);
      const user = userEvent.setup();

      const start = screen.getByLabelText(/hora de inicio/i);
      const end = screen.getByLabelText(/hora de fin/i);

      // Limpiar y poner valores nuevos
      await user.clear(start);
      await user.type(start, '14:00');
      await user.clear(end);
      await user.type(end, '17:30');

      await user.click(screen.getByRole('button', { name: /aceptar solicitud/i }));

      expect(onSubmit).toHaveBeenCalledWith('14:00:00', '17:30:00');
    });
  });

  // ──────────────────────────────────────────────────────────
  describe('validaciones', () => {
    it('error cuando endTime <= startTime', async () => {
      const onSubmit = vi.fn();
      render(<AcceptModal {...defaultProps()} onSubmit={onSubmit} />);
      const user = userEvent.setup();

      const start = screen.getByLabelText(/hora de inicio/i);
      const end = screen.getByLabelText(/hora de fin/i);

      await user.clear(start);
      await user.type(start, '12:00');
      await user.clear(end);
      await user.type(end, '10:00');

      await user.click(screen.getByRole('button', { name: /aceptar solicitud/i }));

      expect(screen.getByRole('alert')).toHaveTextContent(/posterior/i);
      expect(onSubmit).not.toHaveBeenCalled();
    });

    it('error cuando endTime es igual a startTime', async () => {
      const onSubmit = vi.fn();
      render(<AcceptModal {...defaultProps()} onSubmit={onSubmit} />);
      const user = userEvent.setup();

      const start = screen.getByLabelText(/hora de inicio/i);
      const end = screen.getByLabelText(/hora de fin/i);

      await user.clear(start);
      await user.type(start, '10:00');
      await user.clear(end);
      await user.type(end, '10:00');

      await user.click(screen.getByRole('button', { name: /aceptar solicitud/i }));

      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(onSubmit).not.toHaveBeenCalled();
    });
  });

  // ──────────────────────────────────────────────────────────
  describe('cancelar', () => {
    it('click en "Cancelar" llama onClose', async () => {
      const onClose = vi.fn();
      render(<AcceptModal {...defaultProps()} onClose={onClose} />);
      const user = userEvent.setup();

      await user.click(screen.getByRole('button', { name: /^cancelar$/i }));

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('click en el botón X llama onClose', async () => {
      const onClose = vi.fn();
      render(<AcceptModal {...defaultProps()} onClose={onClose} />);
      const user = userEvent.setup();

      await user.click(screen.getByRole('button', { name: /cerrar/i }));

      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  // ──────────────────────────────────────────────────────────
  describe('estado loading', () => {
    it('deshabilita los botones cuando loading=true', () => {
      render(<AcceptModal {...defaultProps()} loading={true} />);

      const cancelBtn = screen.getByRole('button', { name: /^cancelar$/i });
      expect(cancelBtn).toBeDisabled();

      // Botón de aceptar también debe estar disabled
      const acceptBtns = screen.getAllByRole('button')
        .filter((b) => (b as HTMLButtonElement).disabled);
      expect(acceptBtns.length).toBeGreaterThanOrEqual(2);
    });
  });
});