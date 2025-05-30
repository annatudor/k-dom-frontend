// src/components/editor/EditorToolbar.tsx
import {
  HStack,
  IconButton,
  Divider,
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Grid,
  Box,
  Input,
  VStack,
  Text,
  Select,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  FiBold,
  FiItalic,
  FiCode,
  FiLink,
  FiImage,
  FiList,
  FiType,
  FiTable,
} from "react-icons/fi";
import { Editor } from "@tiptap/react";
import { useState, useCallback } from "react";

interface EditorToolbarProps {
  editor: Editor;
}

export function EditorToolbar({ editor }: EditorToolbarProps) {
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [showImageInput, setShowImageInput] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const bgColor = useColorModeValue("gray.50", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const setLink = useCallback(() => {
    if (linkUrl) {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: linkUrl })
        .run();
      setLinkUrl("");
      setShowLinkInput(false);
    }
  }, [editor, linkUrl]);

  const addImage = useCallback(() => {
    if (imageUrl) {
      editor.chain().focus().setImage({ src: imageUrl }).run();
      setImageUrl("");
      setShowImageInput(false);
    }
  }, [editor, imageUrl]);

  const addTable = useCallback(() => {
    editor
      .chain()
      .focus()
      .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
      .run();
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <Box
      bg={bgColor}
      borderBottomWidth="1px"
      borderColor={borderColor}
      p={2}
      overflowX="auto"
    >
      <HStack spacing={1} flexWrap="wrap">
        {/* Text Formatting */}
        <HStack spacing={1}>
          <IconButton
            aria-label="Bold"
            icon={<FiBold />}
            size="sm"
            variant={editor.isActive("bold") ? "solid" : "ghost"}
            onClick={() => editor.chain().focus().toggleBold().run()}
            colorScheme={editor.isActive("bold") ? "blue" : undefined}
          />
          <IconButton
            aria-label="Italic"
            icon={<FiItalic />}
            size="sm"
            variant={editor.isActive("italic") ? "solid" : "ghost"}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            colorScheme={editor.isActive("italic") ? "blue" : undefined}
          />
          <IconButton
            aria-label="Code"
            icon={<FiCode />}
            size="sm"
            variant={editor.isActive("code") ? "solid" : "ghost"}
            onClick={() => editor.chain().focus().toggleCode().run()}
            colorScheme={editor.isActive("code") ? "blue" : undefined}
          />
        </HStack>

        <Divider orientation="vertical" height="30px" />

        {/* Headings */}
        <HStack spacing={1}>
          <Select
            size="sm"
            value={
              editor.isActive("heading", { level: 1 })
                ? "h1"
                : editor.isActive("heading", { level: 2 })
                ? "h2"
                : editor.isActive("heading", { level: 3 })
                ? "h3"
                : editor.isActive("heading", { level: 4 })
                ? "h4"
                : editor.isActive("heading", { level: 5 })
                ? "h5"
                : editor.isActive("heading", { level: 6 })
                ? "h6"
                : "paragraph"
            }
            onChange={(e) => {
              const value = e.target.value;
              if (value === "paragraph") {
                editor.chain().focus().setParagraph().run();
              } else {
                const level = parseInt(value.replace("h", "")) as
                  | 1
                  | 2
                  | 3
                  | 4
                  | 5
                  | 6;
                editor.chain().focus().toggleHeading({ level }).run();
              }
            }}
            w="120px"
          >
            <option value="paragraph">Paragraph</option>
            <option value="h1">Heading 1</option>
            <option value="h2">Heading 2</option>
            <option value="h3">Heading 3</option>
            <option value="h4">Heading 4</option>
            <option value="h5">Heading 5</option>
            <option value="h6">Heading 6</option>
          </Select>
        </HStack>

        <Divider orientation="vertical" height="30px" />

        {/* Lists */}
        <HStack spacing={1}>
          <IconButton
            aria-label="Bullet List"
            icon={<FiList />}
            size="sm"
            variant={editor.isActive("bulletList") ? "solid" : "ghost"}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            colorScheme={editor.isActive("bulletList") ? "blue" : undefined}
          />
          <Button
            size="sm"
            variant={editor.isActive("orderedList") ? "solid" : "ghost"}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            colorScheme={editor.isActive("orderedList") ? "blue" : undefined}
          >
            1.
          </Button>
          <Button
            size="sm"
            variant={editor.isActive("taskList") ? "solid" : "ghost"}
            onClick={() => editor.chain().focus().toggleTaskList().run()}
            colorScheme={editor.isActive("taskList") ? "blue" : undefined}
          >
            ☐
          </Button>
        </HStack>

        <Divider orientation="vertical" height="30px" />

        {/* Text Color */}
        <HStack spacing={1}>
          <Popover>
            <PopoverTrigger>
              <IconButton
                aria-label="Text Color"
                icon={<FiType />}
                size="sm"
                variant="ghost"
              />
            </PopoverTrigger>
            <PopoverContent w="200px">
              <PopoverBody>
                <Text fontSize="sm" fontWeight="semibold" mb={2}>
                  Text Color
                </Text>
                <Grid templateColumns="repeat(6, 1fr)" gap={1}>
                  {[
                    "#000000",
                    "#666666",
                    "#999999",
                    "#CCCCCC",
                    "#FF0000",
                    "#FF9900",
                    "#FFFF00",
                    "#00FF00",
                    "#00FFFF",
                    "#0000FF",
                    "#9900FF",
                    "#FF00FF",
                  ].map((color) => (
                    <Box
                      key={color}
                      w="25px"
                      h="25px"
                      bg={color}
                      borderRadius="md"
                      cursor="pointer"
                      border="1px solid"
                      borderColor="gray.200"
                      onClick={() =>
                        editor.chain().focus().setColor(color).run()
                      }
                    />
                  ))}
                </Grid>
              </PopoverBody>
            </PopoverContent>
          </Popover>

          <Button
            size="sm"
            variant={editor.isActive("highlight") ? "solid" : "ghost"}
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            colorScheme={editor.isActive("highlight") ? "yellow" : undefined}
          >
            Highlight
          </Button>
        </HStack>

        <Divider orientation="vertical" height="30px" />

        {/* Links and Media */}
        <HStack spacing={1}>
          <Popover
            isOpen={showLinkInput}
            onClose={() => setShowLinkInput(false)}
          >
            <PopoverTrigger>
              <IconButton
                aria-label="Add Link"
                icon={<FiLink />}
                size="sm"
                variant="ghost"
                onClick={() => setShowLinkInput(!showLinkInput)}
              />
            </PopoverTrigger>
            <PopoverContent>
              <PopoverBody>
                <VStack spacing={2}>
                  <Text fontSize="sm" fontWeight="semibold">
                    Add Link
                  </Text>
                  <Input
                    placeholder="Enter URL"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    size="sm"
                  />
                  <HStack spacing={2}>
                    <Button size="sm" onClick={setLink} colorScheme="blue">
                      Add
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => setShowLinkInput(false)}
                      variant="ghost"
                    >
                      Cancel
                    </Button>
                  </HStack>
                </VStack>
              </PopoverBody>
            </PopoverContent>
          </Popover>

          <Popover
            isOpen={showImageInput}
            onClose={() => setShowImageInput(false)}
          >
            <PopoverTrigger>
              <IconButton
                aria-label="Add Image"
                icon={<FiImage />}
                size="sm"
                variant="ghost"
                onClick={() => setShowImageInput(!showImageInput)}
              />
            </PopoverTrigger>
            <PopoverContent>
              <PopoverBody>
                <VStack spacing={2}>
                  <Text fontSize="sm" fontWeight="semibold">
                    Add Image
                  </Text>
                  <Input
                    placeholder="Enter image URL"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    size="sm"
                  />
                  <HStack spacing={2}>
                    <Button size="sm" onClick={addImage} colorScheme="blue">
                      Add
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => setShowImageInput(false)}
                      variant="ghost"
                    >
                      Cancel
                    </Button>
                  </HStack>
                </VStack>
              </PopoverBody>
            </PopoverContent>
          </Popover>

          <IconButton
            aria-label="Add Table"
            icon={<FiTable />}
            size="sm"
            variant="ghost"
            onClick={addTable}
          />
        </HStack>

        <Divider orientation="vertical" height="30px" />

        {/* Block Formatting */}
        <HStack spacing={1}>
          <Button
            size="sm"
            variant={editor.isActive("blockquote") ? "solid" : "ghost"}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            colorScheme={editor.isActive("blockquote") ? "blue" : undefined}
          >
            Quote
          </Button>
          <Button
            size="sm"
            variant={editor.isActive("codeBlock") ? "solid" : "ghost"}
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            colorScheme={editor.isActive("codeBlock") ? "blue" : undefined}
          >
            Code Block
          </Button>
        </HStack>
      </HStack>
    </Box>
  );
}
