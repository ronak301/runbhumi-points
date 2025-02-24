import {
    Box,
    Button,
    FormControl,
    FormLabel,
    HStack,
    Image,
    Input,
    Tag,
    TagCloseButton,
    TagLabel,
    Textarea,
    useToast,
} from "@chakra-ui/react";
import { Editor } from "@tinymce/tinymce-react";
import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { db, storage } from "../../firebase";

interface Blog {
  title: string;
  slug: string;
  image: string;
  author: string;
  datePublished: string;
  category: string;
  tags: string[];
  keywords: string[];
  metaTitle: string;
  metaDescription: string;
  content: string;
}

const BlogEditor: React.FC = () => {
  const { id } = useParams<{ id?: string }>(); // Get blog ID from URL
  const navigate = useNavigate();
  const toast = useToast();
  const editorRef = useRef<any>(null);

  const [formData, setFormData] = useState<Blog>({
    title: "",
    slug: "",
    image: "",
    author: "Admin",
    datePublished: new Date().toISOString().split("T")[0],
    category: "",
    tags: [],
    keywords: [],
    metaTitle: "",
    metaDescription: "",
    content: "",
  });

  const [loading, setLoading] = useState(true);
  const [tagInput, setTagInput] = useState("");
  const [keywordInput, setKeywordInput] = useState("");

  // 🔹 Fetch existing blog if id is present
  useEffect(() => {
    const fetchBlog = async () => {
      if (id) {
        try {
          const blogRef = doc(db, "blogs", id);
          const blogSnap = await getDoc(blogRef);
          if (blogSnap.exists()) {
            setFormData(blogSnap.data() as Blog);
          } else {
            toast({
              title: "Blog Not Found",
              description: "The blog you are trying to edit does not exist.",
              status: "error",
              duration: 3000,
              isClosable: true,
            });
            navigate("/admin/blogs");
          }
        } catch (error) {
          console.error("Error fetching blog:", error);
        }
      }
      setLoading(false);
    };

    fetchBlog();
  }, [id, navigate, toast]);

  // 🔹 Handle input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 Handle Image Upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    const storageRef = ref(storage, `blog_images/${uuidv4()}`);
    await uploadBytes(storageRef, file);
    const imageUrl = await getDownloadURL(storageRef);
    setFormData((prev) => ({ ...prev, image: imageUrl }));
  };

  // 🔹 Handle Save (Create or Update)
  const handleSave = async () => {
    const content = editorRef.current ? editorRef.current.getContent() : "";
    const updatedData = { ...formData, content };

    try {
      if (id) {
        await updateDoc(doc(db, "blogs", id), updatedData);
      } else {
        await addDoc(collection(db, "blogs"), updatedData);
      }

      toast({
        title: id ? "Blog Updated" : "Blog Created",
        description: "Your blog has been saved successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      navigate("/admin/blogs");
    } catch (error) {
      console.error("Error saving blog:", error);
      toast({
        title: "Error",
        description: "Something went wrong while saving the blog.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (loading) return <Box p={8}>Loading...</Box>;

  return (
    <Box p={8} maxW="800px" mx="auto">
      <FormControl>
        <FormLabel>Title</FormLabel>
        <Input name="title" value={formData.title} onChange={handleChange} />
      </FormControl>

      <FormControl mt={4}>
        <FormLabel>Slug</FormLabel>
        <Input name="slug" value={formData.slug} onChange={handleChange} />
      </FormControl>

      <FormControl mt={4}>
        <FormLabel>Author</FormLabel>
        <Input name="author" value={formData.author} onChange={handleChange} />
      </FormControl>

      <FormControl mt={4}>
        <FormLabel>Category</FormLabel>
        <Input
          name="category"
          value={formData.category}
          onChange={handleChange}
        />
      </FormControl>

      <FormControl mt={4}>
        <FormLabel>Tags</FormLabel>
        <HStack>
          <Input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
          />
          <Button
            onClick={() =>
              setFormData((prev) => ({
                ...prev,
                tags: [...prev.tags, tagInput],
              }))
            }>
            Add
          </Button>
        </HStack>
        <HStack mt={2}>
          {formData.tags.map((tag, index) => (
            <Tag key={index} size="md" colorScheme="blue">
              <TagLabel>{tag}</TagLabel>
              <TagCloseButton
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    tags: prev.tags.filter((t) => t !== tag),
                  }))
                }
              />
            </Tag>
          ))}
        </HStack>
      </FormControl>

      <FormControl mt={4}>
        <FormLabel>Meta Description</FormLabel>
        <Textarea
          name="metaDescription"
          value={formData.metaDescription}
          onChange={handleChange}
        />
      </FormControl>

      <FormControl mt={4}>
        <FormLabel>Image</FormLabel>
        <Input type="file" onChange={handleImageUpload} />
        {formData.image && (
          <Image src={formData.image} alt="Blog" width="150px" mt={2} />
        )}
      </FormControl>

      <FormControl mt={4}>
        <FormLabel>Content</FormLabel>
        <Editor
          apiKey="hpjuw4h19yrr6qhp6g7or9f5rubbh2wfp8k6m5r76xw8rqn9"
          onInit={(_, editor) => (editorRef.current = editor)}
          initialValue={formData.content}
        />
      </FormControl>

      <Button mt={6} colorScheme="blue" onClick={handleSave}>
        {id ? "Update Blog" : "Create Blog"}
      </Button>
    </Box>
  );
};

export default BlogEditor;
