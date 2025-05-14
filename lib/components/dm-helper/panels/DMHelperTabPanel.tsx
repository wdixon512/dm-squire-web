import { TabPanel, TabPanelProps } from '@chakra-ui/react';

export default function DMHelperTabPanel({
  index,
  current,
  children,
  ...rest
}: TabPanelProps & { index: number; current: number }) {
  if (index !== current) return null;
  return (
    <TabPanel maxH="100%" h="100%" px="0" {...rest}>
      {children}
    </TabPanel>
  );
}
