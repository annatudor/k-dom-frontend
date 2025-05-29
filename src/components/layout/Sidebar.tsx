import {
  Box,
  VStack,
  IconButton,
  Tooltip,
  Image,
  Text,
} from "@chakra-ui/react";
import { FiUsers, FiCompass } from "react-icons/fi";
import { useAuth } from "@/context/AuthContext";

const recentViewed = [
  {
    id: "1",
    name: "Marea Neagră",
    img: "/images/blacksea.jpg",
    description: "Cultură, mitologie și geopolitică.",
  },
  {
    id: "2",
    name: "Cucuteni",
    img: "/images/cucuteni.jpg",
    description: "Civilizația veche de pe teritoriul României.",
  },
  {
    id: "3",
    name: "Basarabia",
    img: "/images/basarabia.jpg",
    description: "Istorie, cultură și conflict.",
  },
];

export function Sidebar() {
  const { isAuthenticated } = useAuth();

  return (
    <Box
      w="80px"
      h="100%" // ocupă toată înălțimea oferită de Flex
      bg="gray.50"
      borderRight="1px solid"
      borderColor="gray.200"
      display={{ base: "none", md: "flex" }}
      flexDirection="column"
      alignItems="center"
      gap={6}
      py={4}
    >
      {/* Explore */}
      <VStack spacing={0}>
        <Tooltip label="Explore" placement="right">
          <IconButton
            icon={<FiCompass />}
            aria-label="Explore"
            variant="ghost"
            size="lg"
            isRound
          />
        </Tooltip>
        <Text fontSize="10px" mt="1" color="gray.600">
          Explore
        </Text>
      </VStack>

      {/* Community */}
      <VStack spacing={0}>
        <Tooltip label="Community" placement="right">
          <IconButton
            icon={<FiUsers />}
            aria-label="Community"
            variant="ghost"
            size="lg"
            isRound
          />
        </Tooltip>
        <Text fontSize="10px" mt="1" color="gray.600">
          Community
        </Text>
      </VStack>

      {/* Recent viewed */}
      {isAuthenticated && (
        <VStack spacing={3} mt={6}>
          <Text fontSize="10px" fontWeight="bold" color="gray.500">
            Recent
          </Text>
          {recentViewed.map((kdom) => (
            <Tooltip
              key={kdom.id}
              label={
                <Box>
                  <strong>{kdom.name}</strong>
                  <br />
                  <span>{kdom.description}</span>
                </Box>
              }
              placement="right"
              hasArrow
              bg="gray.700"
              color="white"
              p={3}
              borderRadius="md"
            >
              <Image
                src={kdom.img}
                alt={kdom.name}
                boxSize="40px"
                borderRadius="full"
                objectFit="cover"
                cursor="pointer"
              />
            </Tooltip>
          ))}
        </VStack>
      )}
    </Box>
  );
}
