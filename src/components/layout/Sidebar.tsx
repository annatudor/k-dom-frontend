import {
  Box,
  VStack,
  IconButton,
  Tooltip,
  Image,
  Text,
} from "@chakra-ui/react";
import { FiUsers, FiCompass, FiTrendingUp, FiBookmark } from "react-icons/fi";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

// Mock data pentru recent viewed - aceasta va fi înlocuită cu date reale
const recentViewed = [
  {
    id: "1",
    name: "Marea Neagră",
    img: "/images/blacksea.jpg",
    description: "Cultură, mitologie și geopolitică.",
    slug: "marea-neagra",
  },
  {
    id: "2",
    name: "Cucuteni",
    img: "/images/cucuteni.jpg",
    description: "Civilizația veche de pe teritoriul României.",
    slug: "cucuteni",
  },
  {
    id: "3",
    name: "Basarabia",
    img: "/images/basarabia.jpg",
    description: "Istorie, cultură și conflict.",
    slug: "basarabia",
  },
];

interface SidebarItemProps {
  icon: React.ReactElement;
  label: string;
  tooltip: string;
  onClick: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  label,
  tooltip,
  onClick,
}) => (
  <VStack spacing={0}>
    <Tooltip label={tooltip} placement="right">
      <IconButton
        icon={icon}
        aria-label={tooltip}
        variant="ghost"
        size="lg"
        isRound
        onClick={onClick}
        _hover={{
          bg: "purple.50",
          color: "purple.500",
        }}
      />
    </Tooltip>
    <Text fontSize="10px" mt="1" color="gray.600">
      {label}
    </Text>
  </VStack>
);

export function Sidebar() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleExplore = () => {
    navigate("/explore");
  };

  const handleCommunity = () => {
    navigate("/community");
  };

  const handleTrending = () => {
    navigate("/trending");
  };

  const handleBookmarks = () => {
    if (isAuthenticated) {
      navigate("/bookmarks");
    } else {
      navigate("/login");
    }
  };

  const handleRecentKDomClick = (slug: string) => {
    navigate(`/kdoms/slug/${slug}`);
  };

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
      <SidebarItem
        icon={<FiCompass />}
        label="Explore"
        tooltip="Explore K-Doms and discover new content"
        onClick={handleExplore}
      />

      {/* Community */}
      <SidebarItem
        icon={<FiUsers />}
        label="Community"
        tooltip="Join discussions and connect with others"
        onClick={handleCommunity}
      />

      {/* Trending */}
      <SidebarItem
        icon={<FiTrendingUp />}
        label="Trending"
        tooltip="See what's trending in the community"
        onClick={handleTrending}
      />

      {/* Bookmarks - doar pentru utilizatori autentificați */}
      {isAuthenticated && (
        <SidebarItem
          icon={<FiBookmark />}
          label="Saved"
          tooltip="Your bookmarked K-Doms and posts"
          onClick={handleBookmarks}
        />
      )}

      {/* Recent viewed - doar pentru utilizatori autentificați */}
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
                onClick={() => handleRecentKDomClick(kdom.slug)}
                _hover={{
                  transform: "scale(1.1)",
                  transition: "transform 0.2s",
                }}
                onError={(e) => {
                  // Fallback pentru imagini care nu există
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                }}
              />
            </Tooltip>
          ))}
        </VStack>
      )}
    </Box>
  );
}
