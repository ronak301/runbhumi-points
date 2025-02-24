import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";
import { collection, addDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { db, storage } from "../../firebase";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  useToast,
  Image,
} from "@chakra-ui/react";

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
  const { id } = useParams<{ id?: string }>();
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

  useEffect(() => {
    if (id) {
      const fetchBlog = async () => {
        const blogRef = doc(db, "blogs", id);
        const blogSnap = await getDoc(blogRef);
        if (blogSnap.exists()) {
          setFormData(blogSnap.data() as Blog);
        }
      };
      fetchBlog();
    }
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    const storageRef = ref(storage, `blog_images/${uuidv4()}`);
    await uploadBytes(storageRef, file);
    const imageUrl = await getDownloadURL(storageRef);
    setFormData((prev) => ({ ...prev, image: imageUrl }));
  };

  const handleSave = async () => {
    const content = editorRef.current ? editorRef.current.getContent() : "";
    const updatedData = { ...formData, content };

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

    navigate("/");
  };

  return (
    <Box p={8}>
      <FormControl>
        <FormLabel>Title</FormLabel>
        <Input name="title" value={formData.title} onChange={handleChange} />
      </FormControl>

      <FormControl mt={4}>
        <FormLabel>Image</FormLabel>
        <Input type="file" onChange={handleImageUpload} />
        {formData.image && (
          <Image src={formData.image} alt="Blog" width="100px" mt={2} />
        )}
      </FormControl>

      <FormControl mt={4}>
        <FormLabel>Meta Description</FormLabel>
        <Textarea
          name="metaDescription"
          value={formData.metaDescription}
          onChange={handleChange}
        />
      </FormControl>

      <Editor
        apiKey="hpjuw4h19yrr6qhp6g7or9f5rubbh2wfp8k6m5r76xw8rqn9"
        onInit={(_, editor) => (editorRef.current = editor)}
        initialValue={formData.content}
      />

      <Button mt={4} colorScheme="blue" onClick={handleSave}>
        {id ? "Update Blog" : "Create Blog"}
      </Button>
    </Box>
  );
};

export default BlogEditor;
