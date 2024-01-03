import { Button } from "@chakra-ui/react";
import * as React from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { map } from "lodash";

export function Test({ users }) {
  const cron = () => {
    map(users, (u) => {
      onUpdateEntry(u);
    });
  };
  const onUpdateEntry = async (entry) => {
    try {
      const userRef = doc(db, "points", entry?.id);
      await setDoc(
        userRef,
        {
          points: [entry?.points],
        },
        { merge: true }
      );

      return;
    } catch (e) {
      return;
    } finally {
      console.log("Updated Entry for", entry?.id);
    }
  };

  return (
    <>
      <Button onClick={cron} colorScheme="blue">
        Button
      </Button>
    </>
  );
}
