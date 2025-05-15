import { useMemo } from 'react';
import { useToast } from '@chakra-ui/react';
import { EntityService } from '@lib/services/entity-service';

let entityServiceInstance: EntityService | null = null;

export function useEntityService() {
  const toast = useToast();

  return useMemo(() => {
    if (!entityServiceInstance) {
      entityServiceInstance = new EntityService(toast);
    }
    return entityServiceInstance;
  }, [toast]);
}
