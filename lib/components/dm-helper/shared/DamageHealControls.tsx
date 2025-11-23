'use client';

import {
  Flex,
  Text,
  Input,
  Button,
  IconButton,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  useBreakpointValue,
} from '@chakra-ui/react';
import { useState, useRef, useEffect } from 'react';
import { FaAdjust, FaCaretDown, FaHeart, FaHeartBroken, FaMinus, FaPlus } from 'react-icons/fa';

interface DamageHealControlsProps {
  currentHealth: number | undefined;
  onDamage: (amount: number) => void;
  onHeal: (amount: number) => void;
  entityName: string;
  entityId: string;
  size?: 'sm' | 'md';
}

export const DamageHealControls: React.FC<DamageHealControlsProps> = ({
  currentHealth,
  onDamage,
  onHeal,
  entityName,
  entityId,
  size = 'sm',
}) => {
  const [amount, setAmount] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleDamage = (damageAmount?: number) => {
    const finalAmount = damageAmount ?? parseInt(amount, 10);
    if (!isNaN(finalAmount) && finalAmount > 0) {
      onDamage(finalAmount);
      setAmount('');
      setIsOpen(false);
    }
  };

  const handleHeal = (healAmount?: number) => {
    const finalAmount = healAmount ?? parseInt(amount, 10);
    if (!isNaN(finalAmount) && finalAmount > 0) {
      onHeal(finalAmount);
      setAmount('');
      setIsOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, action: 'damage' | 'heal') => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (action === 'damage') {
        handleDamage();
      } else {
        handleHeal();
      }
    }
  };

  const displayHealth = currentHealth ?? 0;

  return (
    <Flex alignItems="center" gap={{ base: 1, lg: 2 }} flexShrink={0}>
      <Text fontSize={{ base: 'xs', lg: size === 'sm' ? 'sm' : 'md' }} whiteSpace="nowrap" fontWeight="600">
        HP:
      </Text>
      <Text
        fontSize={{ base: 'xs', lg: size === 'sm' ? 'sm' : 'md' }}
        fontWeight="800"
        color="white"
        minW={{ base: '35px', lg: '50px' }}
        textAlign="right"
        data-testid={`${entityId}-health-label`}
        aria-label={`${entityName} current health: ${displayHealth}`}
      >
        {displayHealth}
      </Text>
      <Popover
        isOpen={isOpen}
        onOpen={() => setIsOpen(true)}
        onClose={() => setIsOpen(false)}
        placement="top"
        closeOnBlur={true}
      >
        <PopoverTrigger>
          <IconButton
            size={{ base: 'xs', lg: size === 'sm' ? 'sm' : 'md' }}
            variant="outline"
            colorScheme="red"
            icon={<FaHeartBroken color="orange" />}
            aria-label={`Apply damage or healing to ${entityName}`}
            data-testid={`${entityId}-damage-heal-trigger`}
          />
        </PopoverTrigger>
        <PopoverContent bg="blackAlpha.900" borderColor="gray.600" w={{ base: '240px', lg: '260px' }}>
          <PopoverBody>
            <Flex direction="column" gap={{ base: 2, lg: 3 }}>
              <Input
                ref={inputRef}
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.shiftKey) {
                    handleHeal();
                  } else if (e.key === 'Enter') {
                    handleDamage();
                  }
                }}
                aria-label="Damage or heal amount"
                data-testid={`${entityId}-damage-heal-input`}
                size={{ base: 'sm', lg: size }}
                min="1"
              />
              <Flex gap={2}>
                <Button
                  size={{ base: 'sm', lg: size }}
                  variant="redSolid"
                  leftIcon={<FaMinus />}
                  onClick={() => handleDamage()}
                  onKeyDown={(e) => handleKeyDown(e, 'damage')}
                  flex="1"
                  aria-label={`Deal ${amount || 'damage'} damage to ${entityName}`}
                  data-testid={`${entityId}-damage-button`}
                >
                  Damage
                </Button>
                <Button
                  size={{ base: 'sm', lg: size }}
                  colorScheme="green"
                  leftIcon={<FaPlus />}
                  onClick={() => handleHeal()}
                  onKeyDown={(e) => handleKeyDown(e, 'heal')}
                  flex="1"
                  aria-label={`Heal ${amount || 'healing'} to ${entityName}`}
                  data-testid={`${entityId}-heal-button`}
                >
                  Heal
                </Button>
              </Flex>
            </Flex>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </Flex>
  );
};
