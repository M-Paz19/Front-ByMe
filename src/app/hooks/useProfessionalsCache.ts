import { useCallback, useRef, useState } from 'react';
import { ProfessionalsService } from '../../services/professionals/professionals.service';
import type { ProfessionalInfo } from '../components/RequestCard';

export function useProfessionalsCache() {
  const [professionalsById, setProfessionalsById] = useState<Record<string, ProfessionalInfo>>({});

  const inFlightRef = useRef<Set<string>>(new Set());

  const hydrate = useCallback(async (ids: string[]) => {
    const unique = Array.from(new Set(ids)).filter(id => {
      if (!id) return false;
      if (professionalsById[id]) return false;
      if (inFlightRef.current.has(id)) return false;
      return true;
    });

    if (unique.length === 0) return;

    unique.forEach(id => inFlightRef.current.add(id));

    const results = await Promise.all(
      unique.map(async (id) => {
        try {
          const detail = await ProfessionalsService.getPublicById(id);
          return { id, info: {
            firstName: detail.firstName,
            lastName: detail.lastName,
            profilePictureUrl: detail.profilePictureUrl,
          } as ProfessionalInfo };
        } catch {
          return null;
        } finally {
          inFlightRef.current.delete(id);
        }
      })
    );

    setProfessionalsById(prev => {
      const next = { ...prev };
      for (const r of results) {
        if (r) next[r.id] = r.info;
      }
      return next;
    });
  }, [professionalsById]);

  return { professionalsById, hydrate };
}