const admin = require("firebase-admin");
admin.initializeApp();

const functions = require("firebase-functions");

const db = admin.firestore();

module.exports.getAllComputers = functions.https.onCall(
  async (data, context) => {
    try {
      const snapshot = await db.collection("computers").get();
      const records = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return records;
    } catch (error) {
      throw new functions.https.HttpsError(
        "internal",
        "Error fetching records: " + error.toString()
      );
    }
  }
);

module.exports.addComputer = functions.https.onCall(async (data, context) => {
  try {
    const { computerName, ipAddress, schedule } = data;

    if (!computerName || !ipAddress || !schedule) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Please provide a valid computer name, IP address, and schedule."
      );
    }

    const newRecord = await db.collection("computers").add({
      computerName,
      ipAddress,
      schedule: schedule,
    });

    return { id: newRecord.id };
  } catch (error) {
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    throw new functions.https.HttpsError(
      "internal",
      "Error adding new record: " + error.toString()
    );
  }
});

module.exports.getComputerByName = functions.https.onCall(
  async (data, context) => {
    try {
      if (!data.computerName) {
        throw new functions.https.HttpsError(
          "invalid-argument",
          "Please provide a computer name."
        );
      }

      const snapshot = await db
        .collection("computers")
        .where("computerName", "==", data.computerName)
        .get();

      if (snapshot.empty) {
        throw new functions.https.HttpsError(
          "not-found",
          "No record found for the given computer name."
        );
      }

      // Return the first match (assuming computer names are unique)
      const record = snapshot.docs[0];
      return { id: record.id, ...record.data() };
    } catch (error) {
      if (error instanceof functions.https.HttpsError) {
        throw error;
      }
      throw new functions.https.HttpsError(
        "internal",
        "Error fetching record by name: " + error.toString()
      );
    }
  }
);

module.exports.updateComputers = functions.firestore
  .document("/computers/{computer}")
  .onUpdate(async (snapshot, context) => {
    const { computer } = context.params;
    const after = snapshot.after.data();

    return {
      status: "success",
      message: `PC ${displayName} updated`,
    };
  });

module.exports.deleteComputer = functions.https.onCall(
  async (data, context) => {
    try {
      const recordId = data.id;

      if (!recordId) {
        throw new functions.https.HttpsError(
          "invalid-argument",
          "Please provide a valid record ID."
        );
      }

      await db.collection("computers").doc(recordId).delete();

      return { message: "Record deleted successfully." };
    } catch (error) {
      if (error instanceof functions.https.HttpsError) {
        throw error;
      }
      throw new functions.https.HttpsError(
        "internal",
        "Error deleting record: " + error.toString()
      );
    }
  }
);
module.exports.addNewUser = functions.https.onCall(async (data, context) => {
  if (!context.auth.token.isAdmin) {
    throw new functions.https.HttpsError("permission-denied");
  }

  const {
    displayName,
    email,
    phone: phoneNumber,
    organization,
    notes,
    studies,
    isAdmin,
    password,
  } = data;

  if (!typeof displayName === "string") {
    return {
      status: "error",
      message: "Please provide a valid display name",
    };
  }

  if (!typeof email === "string") {
    return {
      status: "error",
      message: "Please provide a valid email",
    };
  }

  return admin
    .auth()
    .createUser({
      email,
      displayName,
      password,
    })
    .then(async (userRecord) => {
      const uid = userRecord.uid;
      const userDoc = {
        email,
        displayName,
        phoneNumber,
        notes,
        organization,
        studies,
      };

      const claims = {
        studies,
      };

      if (isAdmin) {
        userDoc["isAdmin"] = true;
        claims["isAdmin"] = true;
      }

      await db.doc(`/users/${uid}`).set(userDoc);

      await admin.auth().setCustomUserClaims(uid, claims);

      return {
        status: "success",
        message: `${displayName} created`,
      };
    })
    .catch((error) => {
      console.log("Error creating new user:", error);
    });
});

module.exports.updateUser = functions.firestore
  .document("/users/{user}")
  .onUpdate(async (snapshot, context) => {
    const { user } = context.params;
    const after = snapshot.after.data();
    const newStudies = after.studies;
    const claims = {
      studies: newStudies,
    };

    if (after.isAdmin === true) {
      claims["isAdmin"] = true;
    }

    return admin.auth().setCustomUserClaims(user, claims);

    // update user claims if isAdmin or studies has changed.
  });

module.exports.disableUser = functions.https.onCall(async (data, context) => {
  const { uid, status } = data;

  // Admin can disable, you cannot disable yourself :-)
  if (!context.auth.token.isAdmin || context.auth.token.uid === uid) {
    throw new functions.https.HttpsError("permission-denied");
  }

  return admin
    .auth()
    .updateUser(uid, {
      disabled: !status,
    })
    .then(async (userRecord) => {
      await db.doc(`users/${uid}`).update({ disabled: !status });
      return {
        status: "success",
        message: "User updated",
        payload: userRecord,
      };
    })
    .catch((err) => {
      console.log(err);
      return {
        status: "warning",
        message: "Could not update user",
      };
    });
});

module.exports.deleteUser = functions.https.onCall(async (data, context) => {
  const { uid } = data;

  if (!context.auth.token.isAdmin || context.auth.token.uid === uid) {
    throw new functions.https.HttpsError("permission-denied");
  }

  return admin
    .auth()
    .deleteUser(uid)
    .then(async (res) => {
      await db.doc(`users/${uid}`).delete();
      return {
        status: "success",
        message: "User deleted",
      };
    })
    .catch((error) => {
      return {
        status: "error",
        message: "Could not delete user",
      };
    });
});
