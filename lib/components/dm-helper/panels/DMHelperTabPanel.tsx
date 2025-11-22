import { TabPanel, TabPanelProps } from '@chakra-ui/react';

export default function DMHelperTabPanel({
  index,
  current,
  children,
  ...rest
}: TabPanelProps & { index: number; current: number }) {
  if (index !== current) return null;
  return (
    <TabPanel h={{ base: 'auto', lg: '100%' }} minH="0" overflow={{ base: 'visible', lg: 'hidden' }} px="0" display="flex" flexDirection="column" {...rest}>
      {children}
    </TabPanel>
  );
}
