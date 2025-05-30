// src/components/kdom/KDomContent.tsx
import {
  Box,
  Text,
  VStack,
  useColorModeValue,
  Card,
  CardBody,
} from "@chakra-ui/react";

interface KDomContentProps {
  content: string;
  theme: "Light" | "Dark" | "Vibrant" | "Pastel";
}

export function KDomContent({ content, theme }: KDomContentProps) {
  const defaultBg = useColorModeValue("white", "gray.800");
  const defaultColor = useColorModeValue("gray.800", "white");

  // Stilizare bazată pe tema K-Dom-ului
  const getThemeStyles = () => {
    switch (theme) {
      case "Dark":
        return {
          bg: "gray.900",
          color: "gray.100",
          borderColor: "gray.700",
          accent: "purple.400",
        };
      case "Vibrant":
        return {
          bg: "white",
          color: "gray.800",
          borderColor: "purple.200",
          accent: "purple.600",
        };
      case "Pastel":
        return {
          bg: "white",
          color: "gray.800",
          borderColor: "pink.200",
          accent: "pink.500",
        };
      default:
        return {
          bg: defaultBg,
          color: defaultColor,
          borderColor: "gray.200",
          accent: "blue.500",
        };
    }
  };

  const themeStyles = getThemeStyles();

  return (
    <Card
      bg={themeStyles.bg}
      color={themeStyles.color}
      borderWidth="1px"
      borderColor={themeStyles.borderColor}
      borderRadius="xl"
      boxShadow="lg"
      overflow="hidden"
      w="full"
      maxW="none"
    >
      <CardBody p={0}>
        {content ? (
          <Box
            px={{ base: 4, md: 6, lg: 8 }}
            py={{ base: 6, md: 8, lg: 10 }}
            w="full"
            maxW="none"
            sx={{
              // Stiluri pentru conținutul HTML
              "& h1": {
                fontSize: { base: "2xl", md: "3xl", lg: "4xl" },
                fontWeight: "bold",
                mb: 8,
                color: themeStyles.accent,
                borderBottom: "3px solid",
                borderColor: themeStyles.accent,
                pb: 4,
                lineHeight: "1.2",
              },
              "& h2": {
                fontSize: { base: "xl", md: "2xl", lg: "3xl" },
                fontWeight: "semibold",
                mb: 6,
                mt: 12,
                color: themeStyles.accent,
                position: "relative",
                _before: {
                  content: '""',
                  position: "absolute",
                  left: "-24px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: "6px",
                  height: "24px",
                  bg: themeStyles.accent,
                  borderRadius: "3px",
                },
                pl: 8,
                lineHeight: "1.3",
              },
              "& h3": {
                fontSize: { base: "lg", md: "xl", lg: "2xl" },
                fontWeight: "semibold",
                mb: 4,
                mt: 8,
                color: themeStyles.accent,
                lineHeight: "1.4",
              },
              "& h4": {
                fontSize: { base: "md", md: "lg", lg: "xl" },
                fontWeight: "semibold",
                mb: 3,
                mt: 6,
                color: themeStyles.accent,
                lineHeight: "1.4",
              },
              "& p": {
                mb: 6,
                lineHeight: "1.8",
                fontSize: { base: "md", md: "lg" },
                maxW: "none",
              },
              "& ul, & ol": {
                mb: 6,
                pl: 8,
                fontSize: { base: "md", md: "lg" },
              },
              "& li": {
                mb: 3,
                lineHeight: "1.7",
              },
              "& blockquote": {
                borderLeft: "6px solid",
                borderColor: themeStyles.accent,
                pl: 8,
                py: 6,
                my: 8,
                bg: theme === "Dark" ? "gray.800" : "gray.50",
                fontStyle: "italic",
                borderRadius: "0 12px 12px 0",
                position: "relative",
                fontSize: { base: "md", md: "lg" },
                _before: {
                  content: '"❝"',
                  position: "absolute",
                  top: "12px",
                  left: "16px",
                  fontSize: "32px",
                  color: themeStyles.accent,
                  fontWeight: "bold",
                },
                "& p": {
                  pl: 6,
                  mb: 0,
                },
              },
              "& code": {
                bg: theme === "Dark" ? "gray.700" : "gray.100",
                color: theme === "Dark" ? "green.300" : "red.600",
                px: 3,
                py: 1,
                borderRadius: "6px",
                fontSize: "sm",
                fontFamily: "mono",
                fontWeight: "medium",
              },
              "& pre": {
                bg: "gray.900",
                color: "green.300",
                p: 8,
                borderRadius: "16px",
                overflow: "auto",
                mb: 8,
                boxShadow: "inner",
                border: "1px solid",
                borderColor: "gray.700",
                fontSize: { base: "sm", md: "md" },
                "& code": {
                  bg: "transparent",
                  color: "inherit",
                  p: 0,
                },
              },
              "& img": {
                maxW: "full",
                h: "auto",
                borderRadius: "16px",
                mb: 8,
                boxShadow: "xl",
                border: "1px solid",
                borderColor: themeStyles.borderColor,
              },
              "& table": {
                w: "full",
                borderCollapse: "collapse",
                mb: 8,
                bg: theme === "Dark" ? "gray.800" : "white",
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "lg",
                fontSize: { base: "sm", md: "md" },
              },
              "& th, & td": {
                border: "1px solid",
                borderColor: themeStyles.borderColor,
                px: 6,
                py: 4,
                textAlign: "left",
              },
              "& th": {
                bg: theme === "Dark" ? "gray.700" : "gray.100",
                fontWeight: "bold",
                color: themeStyles.accent,
              },
              "& a": {
                color: themeStyles.accent,
                textDecoration: "underline",
                fontWeight: "medium",
                _hover: {
                  color: themeStyles.accent,
                  textDecoration: "none",
                  bg: theme === "Dark" ? "gray.800" : "gray.100",
                  px: 2,
                  py: 1,
                  borderRadius: "6px",
                },
                transition: "all 0.2s",
              },
              "& hr": {
                border: "none",
                borderTop: "3px solid",
                borderColor: themeStyles.borderColor,
                my: 12,
              },
              "& strong": {
                fontWeight: "bold",
                color: themeStyles.accent,
              },
              "& em": {
                fontStyle: "italic",
                color: theme === "Dark" ? "gray.300" : "gray.600",
              },
            }}
          >
            <div dangerouslySetInnerHTML={{ __html: content }} />
          </Box>
        ) : (
          <VStack py={24} spacing={6} textAlign="center" color="gray.500">
            <Box fontSize="6xl">📝</Box>
            <Text fontSize="2xl" fontWeight="bold">
              This K-Dom is waiting for content
            </Text>
            <Text fontSize="lg" maxW="lg" lineHeight="tall">
              This page hasn't been written yet. Be the first to contribute and
              help build this K-Dom!
            </Text>
          </VStack>
        )}
      </CardBody>
    </Card>
  );
}
