/**
 * Tests para ServiceModal
 *
 * Cubre:
 *  - Validaciones del formulario
 *  - Que onSubmit reciba los datos correctos cuando todo es válido
 *  - Que onClose se llame al cancelar
 *  - Render según modo (create vs edit)
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ServiceModal } from './ServiceModal';

// Helper: props por defecto del modal
function defaultProps() {
  return {
    open: true,
    mode: 'create' as const,
    initial: undefined,
    loading: false,
    onClose: vi.fn(),
    onSubmit: vi.fn(),
  };
}

// Helper: rellenar todos los campos del form con datos válidos
async function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByPlaceholderText('Ej: Reparación de tuberías'), 'Reparación de tuberías');
  await user.type(screen.getByPlaceholderText(/Describe el servicio/i), 'Reparación completa de tuberías domésticas.');
  await user.type(screen.getByPlaceholderText('10'), '5');
  await user.type(screen.getByPlaceholderText('25000'), '50000');
}

describe('ServiceModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ──────────────────────────────────────────────────────────
  describe('render', () => {
    it('no renderiza nada cuando open=false', () => {
      const { container } = render(<ServiceModal {...defaultProps()} open={false} />);
      expect(container).toBeEmptyDOMElement();
    });

    it('en modo "create" muestra el título "Añadir servicio"', () => {
      render(<ServiceModal {...defaultProps()} mode="create" />);
      expect(screen.getByText('Añadir servicio')).toBeInTheDocument();
    });

    it('en modo "edit" muestra el título "Editar servicio"', () => {
      render(<ServiceModal {...defaultProps()} mode="edit" />);
      expect(screen.getByText('Editar servicio')).toBeInTheDocument();
    });

    it('en modo "edit" pre-rellena los campos con initial', () => {
      render(
        <ServiceModal
          {...defaultProps()}
          mode="edit"
          initial={{
            name: 'Servicio existente',
            description: 'Descripción larga del servicio existente',
            estimatedDurationHours: 3,
            basePrice: 30000,
          }}
        />
      );
      expect(screen.getByDisplayValue('Servicio existente')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Descripción larga del servicio existente')).toBeInTheDocument();
      expect(screen.getByDisplayValue('3')).toBeInTheDocument();
      expect(screen.getByDisplayValue('30000')).toBeInTheDocument();
    });
  });

  // ──────────────────────────────────────────────────────────
  describe('validaciones', () => {
    it('error si el nombre tiene menos de 3 caracteres', async () => {
      const onSubmit = vi.fn();
      render(<ServiceModal {...defaultProps()} onSubmit={onSubmit} />);
      const user = userEvent.setup();

      await user.type(screen.getByPlaceholderText('Ej: Reparación de tuberías'), 'AB');
      await user.type(screen.getByPlaceholderText(/Describe el servicio/i), 'Una descripción larga.');
      await user.type(screen.getByPlaceholderText('10'), '5');
      await user.type(screen.getByPlaceholderText('25000'), '20000');

      await user.click(screen.getByRole('button', { name: /guardar/i }));

      expect(screen.getByRole('alert')).toHaveTextContent(/nombre.*m[ií]nimo 3/i);
      expect(onSubmit).not.toHaveBeenCalled();
    });

    it('error si la descripción tiene menos de 10 caracteres', async () => {
      const onSubmit = vi.fn();
      render(<ServiceModal {...defaultProps()} onSubmit={onSubmit} />);
      const user = userEvent.setup();

      await user.type(screen.getByPlaceholderText('Ej: Reparación de tuberías'), 'Nombre OK');
      await user.type(screen.getByPlaceholderText(/Describe el servicio/i), 'Corta');
      await user.type(screen.getByPlaceholderText('10'), '5');
      await user.type(screen.getByPlaceholderText('25000'), '20000');

      await user.click(screen.getByRole('button', { name: /guardar/i }));

      expect(screen.getByRole('alert')).toHaveTextContent(/descripci[oó]n.*m[ií]nimo 10/i);
      expect(onSubmit).not.toHaveBeenCalled();
    });

    it('error si la duración es menor a 1', async () => {
      const onSubmit = vi.fn();
      render(<ServiceModal {...defaultProps()} onSubmit={onSubmit} />);
      const user = userEvent.setup();

      await user.type(screen.getByPlaceholderText('Ej: Reparación de tuberías'), 'Nombre OK');
      await user.type(screen.getByPlaceholderText(/Describe el servicio/i), 'Descripción suficientemente larga');
      await user.type(screen.getByPlaceholderText('10'), '0');
      await user.type(screen.getByPlaceholderText('25000'), '20000');

      await user.click(screen.getByRole('button', { name: /guardar/i }));

      expect(screen.getByRole('alert')).toHaveTextContent(/duraci[oó]n/i);
      expect(onSubmit).not.toHaveBeenCalled();
    });

    it('error si el precio es negativo', async () => {
      const onSubmit = vi.fn();
      render(<ServiceModal {...defaultProps()} onSubmit={onSubmit} />);
      const user = userEvent.setup();

      await user.type(screen.getByPlaceholderText('Ej: Reparación de tuberías'), 'Nombre OK');
      await user.type(screen.getByPlaceholderText(/Describe el servicio/i), 'Descripción suficientemente larga');
      await user.type(screen.getByPlaceholderText('10'), '5');
      await user.type(screen.getByPlaceholderText('25000'), '-100');

      await user.click(screen.getByRole('button', { name: /guardar/i }));

      expect(screen.getByRole('alert')).toHaveTextContent(/precio/i);
      expect(onSubmit).not.toHaveBeenCalled();
    });
  });

  // ──────────────────────────────────────────────────────────
  describe('submit válido', () => {
    it('llama onSubmit con los datos cuando el form es válido', async () => {
      const onSubmit = vi.fn();
      render(<ServiceModal {...defaultProps()} onSubmit={onSubmit} />);
      const user = userEvent.setup();

      await fillValidForm(user);
      await user.click(screen.getByRole('button', { name: /guardar/i }));

      expect(onSubmit).toHaveBeenCalledTimes(1);
      expect(onSubmit).toHaveBeenCalledWith({
        name: 'Reparación de tuberías',
        description: 'Reparación completa de tuberías domésticas.',
        estimatedDurationHours: 5,
        basePrice: 50000,
      });
    });

    it('trim() los strings antes de enviarlos', async () => {
      const onSubmit = vi.fn();
      render(<ServiceModal {...defaultProps()} onSubmit={onSubmit} />);
      const user = userEvent.setup();

      // Espacios extra que deben ser eliminados
      await user.type(screen.getByPlaceholderText('Ej: Reparación de tuberías'), '   Nombre   ');
      await user.type(screen.getByPlaceholderText(/Describe el servicio/i), '   Una descripción larga.   ');
      await user.type(screen.getByPlaceholderText('10'), '2');
      await user.type(screen.getByPlaceholderText('25000'), '10000');

      await user.click(screen.getByRole('button', { name: /guardar/i }));

      expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({
        name: 'Nombre',
        description: 'Una descripción larga.',
      }));
    });
  });

  // ──────────────────────────────────────────────────────────
  describe('cancelar', () => {
    it('al hacer click en "Cancelar" llama onClose', async () => {
      const onClose = vi.fn();
      render(<ServiceModal {...defaultProps()} onClose={onClose} />);
      const user = userEvent.setup();

      await user.click(screen.getByRole('button', { name: /cancelar/i }));

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('al hacer click en el botón X (cerrar) llama onClose', async () => {
      const onClose = vi.fn();
      render(<ServiceModal {...defaultProps()} onClose={onClose} />);
      const user = userEvent.setup();

      await user.click(screen.getByRole('button', { name: /cerrar/i }));

      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  // ──────────────────────────────────────────────────────────
  describe('estado loading', () => {
    it('deshabilita el botón "Guardar" cuando loading=true', () => {
      render(<ServiceModal {...defaultProps()} loading={true} />);
      // Cuando está loading, no muestra texto "Guardar", solo el spinner.
      // Buscamos el botón con tipo submit que esté disabled.
      const buttons = screen.getAllByRole('button');
      const submitBtn = buttons.find((b) => (b as HTMLButtonElement).disabled);
      expect(submitBtn).toBeDefined();
    });
  });
});