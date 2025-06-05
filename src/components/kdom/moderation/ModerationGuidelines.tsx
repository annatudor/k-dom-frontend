import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Card,
  CardBody,
  CardHeader,
  Alert,
  AlertIcon,
  Badge,
  SimpleGrid,
  List,
  ListItem,
  ListIcon,
  Button,
  useColorModeValue,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Icon,
} from "@chakra-ui/react";
import {
  FiCheck,
  FiX,
  FiAlertTriangle,
  FiInfo,
  FiClock,
  FiShield,
  FiBook,
  FiUsers,
  FiTarget,
  FiStar,
  FiHeart,
  FiZap,
} from "react-icons/fi";

export default function ModerationGuidelines() {
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");

  return (
    <Box bg={bgColor} minH="100vh" py={8}>
      <Container maxW="6xl">
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <Box textAlign="center">
            <Heading size="2xl" mb={4} color="blue.600">
              Community Guidelines & Moderation Policy
            </Heading>
            <Text fontSize="xl" color="gray.600" maxW="3xl" mx="auto">
              Learn about our content standards, moderation process, and how to
              create K-DOMs that add value to our community.
            </Text>
          </Box>

          {/* Quick Overview Cards */}
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
            <Card bg={cardBg} borderLeft="4px solid" borderColor="green.400">
              <CardBody>
                <VStack align="start" spacing={3}>
                  <HStack>
                    <Icon as={FiCheck} color="green.500" boxSize={6} />
                    <Heading size="md" color="green.600">
                      Quality Content
                    </Heading>
                  </HStack>
                  <Text fontSize="sm" color="gray.600">
                    Create original, well-structured content that provides value
                    to our community.
                  </Text>
                  <Badge colorScheme="green" variant="subtle">
                    ✓ Gets Approved
                  </Badge>
                </VStack>
              </CardBody>
            </Card>

            <Card bg={cardBg} borderLeft="4px solid" borderColor="yellow.400">
              <CardBody>
                <VStack align="start" spacing={3}>
                  <HStack>
                    <Icon as={FiClock} color="yellow.500" boxSize={6} />
                    <Heading size="md" color="yellow.600">
                      Fast Review
                    </Heading>
                  </HStack>
                  <Text fontSize="sm" color="gray.600">
                    Most submissions are reviewed within 1-3 business days by
                    our moderation team.
                  </Text>
                  <Badge colorScheme="yellow" variant="subtle">
                    ⏱️ 1-3 Days
                  </Badge>
                </VStack>
              </CardBody>
            </Card>

            <Card bg={cardBg} borderLeft="4px solid" borderColor="blue.400">
              <CardBody>
                <VStack align="start" spacing={3}>
                  <HStack>
                    <Icon as={FiShield} color="blue.500" boxSize={6} />
                    <Heading size="md" color="blue.600">
                      Fair Process
                    </Heading>
                  </HStack>
                  <Text fontSize="sm" color="gray.600">
                    Transparent moderation with clear feedback and opportunities
                    to improve.
                  </Text>
                  <Badge colorScheme="blue" variant="subtle">
                    🛡️ Transparent
                  </Badge>
                </VStack>
              </CardBody>
            </Card>
          </SimpleGrid>

          {/* Content Standards */}
          <Card bg={cardBg}>
            <CardHeader>
              <Heading size="lg" display="flex" alignItems="center" gap={3}>
                <Icon as={FiStar} color="yellow.500" />
                Content Standards
              </Heading>
            </CardHeader>
            <CardBody>
              <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
                {/* What We Look For */}
                <VStack align="stretch" spacing={4}>
                  <Heading
                    size="md"
                    color="green.600"
                    display="flex"
                    alignItems="center"
                    gap={2}
                  >
                    <FiCheck />
                    What We Look For
                  </Heading>

                  <List spacing={3}>
                    <ListItem>
                      <ListIcon as={FiCheck} color="green.500" />
                      <Text as="span" fontWeight="medium">
                        Original Content:
                      </Text>{" "}
                      Unique knowledge, experiences, or creative work
                    </ListItem>
                    <ListItem>
                      <ListIcon as={FiCheck} color="green.500" />
                      <Text as="span" fontWeight="medium">
                        Clear Structure:
                      </Text>{" "}
                      Well-organized with proper headings and formatting
                    </ListItem>
                    <ListItem>
                      <ListIcon as={FiCheck} color="green.500" />
                      <Text as="span" fontWeight="medium">
                        Accurate Metadata:
                      </Text>{" "}
                      Correct title, description, hub, and language
                    </ListItem>
                    <ListItem>
                      <ListIcon as={FiCheck} color="green.500" />
                      <Text as="span" fontWeight="medium">
                        Community Value:
                      </Text>{" "}
                      Helpful, educational, or entertaining content
                    </ListItem>
                    <ListItem>
                      <ListIcon as={FiCheck} color="green.500" />
                      <Text as="span" fontWeight="medium">
                        Appropriate Length:
                      </Text>{" "}
                      Substantial content that justifies a K-DOM
                    </ListItem>
                    <ListItem>
                      <ListIcon as={FiCheck} color="green.500" />
                      <Text as="span" fontWeight="medium">
                        Proper Citations:
                      </Text>{" "}
                      Credit sources and respect intellectual property
                    </ListItem>
                  </List>
                </VStack>

                {/* What We Reject */}
                <VStack align="stretch" spacing={4}>
                  <Heading
                    size="md"
                    color="red.600"
                    display="flex"
                    alignItems="center"
                    gap={2}
                  >
                    <FiX />
                    Common Rejection Reasons
                  </Heading>

                  <List spacing={3}>
                    <ListItem>
                      <ListIcon as={FiX} color="red.500" />
                      <Text as="span" fontWeight="medium">
                        Duplicate Content:
                      </Text>{" "}
                      Already exists or too similar to existing K-DOMs
                    </ListItem>
                    <ListItem>
                      <ListIcon as={FiX} color="red.500" />
                      <Text as="span" fontWeight="medium">
                        Low Quality:
                      </Text>{" "}
                      Minimal content, poor formatting, or errors
                    </ListItem>
                    <ListItem>
                      <ListIcon as={FiX} color="red.500" />
                      <Text as="span" fontWeight="medium">
                        Inappropriate Content:
                      </Text>{" "}
                      Violates community standards or contains harmful material
                    </ListItem>
                    <ListItem>
                      <ListIcon as={FiX} color="red.500" />
                      <Text as="span" fontWeight="medium">
                        Misleading Information:
                      </Text>{" "}
                      Incorrect metadata or false claims
                    </ListItem>
                    <ListItem>
                      <ListIcon as={FiX} color="red.500" />
                      <Text as="span" fontWeight="medium">
                        Copyright Issues:
                      </Text>{" "}
                      Unauthorized use of copyrighted material
                    </ListItem>
                    <ListItem>
                      <ListIcon as={FiX} color="red.500" />
                      <Text as="span" fontWeight="medium">
                        Spam or Self-Promotion:
                      </Text>{" "}
                      Excessive promotion without substantial content
                    </ListItem>
                  </List>
                </VStack>
              </SimpleGrid>
            </CardBody>
          </Card>

          {/* Moderation Process */}
          <Card bg={cardBg}>
            <CardHeader>
              <Heading size="lg" display="flex" alignItems="center" gap={3}>
                <Icon as={FiTarget} color="blue.500" />
                Moderation Process
              </Heading>
            </CardHeader>
            <CardBody>
              <VStack spacing={6} align="stretch">
                <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4}>
                  <VStack
                    align="center"
                    spacing={3}
                    p={4}
                    bg="blue.50"
                    borderRadius="lg"
                  >
                    <Icon as={FiZap} color="blue.500" boxSize={8} />
                    <Text fontWeight="bold" textAlign="center">
                      1. Submission
                    </Text>
                    <Text fontSize="sm" textAlign="center" color="gray.600">
                      Your K-DOM is submitted and enters the moderation queue
                    </Text>
                  </VStack>

                  <VStack
                    align="center"
                    spacing={3}
                    p={4}
                    bg="yellow.50"
                    borderRadius="lg"
                  >
                    <Icon as={FiClock} color="yellow.500" boxSize={8} />
                    <Text fontWeight="bold" textAlign="center">
                      2. Review
                    </Text>
                    <Text fontSize="sm" textAlign="center" color="gray.600">
                      Moderators review content quality, originality, and
                      compliance
                    </Text>
                  </VStack>

                  <VStack
                    align="center"
                    spacing={3}
                    p={4}
                    bg="purple.50"
                    borderRadius="lg"
                  >
                    <Icon as={FiUsers} color="purple.500" boxSize={8} />
                    <Text fontWeight="bold" textAlign="center">
                      3. Decision
                    </Text>
                    <Text fontSize="sm" textAlign="center" color="gray.600">
                      Approve, reject with feedback, or request improvements
                    </Text>
                  </VStack>

                  <VStack
                    align="center"
                    spacing={3}
                    p={4}
                    bg="green.50"
                    borderRadius="lg"
                  >
                    <Icon as={FiHeart} color="green.500" boxSize={8} />
                    <Text fontWeight="bold" textAlign="center">
                      4. Notification
                    </Text>
                    <Text fontSize="sm" textAlign="center" color="gray.600">
                      You receive email notification with detailed feedback
                    </Text>
                  </VStack>
                </SimpleGrid>

                <Alert status="info" borderRadius="lg">
                  <AlertIcon />
                  <VStack align="start" spacing={1}>
                    <Text fontWeight="bold">Review Timeline</Text>
                    <Text fontSize="sm">
                      Most K-DOMs are reviewed within 1-3 business days. Complex
                      submissions or those requiring additional review may take
                      longer. We'll keep you updated on any delays.
                    </Text>
                  </VStack>
                </Alert>
              </VStack>
            </CardBody>
          </Card>

          {/* Detailed Guidelines */}
          <Card bg={cardBg}>
            <CardHeader>
              <Heading size="lg" display="flex" alignItems="center" gap={3}>
                <Icon as={FiBook} color="purple.500" />
                Detailed Guidelines
              </Heading>
            </CardHeader>
            <CardBody>
              <Accordion allowMultiple>
                <AccordionItem>
                  <AccordionButton>
                    <Box flex="1" textAlign="left">
                      <Heading size="md">Content Quality Requirements</Heading>
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel pb={4}>
                    <VStack align="stretch" spacing={4}>
                      <Text>
                        Your K-DOM should meet these quality standards:
                      </Text>
                      <List spacing={2}>
                        <ListItem>
                          <ListIcon as={FiCheck} color="green.500" />
                          <Text as="span" fontWeight="medium">
                            Minimum Length:
                          </Text>{" "}
                          At least 200 words of meaningful content
                        </ListItem>
                        <ListItem>
                          <ListIcon as={FiCheck} color="green.500" />
                          <Text as="span" fontWeight="medium">
                            Clear Purpose:
                          </Text>{" "}
                          Serves a specific educational, informational, or
                          creative purpose
                        </ListItem>
                        <ListItem>
                          <ListIcon as={FiCheck} color="green.500" />
                          <Text as="span" fontWeight="medium">
                            Proper Grammar:
                          </Text>{" "}
                          Well-written with minimal spelling/grammar errors
                        </ListItem>
                        <ListItem>
                          <ListIcon as={FiCheck} color="green.500" />
                          <Text as="span" fontWeight="medium">
                            Logical Structure:
                          </Text>{" "}
                          Organized with appropriate headings and flow
                        </ListItem>
                      </List>
                    </VStack>
                  </AccordionPanel>
                </AccordionItem>

                <AccordionItem>
                  <AccordionButton>
                    <Box flex="1" textAlign="left">
                      <Heading size="md">Originality and Attribution</Heading>
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel pb={4}>
                    <VStack align="stretch" spacing={4}>
                      <Text>
                        We value original content and proper attribution:
                      </Text>
                      <List spacing={2}>
                        <ListItem>
                          <ListIcon as={FiCheck} color="green.500" />
                          Content must be your original work or properly
                          attributed
                        </ListItem>
                        <ListItem>
                          <ListIcon as={FiCheck} color="green.500" />
                          Quotes and references must be clearly marked and
                          sourced
                        </ListItem>
                        <ListItem>
                          <ListIcon as={FiX} color="red.500" />
                          Don't copy entire articles or substantial portions
                          without permission
                        </ListItem>
                        <ListItem>
                          <ListIcon as={FiCheck} color="green.500" />
                          Compilations are OK if you add significant original
                          commentary
                        </ListItem>
                      </List>
                    </VStack>
                  </AccordionPanel>
                </AccordionItem>

                <AccordionItem>
                  <AccordionButton>
                    <Box flex="1" textAlign="left">
                      <Heading size="md">Community Standards</Heading>
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel pb={4}>
                    <VStack align="stretch" spacing={4}>
                      <Text>
                        Content must be appropriate for our diverse community:
                      </Text>
                      <List spacing={2}>
                        <ListItem>
                          <ListIcon as={FiX} color="red.500" />
                          No hate speech, harassment, or discriminatory content
                        </ListItem>
                        <ListItem>
                          <ListIcon as={FiX} color="red.500" />
                          No explicit adult content (unless in appropriate
                          educational context)
                        </ListItem>
                        <ListItem>
                          <ListIcon as={FiX} color="red.500" />
                          No promotion of illegal activities or harmful behavior
                        </ListItem>
                        <ListItem>
                          <ListIcon as={FiCheck} color="green.500" />
                          Mark content appropriately if intended for mature
                          audiences
                        </ListItem>
                        <ListItem>
                          <ListIcon as={FiCheck} color="green.500" />
                          Use the "For Kids" flag appropriately for child-safe
                          content
                        </ListItem>
                      </List>
                    </VStack>
                  </AccordionPanel>
                </AccordionItem>

                <AccordionItem>
                  <AccordionButton>
                    <Box flex="1" textAlign="left">
                      <Heading size="md">Metadata and Organization</Heading>
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel pb={4}>
                    <VStack align="stretch" spacing={4}>
                      <Text>
                        Accurate metadata helps users find and understand your
                        content:
                      </Text>
                      <List spacing={2}>
                        <ListItem>
                          <ListIcon as={FiCheck} color="green.500" />
                          <Text as="span" fontWeight="medium">
                            Title:
                          </Text>{" "}
                          Clear, descriptive, and unique
                        </ListItem>
                        <ListItem>
                          <ListIcon as={FiCheck} color="green.500" />
                          <Text as="span" fontWeight="medium">
                            Description:
                          </Text>{" "}
                          Accurate summary of content and purpose
                        </ListItem>
                        <ListItem>
                          <ListIcon as={FiCheck} color="green.500" />
                          <Text as="span" fontWeight="medium">
                            Hub:
                          </Text>{" "}
                          Choose the most relevant category
                        </ListItem>
                        <ListItem>
                          <ListIcon as={FiCheck} color="green.500" />
                          <Text as="span" fontWeight="medium">
                            Language:
                          </Text>{" "}
                          Must match the primary language of your content
                        </ListItem>
                        <ListItem>
                          <ListIcon as={FiCheck} color="green.500" />
                          <Text as="span" fontWeight="medium">
                            Parent K-DOM:
                          </Text>{" "}
                          Use for sub-pages only when there's a clear hierarchy
                        </ListItem>
                      </List>
                    </VStack>
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
            </CardBody>
          </Card>

          {/* Tips for Success */}
          <Card bg={cardBg} borderLeft="4px solid" borderColor="green.400">
            <CardHeader>
              <Heading
                size="lg"
                color="green.600"
                display="flex"
                alignItems="center"
                gap={3}
              >
                <Icon as={FiStar} />
                Tips for Faster Approval
              </Heading>
            </CardHeader>
            <CardBody>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                <VStack align="stretch" spacing={3}>
                  <Text fontWeight="bold" color="blue.600">
                    Writing Quality Content
                  </Text>
                  <List spacing={2} fontSize="sm">
                    <ListItem>Start with a clear introduction</ListItem>
                    <ListItem>Use headings to organize sections</ListItem>
                    <ListItem>
                      Include examples or practical applications
                    </ListItem>
                    <ListItem>End with a conclusion or summary</ListItem>
                    <ListItem>Add value that doesn't exist elsewhere</ListItem>
                  </List>
                </VStack>
              </SimpleGrid>
            </CardBody>
          </Card>

          {/* If Rejected */}
          <Card bg={cardBg} borderLeft="4px solid" borderColor="orange.400">
            <CardHeader>
              <Heading
                size="lg"
                color="orange.600"
                display="flex"
                alignItems="center"
                gap={3}
              >
                <Icon as={FiAlertTriangle} />
                If Your K-DOM is Rejected
              </Heading>
            </CardHeader>
            <CardBody>
              <VStack align="stretch" spacing={4}>
                <Text>
                  Don't be discouraged! Rejection is part of maintaining quality
                  standards. Here's how to improve and resubmit:
                </Text>

                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                  <VStack
                    align="start"
                    spacing={3}
                    p={4}
                    bg="orange.50"
                    borderRadius="lg"
                  >
                    <Icon as={FiBook} color="orange.500" boxSize={6} />
                    <Text fontWeight="bold">1. Review Feedback</Text>
                    <Text fontSize="sm" color="gray.600">
                      Carefully read the rejection reason provided by our
                      moderators.
                    </Text>
                  </VStack>

                  <VStack
                    align="start"
                    spacing={3}
                    p={4}
                    bg="blue.50"
                    borderRadius="lg"
                  >
                    <Icon as={FiTarget} color="blue.500" boxSize={6} />
                    <Text fontWeight="bold">2. Make Improvements</Text>
                    <Text fontSize="sm" color="gray.600">
                      Address the specific issues mentioned in the feedback.
                    </Text>
                  </VStack>

                  <VStack
                    align="start"
                    spacing={3}
                    p={4}
                    bg="green.50"
                    borderRadius="lg"
                  >
                    <Icon as={FiCheck} color="green.500" boxSize={6} />
                    <Text fontWeight="bold">3. Resubmit</Text>
                    <Text fontSize="sm" color="gray.600">
                      Once improved, you can resubmit your K-DOM for another
                      review.
                    </Text>
                  </VStack>
                </SimpleGrid>

                <Alert status="info" borderRadius="lg">
                  <AlertIcon />
                  <VStack align="start" spacing={1}>
                    <Text fontWeight="bold">Multiple Submissions Welcome</Text>
                    <Text fontSize="sm">
                      There's no limit to how many times you can improve and
                      resubmit. We appreciate authors who take feedback
                      seriously and work to improve their content.
                    </Text>
                  </VStack>
                </Alert>
              </VStack>
            </CardBody>
          </Card>

          {/* Appeals Process */}
          <Card bg={cardBg}>
            <CardHeader>
              <Heading size="lg" display="flex" alignItems="center" gap={3}>
                <Icon as={FiShield} color="purple.500" />
                Appeals & Questions
              </Heading>
            </CardHeader>
            <CardBody>
              <VStack align="stretch" spacing={4}>
                <Text>
                  If you believe your K-DOM was rejected in error or have
                  questions about our policies:
                </Text>

                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                  <VStack align="stretch" spacing={3}>
                    <Heading size="md" color="purple.600">
                      Appeal Process
                    </Heading>
                    <List spacing={2} fontSize="sm">
                      <ListItem>
                        <ListIcon as={FiCheck} color="green.500" />
                        Contact our moderation team within 30 days
                      </ListItem>
                      <ListItem>
                        <ListIcon as={FiCheck} color="green.500" />
                        Provide specific reasons why you disagree
                      </ListItem>
                      <ListItem>
                        <ListIcon as={FiCheck} color="green.500" />
                        Include any additional context or clarifications
                      </ListItem>
                      <ListItem>
                        <ListIcon as={FiCheck} color="green.500" />
                        We'll review your appeal within 5 business days
                      </ListItem>
                    </List>
                  </VStack>

                  <VStack align="stretch" spacing={3}>
                    <Heading size="md" color="blue.600">
                      Getting Help
                    </Heading>
                    <List spacing={2} fontSize="sm">
                      <ListItem>
                        <ListIcon as={FiCheck} color="green.500" />
                        Check our FAQ for common questions
                      </ListItem>
                      <ListItem>
                        <ListIcon as={FiCheck} color="green.500" />
                        Join our community forums for advice
                      </ListItem>
                      <ListItem>
                        <ListIcon as={FiCheck} color="green.500" />
                        Contact support for technical issues
                      </ListItem>
                      <ListItem>
                        <ListIcon as={FiCheck} color="green.500" />
                        Follow our blog for policy updates
                      </ListItem>
                    </List>
                  </VStack>
                </SimpleGrid>

                <HStack spacing={4} pt={4}>
                  <Button colorScheme="purple" variant="outline">
                    Contact Moderation Team
                  </Button>
                  <Button colorScheme="blue" variant="outline">
                    View FAQ
                  </Button>
                  <Button variant="ghost">Community Forums</Button>
                </HStack>
              </VStack>
            </CardBody>
          </Card>

          {/* Policy Updates */}
          <Card bg={cardBg}>
            <CardHeader>
              <Heading size="lg" display="flex" alignItems="center" gap={3}>
                <Icon as={FiInfo} color="gray.500" />
                Policy Updates & Transparency
              </Heading>
            </CardHeader>
            <CardBody>
              <VStack align="stretch" spacing={4}>
                <Text>
                  Our guidelines evolve with our community. Here's how we keep
                  you informed:
                </Text>

                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                  <VStack align="start" spacing={3}>
                    <Text fontWeight="bold" color="blue.600">
                      When Policies Change
                    </Text>
                    <List spacing={2} fontSize="sm">
                      <ListItem>Email notifications to all creators</ListItem>
                      <ListItem>Announcements on our community forums</ListItem>
                      <ListItem>Grace period for existing content</ListItem>
                      <ListItem>Clear explanations of changes</ListItem>
                    </List>
                  </VStack>

                  <VStack align="start" spacing={3}>
                    <Text fontWeight="bold" color="green.600">
                      Community Input
                    </Text>
                    <List spacing={2} fontSize="sm">
                      <ListItem>
                        Public comment periods for major changes
                      </ListItem>
                      <ListItem>
                        Regular surveys and feedback collection
                      </ListItem>
                      <ListItem>Moderator office hours for questions</ListItem>
                      <ListItem>
                        Transparent reporting on moderation metrics
                      </ListItem>
                    </List>
                  </VStack>
                </SimpleGrid>

                <Alert status="success" borderRadius="lg">
                  <AlertIcon />
                  <VStack align="start" spacing={1}>
                    <Text fontWeight="bold">Current Version: 2.1</Text>
                    <Text fontSize="sm">
                      Last updated: March 2024. Next review scheduled for June
                      2024.
                      <Text
                        as="span"
                        color="blue.500"
                        cursor="pointer"
                        textDecoration="underline"
                      >
                        View changelog
                      </Text>
                    </Text>
                  </VStack>
                </Alert>
              </VStack>
            </CardBody>
          </Card>

          {/* Call to Action */}
          <Card bg="blue.600" color="white" textAlign="center">
            <CardBody py={8}>
              <VStack spacing={4}>
                <Heading size="lg">Ready to Create Amazing K-DOMs?</Heading>
                <Text fontSize="lg" maxW="2xl">
                  Now that you understand our guidelines, you're ready to create
                  content that will delight our community and get approved
                  quickly.
                </Text>
                <HStack spacing={4}>
                  <Button
                    size="lg"
                    colorScheme="white"
                    variant="solid"
                    color="blue.600"
                  >
                    Start Creating
                  </Button>
                  <Button size="lg" variant="outline" colorScheme="white">
                    View Examples
                  </Button>
                </HStack>
              </VStack>
            </CardBody>
          </Card>

          {/* Footer Info */}
          <Box textAlign="center" py={4}>
            <Text fontSize="sm" color="gray.500">
              Questions about these guidelines?
              <Text as="span" color="blue.500" cursor="pointer" ml={1}>
                Contact our moderation team
              </Text>
            </Text>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}
