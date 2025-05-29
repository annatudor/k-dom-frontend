import {
  Box,
  IconButton,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  VStack,
  Text,
} from "@chakra-ui/react";
import { FiBell } from "react-icons/fi";
import { useState } from "react";

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Box
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <Popover isOpen={isOpen} placement="bottom-start">
        <PopoverTrigger>
          <IconButton
            icon={<FiBell />}
            aria-label="Notifications"
            variant="ghost"
            size="sm"
          />
        </PopoverTrigger>
        <PopoverContent w="320px">
          <PopoverBody>
            <Tabs isFitted variant="enclosed">
              <TabList mb="1em">
                <Tab>User</Tab>
                <Tab>System</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <VStack align="start" spacing={2}>
                    <Text fontSize="sm">You have a new comment</Text>
                    <Text fontSize="sm">Your post was upvoted</Text>
                  </VStack>
                </TabPanel>
                <TabPanel>
                  <VStack align="start" spacing={2}>
                    <Text fontSize="sm">Platform update available</Text>
                    <Text fontSize="sm">New community guidelines</Text>
                  </VStack>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </Box>
  );
}
