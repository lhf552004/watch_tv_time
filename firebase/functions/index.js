const admin = require("firebase-admin");
admin.initializeApp();

const functions = require("firebase-functions");

const db = admin.firestore();

const cors = require("cors")({ origin: true });

module.exports.getComputerByName = functions.https.onRequest((req, res) => {
  return cors(req, res, async () => {
    try {
      const { computerName, ownerId } = req.body;
      if (!computerName) {
        return res.status(400).send({
          error: "Please provide a computer name.",
        });
      }
      console.log(computerName)
      const snapshot = await db
        .collection("computers")
        .where("computerName", "==", computerName)
        .where("ownerId", "==", ownerId)
        .get();

      if (snapshot.empty) {
        return res.status(404).send({
          error: "No record found for the given computer name.",
        });
      }

      const record = snapshot.docs[0];

      const log_record = {
        // Your data here, for example:
        computerName: computerName,
        computerId: record.id,
        createdAt: admin.firestore.FieldValue.serverTimestamp(), // If using Firestore
      };
      console.log(log_record);
      try {
        const writeResult = await admin.firestore().collection('records').add(log_record);
        // response.json({ result: `Document with ID: ${writeResult.id} added.` });
      } catch (error) {
        console.error('Error adding document:', error);
        response.status(500).send(error);
      }

      res.status(200).send({ id: record.id, ...record.data() });
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: error.toString() });
    }
  });
});

module.exports.scheduledLogCleanup = functions.pubsub.schedule('every 24 hours').onRun((context) => {
  const db = admin.firestore();
  const logCollection = db.collection('records');

  // Delete logs older than a certain date
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - 30); // Delete logs older than 30 days

  const batch = db.batch();
  return logCollection.where('timestamp', '<', cutoffDate).get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        batch.delete(doc.ref);
      });
      return batch.commit();
    })
    .catch(error => {
      console.error('Error deleting logs:', error);
      return null;
    });
});

module.exports.addNewUser = functions.https.onCall(async (data, context) => {
  // if (!context.auth.token.isAdmin) {
  //   throw new functions.https.HttpsError("permission-denied");
  // }

  const {
    displayName,
    email,
    phone: phoneNumber,
    organization,
    notes,
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
      console.log("uid: " + uid);
      const userDoc = {
        email,
        displayName,
        phoneNumber,
        notes,
        organization,
      };

      const claims = {};

      if (isAdmin) {
        userDoc["isAdmin"] = true;
        claims["isAdmin"] = true;
      }

      console.log("start to create doc");

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

    if (after.isAdmin === true) {
      claims["isAdmin"] = true;
    }

    return admin.auth().setCustomUserClaims(user, claims);

    // update user claims if isAdmin has changed.
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
