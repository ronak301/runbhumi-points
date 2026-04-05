import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Text,
  VStack,
  HStack,
  Avatar,
  Divider,
  FormLabel,
  Input,
  useToast,
  useDisclosure,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase";
import useBookingsManager from "./hooks/useBookingsManager";
import {
  backfillStaffViewMirrors,
  revokeStaffViewLink,
} from "./staffView/staffViewMirror";

function makeStaffViewToken() {
  const a = new Uint8Array(24);
  crypto.getRandomValues(a);
  return Array.from(a, (b) => b.toString(16).padStart(2, "0")).join("");
}

const Profile = ({ onLogout }: any) => {
  const userData = JSON.parse(localStorage.getItem("user") || "{}");
  const navigate = useNavigate();
  const toast = useToast();
  const [staffToken, setStaffToken] = useState<string | null>(null);
  const [staffLinkLoading, setStaffLinkLoading] = useState(false);
  const [generatingStaffLink, setGeneratingStaffLink] = useState(false);
  const [revokingStaffLink, setRevokingStaffLink] = useState(false);
  const revokeCancelRef = useRef<HTMLButtonElement>(null);
  const {
    isOpen: revokeOpen,
    onOpen: onRevokeOpen,
    onClose: onRevokeClose,
  } = useDisclosure();

  const {
    monthlyCollectionTotal,
    lastMonthCollectionTotal,
    financialYearCollectionTotal,
    lastFinancialYearCollectionTotal,
  } = useBookingsManager();

  const { propertyId, title } = userData;

  const loadStaffToken = useCallback(async () => {
    if (!propertyId) return;
    try {
      setStaffLinkLoading(true);
      const snap = await getDoc(doc(db, "properties", propertyId));
      const t = snap.data()?.staffViewToken;
      setStaffToken(typeof t === "string" && t.length > 0 ? t : null);
    } catch {
      setStaffToken(null);
    } finally {
      setStaffLinkLoading(false);
    }
  }, [propertyId]);

  useEffect(() => {
    loadStaffToken();
  }, [loadStaffToken]);

  const staffViewUrl =
    staffToken && typeof window !== "undefined"
      ? `${window.location.origin}/venue-view/${staffToken}`
      : "";

  const onGenerateStaffLink = async () => {
    if (!propertyId) return;
    try {
      setGeneratingStaffLink(true);
      const token = makeStaffViewToken();
      await setDoc(doc(db, "staffViewLinks", token), {
        propertyId,
        venueTitle: title || "Venue",
        createdAt: serverTimestamp(),
      });
      await updateDoc(doc(db, "properties", propertyId), {
        staffViewToken: token,
      });
      setStaffToken(token);
      const { count } = await backfillStaffViewMirrors(propertyId);
      toast({
        title: "Staff view link ready",
        description:
          count > 0
            ? `${count} booking(s) for today & tomorrow synced for staff.`
            : "Share the link with on-site staff. New edits sync automatically.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (e: any) {
      console.error(e);
      toast({
        title: "Could not create link",
        description:
          e?.message || "Check Firestore permissions for staff view.",
        status: "error",
        duration: 6000,
        isClosable: true,
      });
    } finally {
      setGeneratingStaffLink(false);
    }
  };

  const onCopyStaffUrl = async () => {
    if (!staffViewUrl) return;
    try {
      await navigator.clipboard.writeText(staffViewUrl);
      toast({ title: "Copied", status: "success", duration: 2000 });
    } catch {
      toast({ title: "Copy failed", status: "warning", duration: 3000 });
    }
  };

  const onConfirmRevokeStaffLink = async () => {
    if (!propertyId || !staffToken) return;
    try {
      setRevokingStaffLink(true);
      await revokeStaffViewLink(propertyId, staffToken);
      setStaffToken(null);
      onRevokeClose();
      toast({
        title: "Staff link revoked",
        description:
          "The old URL no longer works. Generate a new link if you still need staff view.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (e: any) {
      console.error(e);
      toast({
        title: "Could not revoke link",
        description: e?.message || "Try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setRevokingStaffLink(false);
    }
  };

  const now = new Date();
  const thisMonthLabel = now.toLocaleString("default", {
    month: "short",
  });
  const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthLabel = lastMonthDate.toLocaleString("default", {
    month: "short",
  });

  const fyLabel = (() => {
    const year = now.getFullYear();
    const month = now.getMonth();
    const fyStartYear = month >= 3 ? year : year - 1;
    const fyEndYear = fyStartYear + 1;
    return `FY ${String(fyStartYear).slice(-2)}-${String(fyEndYear).slice(-2)}`;
  })();

  const lastFyLabel = (() => {
    const year = now.getFullYear();
    const month = now.getMonth();
    const fyStartYear = month >= 3 ? year : year - 1;
    const prevStart = fyStartYear - 1;
    const prevEnd = fyStartYear;
    return `FY ${String(prevStart).slice(-2)}-${String(prevEnd).slice(-2)}`;
  })();

  if (!userData?.owner) {
    return (
      <Box p={6} textAlign="center">
        <Text fontSize="lg" fontWeight="bold" mb={4}>
          No User Data Available
        </Text>
        <Button colorScheme="blue" onClick={() => navigate("/login")}>
          Login
        </Button>
      </Box>
    );
  }

  const { mobileNo, owner } = userData;

  return (
    <Box maxWidth="md" mx="auto" px={3} py={4} pb={8}>
      <VStack spacing={4} align="stretch">
        <HStack spacing={3} align="flex-start">
          <Avatar name={`${owner.firstName} ${owner.lastName}`} size="md" />
          <Box minW={0}>
            <Text fontSize="lg" fontWeight="bold" noOfLines={1}>
              {owner.firstName} {owner.lastName}
            </Text>
            <Text fontSize="sm" color="gray.500" noOfLines={1}>
              {title || "Property"}
            </Text>
            <Text fontSize="sm" color="gray.700" mt={1} fontWeight="500">
              {mobileNo}
            </Text>
          </Box>
        </HStack>

        <Accordion allowMultiple defaultIndex={[0]} reduceMotion>
          <AccordionItem
            border="1px solid"
            borderColor="gray.200"
            borderRadius="md"
            mb={2}
            bg="white">
            <h2>
              <AccordionButton
                borderRadius="md"
                py={3}
                position="sticky"
                top={0}
                zIndex={2}
                bg="white"
                boxShadow="sm"
                _expanded={{ bg: "gray.50" }}>
                <Box flex="1" textAlign="left" fontWeight="600" fontSize="sm">
                  Collections
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4} pt={0} px={0}>
              <VStack
                align="stretch"
                spacing={0}
                fontSize="sm"
                color="gray.700"
                divider={<Divider borderColor="gray.100" />}>
                <HStack justify="space-between" px={3} py={3} pt={4}>
                  <Text>{thisMonthLabel}</Text>
                  <Text fontWeight="600">
                    ₹{(monthlyCollectionTotal ?? 0).toLocaleString("en-IN")}
                  </Text>
                </HStack>
                <HStack justify="space-between" px={3} py={3}>
                  <Text>{lastMonthLabel}</Text>
                  <Text fontWeight="600">
                    ₹{(lastMonthCollectionTotal ?? 0).toLocaleString("en-IN")}
                  </Text>
                </HStack>
                <HStack justify="space-between" px={3} py={3}>
                  <Text>{fyLabel}</Text>
                  <Text fontWeight="600">
                    ₹{(financialYearCollectionTotal ?? 0).toLocaleString(
                      "en-IN"
                    )}
                  </Text>
                </HStack>
                <HStack justify="space-between" px={3} py={3}>
                  <Text>{lastFyLabel}</Text>
                  <Text fontWeight="600">
                    ₹{(lastFinancialYearCollectionTotal ?? 0).toLocaleString(
                      "en-IN"
                    )}
                  </Text>
                </HStack>
              </VStack>
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem
            border="1px solid"
            borderColor="gray.200"
            borderRadius="md"
            bg="white">
            <h2>
              <AccordionButton
                borderRadius="md"
                py={3}
                _expanded={{ bg: "gray.50" }}>
                <Box flex="1" textAlign="left" fontWeight="600" fontSize="sm">
                  On-site staff (read-only link)
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4} pt={0}>
              <Text fontSize="xs" color="gray.600" mb={3}>
                Today &amp; tomorrow only. No login. Share with venue staff.
              </Text>
              {staffLinkLoading ? (
                <Text fontSize="sm" color="gray.500">
                  Loading…
                </Text>
              ) : staffToken ? (
                <VStack align="stretch" spacing={3}>
                  <Box>
                    <FormLabel mb={1} fontSize="xs">
                      URL
                    </FormLabel>
                    <Input
                      size="sm"
                      value={staffViewUrl}
                      isReadOnly
                      fontSize="xs"
                    />
                  </Box>
                  <HStack spacing={2} flexWrap="wrap">
                    <Button
                      size="sm"
                      colorScheme="teal"
                      onClick={onCopyStaffUrl}>
                      Copy
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={loadStaffToken}>
                      Refresh
                    </Button>
                    <Button
                      size="sm"
                      colorScheme="red"
                      variant="outline"
                      onClick={onRevokeOpen}>
                      Revoke
                    </Button>
                  </HStack>
                  <Text fontSize="xs" color="gray.500">
                    Revoke if the link was leaked—you can generate a new one
                    later.
                  </Text>
                </VStack>
              ) : (
                <Button
                  size="sm"
                  colorScheme="teal"
                  isLoading={generatingStaffLink}
                  onClick={onGenerateStaffLink}>
                  Generate staff link
                </Button>
              )}
            </AccordionPanel>
          </AccordionItem>
        </Accordion>

        <Button colorScheme="red" size="md" width="full" onClick={onLogout}>
          Logout
        </Button>
      </VStack>

      <AlertDialog
        isOpen={revokeOpen}
        leastDestructiveRef={revokeCancelRef}
        onClose={onRevokeClose}>
        <AlertDialogOverlay>
          <AlertDialogContent mx={4}>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Revoke staff view link?
            </AlertDialogHeader>
            <AlertDialogBody>
              Anyone with the current link will no longer see bookings. You can
              create a new link afterward.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={revokeCancelRef} onClick={onRevokeClose}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={onConfirmRevokeStaffLink}
                ml={3}
                isLoading={revokingStaffLink}>
                Revoke link
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default Profile;
