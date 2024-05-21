const express = require("express");
const http = require("http"); // Import the http module
const cors = require("cors");
const sql = require("mssql");
const multer = require("multer");
const path = require("path");
const app = express();
const { Server } = require("socket.io");
const server = http.createServer(app);
const WebSocket = require("ws");

app.use(express.json());
app.use(cors());

// Create HTTP server

// SQL Server configuration
const config = {
  host: "localhost",
  user: "admin",
  password: "admin123",
  server: "DESKTOP-IMG0LDR\\SQLEXPRESS", // Replace with your SQL Server instance name
  database: "fyp", // Replace with your database name
  options: {
    encrypt: true,
    trustServerCertificate: true, // Change to true for local dev / self-signed certs
    trustedConnection: true, // Use Windows Authentication
  },
};

// wss.on("connection", (ws) => {
//   console.log("Client connected");

//   ws.on("message", (message) => {
//     // Handle messages from the client
//   });

//   ws.on("close", () => {
//     console.log("Client disconnected");
//   });
// });

// SQL Server connection pool
const pool = new sql.ConnectionPool(config);
const poolConnect = pool.connect();

poolConnect
  .then(() => {
    console.log("Connected to SQL Server");
    const wss = new WebSocket.Server({ server });

    wss.on("connection", (ws) => {
      console.log("New client connected");
      ws.on("close", () => {
        console.log("Client disconnected");
      });
    });

    //....................................User Login and Logout Endpoints................................

    // ---------------login endpoint-----------------
    app.post("/login", async (req, res) => {
      const { email, password } = req.body;

      try {
        const request = pool.request();
        const updateResult = await request.query(
          `UPDATE users SET logged_in = 1 WHERE email = '${email}'`
        );

        // Check if update was successful
        if (updateResult.rowsAffected > 0) {
          const result = await request.query(
            `SELECT * FROM users WHERE email = '${email}' AND password = '${password}'`
          );

          if (result.recordset.length > 0) {
            const user = result.recordset[0];
            const responsePayload = { email: user.email, role: user.role };

            // Send the response with the payload
            res.status(200).json(responsePayload);
          } else {
            // Update failed, but user provided correct credentials. Log error and send a specific message.
            console.error(
              "User logged in successfully, but database update failed."
            );
            res.status(500).json({ message: "Internal server error." });
          }
        } else {
          // Update failed, user might have invalid credentials.
          console.error("Login error:");
          res.status(401).json({ message: "Invalid credentials." });
        }
      } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal server error." });
      }
    });

    //   --------------Logout endpoint-----------------
    app.post("/logout", async (req, res) => {
      try {
        const { email } = req.body;

        // Update user logged_in status to 0
        const request = pool.request();
        await request
          .input("email", sql.VarChar, email)
          .query("UPDATE users SET logged_in = 0 WHERE email = @email");

        // Respond with success message
        res.status(200).json({ message: "Successfully logged out." });
      } catch (error) {
        console.error("Error during logout:", error);
        res.status(500).json({ message: "Internal server error." });
      }
    });

    //......................................Admin Login Logout Endpoints....................................

    // ---------------login endpoint-----------------
    app.post("/adminLogin", async (req, res) => {
      const { email, password } = req.body;

      try {
        const request = pool.request();
        const updateResult = await request.query(
          `UPDATE admin SET admin_logged_in_status = 1 WHERE admin_email = '${email}'`
        );

        // Check if update was successful
        if (updateResult.rowsAffected > 0) {
          const result = await request.query(
            `SELECT * FROM admin WHERE admin_email = '${email}' AND admin_password = '${password}'`
          );

          if (result.recordset.length > 0) {
            const admin = result.recordset[0];
            const responsePayload = {
              email: admin.admin_email,
              role: admin.admin_role,
            };

            // Send the response with the payload
            res.status(200).json(responsePayload);
          } else {
            // Update failed, but user provided correct credentials. Log error and send a specific message.
            console.error(
              "Admin logged in successfully, but database update failed."
            );
            res.status(500).json({ message: "Internal server error." });
          }
        } else {
          // Update failed, admin might have invalid credentials.
          console.error("Login error:");
          res.status(401).json({ message: "Invalid credentials." });
        }
      } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal server error." });
      }
    });

    //   --------------Logout endpoint-----------------
    app.post("/adminLogout", async (req, res) => {
      try {
        const { email } = req.body;

        // Update admin logged_in status to 0
        const request = pool.request();
        await request
          .input("email", sql.VarChar, email)
          .query(
            "UPDATE admin SET admin_logged_in_status = 0 WHERE admin_email = @email"
          );

        // Respond with success message
        res.status(200).json({ message: "Successfully logged out." });
      } catch (error) {
        console.error("Error during logout:", error);
        res.status(500).json({ message: "Internal server error." });
      }
    });

    // -------------Admin details endpoint--------------------
    app.get("/admin-details", async (req, res) => {
      try {
        const { email } = req.query;
        const request = pool.request();
        const result = await request.query(
          `SELECT adminID, admin_email, admin_name, admin_role, admin_employeeID, admin_phone FROM admin WHERE admin_email = '${email}'`
        );

        if (result.recordset.length > 0) {
          const admin = result.recordset[0];
          res.status(200).json(admin);
        } else {
          res.status(404).json({ message: "Admin not found" });
        }
      } catch (error) {
        console.error("Error fetching admin details:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    });

    // -------------User details endpoint--------------------
    app.get("/user-details", async (req, res) => {
      try {
        const { email } = req.query;
        const request = pool.request();
        const result = await request.query(
          `SELECT * FROM users WHERE email = '${email}'`
        );

        if (result.recordset.length > 0) {
          const user = result.recordset[0];
          res.status(200).json(user);
        } else {
          res.status(404).json({ message: "User not found" });
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    });

    app.post("/addUser", async (req, res) => {
      const { email, password, name, role, employeeID, phone } = req.body;

      try {
        const pool = await sql.connect(config);
        const request = pool.request();
        await request
          .input("email", sql.NVarChar(255), email)
          .input("password", sql.NVarChar(255), password)
          .input("name", sql.NVarChar(255), name)
          .input("role", sql.NVarChar(50), role)
          .input("employeeID", sql.Int, employeeID)
          .input("phone", sql.BigInt, phone)
          .query(
            "INSERT INTO users (email, password, name, role, employeeID, phone) VALUES (@email, @password, @name, @role, @employeeID, @phone)"
          );
        res.status(200).send("User added successfully");
      } catch (err) {
        console.error(err);
        res.status(500).send("Failed to add user");
      }
    });

    // Edit an existing user
    app.put("/editUser/:id", async (req, res) => {
      const { email, password, name, role, employeeID, phone } = req.body;
      const id = req.params.id;

      try {
        const pool = await sql.connect(config);
        const request = pool.request();
        const result = await request.query(
          `SELECT * FROM users WHERE id = ${id}`
        );
        const user = result.recordset[0];

        if (!user) {
          res.status(404).send("User not found");
          return;
        }

        await request
          .input("email", sql.NVarChar(255), email)
          .input("password", sql.NVarChar(255), password)
          .input("name", sql.NVarChar(255), name)
          .input("role", sql.NVarChar(50), role)
          .input("employeeID", sql.Int, employeeID)
          .input("phone", sql.BigInt, phone)
          .query(
            `UPDATE users SET email = @email, 
                                password = @password, 
                                name = @name, 
                                role = @role, 
                                employeeID = @employeeID, 
                                phone = @phone 
                                WHERE id = ${id}`
          );
        res.status(200).send("User updated successfully");
      } catch (err) {
        console.error(err);
        res.status(500).send("Failed to update user");
      }
    });

    // Remove an existing user
    app.delete("/removeUser/:id", async (req, res) => {
      const id = req.params.id;

      try {
        const pool = await sql.connect(config);
        const request = pool.request();
        const result = await request.query(
          `SELECT * FROM users WHERE id = ${id}`
        );
        const user = result.recordset[0];

        if (!user) {
          res.status(404).send("User not found");
          return;
        }

        await request.query(`DELETE FROM users WHERE id = ${id}`);
        res.status(200).send("User removed successfully");
      } catch (err) {
        console.error(err);
        res.status(500).send("Failed to remove user");
      }
    });

    // ----------Get  All Users for Users.js in Admin Dashboard endpoint-------------
    app.get("/users", async (req, res) => {
      try {
        const request = pool.request();
        const result = await request.query(
          "SELECT * FROM users WHERE role = 'user';"
        );
        res.status(200).json(result.recordset);
      } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    });

    // Endpoint to grant manual control access
    // app.put("/grant-manual-control/:requestId", async (req, res) => {
    //   try {
    //     const { requestId } = req.params;
    //     const result = await pool
    //       .request()
    //       .input("requestId", sql.Int, requestId)
    //       .query(
    //         "SELECT teacherId FROM ManualControlRequests WHERE id = @requestId"
    //       );
    //     const teacherId = result.recordset[0].teacherId;
    //     const emailResult = await pool
    //       .request()
    //       .input("teacherId", sql.Int, teacherId)
    //       .query("SELECT email FROM users WHERE id = @teacherId");

    //     const loggedInEmail = emailResult.recordset[0].email;
    //     console.log(loggedInEmail);

    //     // Emit a Socket.IO event to notify the user
    //     io.to(loggedInEmail).emit("manualControlNotification", {
    //       status: "Granted",
    //       email: loggedInEmail,
    //     });

    //     console.log(requestId);
    //     // Fetch the teacherId associated with the requestId

    //     // Update the request status in the database (you may want to implement notification logic here)
    //     await Promise.all([
    //       pool
    //         .request()
    //         .input("requestId", sql.Int, requestId)
    //         .query(
    //           "UPDATE ManualControlRequests SET status = 'Granted' WHERE id = @requestId"
    //         ),
    //       pool
    //         .request()
    //         .input("teacherId", sql.Int, teacherId)
    //         .query(
    //           "UPDATE users SET manualControlRequested = '2' WHERE id = @teacherId"
    //         ),
    //     ]);

    //     res.status(200).json({ message: "Access granted successfully!" });
    //   } catch (error) {
    //     console.error("Error granting manual control access:", error);
    //     res.status(500).json({ message: "Internal server error." });
    //   }
    // });

    // Endpoint to deny manual control access
    // app.put("/deny-manual-control/:requestId", async (req, res) => {
    //   try {
    //     const { requestId } = req.params;
    //     const loggedInEmail = req.body.loggedInEmail;

    //     // Emit a Socket.IO event to notify the user
    //     io.to(loggedInEmail).emit("manualControlNotification", {
    //       status: "Denied",
    //       email: loggedInEmail,
    //     });
    //     const result = await pool
    //       .request()
    //       .input("requestId", sql.Int, requestId)
    //       .query(
    //         "SELECT teacherId FROM ManualControlRequests WHERE id = @requestId"
    //       );

    //     const teacherId = result.recordset[0].teacherId;

    //     // Update the request status and manualControlRequested in the database
    //     await Promise.all([
    //       pool
    //         .request()
    //         .input("requestId", sql.Int, requestId)
    //         .query(
    //           "UPDATE ManualControlRequests SET status = 'Denied' WHERE id = @requestId"
    //         ),
    //       await pool
    //         .request()
    //         .input("teacherId", sql.Int, teacherId)
    //         .query(
    //           "UPDATE users SET manualControlRequested = '0' WHERE id = @teacherId"
    //         ),
    //     ]);

    //     res.status(200).json({ message: "Access denied successfully!" });
    //   } catch (error) {
    //     console.error("Error denying manual control access:", error);
    //     res.status(500).json({ message: "Internal server error." });
    //   }
    // });

    // Endpoint to handle manual control request
    //     app.post("/request-manual-control", async (req, res) => {
    //       try {
    //         const { teacherEmail, labId, buildingId } = req.body;

    //         // Fetch teacher details using email from the users table
    //         const requestUser = await pool
    //           .request()
    //           .input("email", sql.NVarChar, teacherEmail)
    //           .query("SELECT id, name FROM users WHERE email = @email");

    //         if (requestUser.recordset.length === 0) {
    //           console.error("User not found with the provided email.");
    //           res.status(404).json({ message: "User not found." });
    //           return;
    //         }

    //         const teacherId = requestUser.recordset[0].id;
    //         const teacherName = requestUser.recordset[0].name;

    //         // Update the 'manualControlRequested' status for the user
    //         const updateRequest = pool.request();
    //         await updateRequest
    //           .input("teacherId", sql.Int, teacherId)
    //           .query(
    //             "UPDATE users SET manualControlRequested = 1 WHERE id = @teacherId"
    //           );

    //         // Store the request in the database
    //         const insertRequest = pool.request();
    //         await insertRequest
    //           .input("teacherId", sql.Int, teacherId)
    //           .input("labId", sql.Int, labId)
    //           .input("buildingId", sql.Int, buildingId)
    //           .query(
    //             "INSERT INTO ManualControlRequests (teacherId, labId, buildingId, status, timestamp) VALUES (@teacherId, @labId, @buildingId, 'Pending', GETDATE())"
    //           );

    //         // Return the details of the manual control request, including teacher's name
    //         res.status(200).json({
    //           message: "Request sent successfully!",
    //           teacherName: teacherName,
    //           labId: labId,
    //           buildingId: buildingId,
    //         });
    //       } catch (error) {
    //         console.error("Error processing manual control request:", error);
    //         res.status(500).json({ message: "Internal server error." });
    //       }
    //     });

    //     // Endpoint to get manual control requests
    //     app.get("/manual-control-requests", async (req, res) => {
    //       try {
    //         const request = pool.request();
    //         const result = await request.query(`
    //     SELECT MCR.*, U.name AS teacherName, L.labName, B.buildingName
    //     FROM ManualControlRequests MCR
    //     JOIN users U ON MCR.teacherId = U.id
    //     JOIN Lab L ON MCR.labId = L.id
    //     JOIN BuildingData B ON MCR.buildingId = B.id
    //     WHERE MCR.status = 'Pending'
    // `);

    //         if (result.recordset.length > 0) {
    //           const manualRequests = result.recordset;
    //           res.status(200).json(manualRequests);
    //         } else {
    //           res.status(404).json({ message: "No manual control requests found" });
    //         }
    //       } catch (error) {
    //         console.error("Error fetching manual control requests:", error);
    //         res.status(500).json({ message: "Internal Server Error" });
    //       }
    //     });

    // -------- Area Data Endpoints --------
    // send data to database
    app.post("/insertArea", async (req, res) => {
      const { areaName, description, address, focalPerson, contact } = req.body;

      try {
        if (!areaName) {
          // Return a 400 Bad Request status if 'areaName' is not provided
          return res.status(400).send("Area name is required");
        }

        const request = pool.request();
        await request
          .input("areaName", sql.NVarChar, areaName)
          .input("description", sql.NVarChar, description)
          .input("address", sql.NVarChar, address)
          .input("focalPerson", sql.NVarChar, focalPerson)
          .input("contact", sql.NVarChar, contact)
          .query(
            "INSERT INTO Area (areaName, description, address, focalPerson, contact ) VALUES (@areaName, @description,  @address, @focalPerson, @contact)"
          );
        res.status(200).send("Area saved to database");
      } catch (err) {
        console.error(err);
        res.status(500).send("Failed to save area to database");
      }
    });

    // get data from database
    app.get("/readArea", async (req, res) => {
      try {
        const request = pool.request();
        const result = await request.query(
          "SELECT areaId, areaName, description, address, focalPerson, contact FROM Area"
        );
        res.status(200).json(result.recordset);
      } catch (error) {
        console.error("Failed to get areas from SQL Server:", error);
        res.status(500).send(error);
      }
    });

    app.get("/readArea/:id", async (req, res) => {
      try {
        const request = pool.request();
        const result = await request.query(
          "SELECT areaId, areaName, description, address, focalPerson, contact FROM Area"
        );
        res.status(200).json(result.recordset);
      } catch (error) {
        console.error("Failed to get areas from SQL Server:", error);
        res.status(500).send(error);
      }
    });

    // edit data from database
    app.put("/updateArea/:id", async (req, res) => {
      const { areaName, description, address, focalPerson, contact } = req.body;
      const id = parseInt(req.params.id, 10);

      try {
        const request = pool.request();
        const result = await request.query(
          `SELECT * FROM Area WHERE AreaID = ${id}`
        );
        const area = result.recordset[0];

        if (!area) {
          res.status(404).send("Area not found");
          return;
        }

        // Update the fields regardless of whether they are truthy or not
        const newAreaName =
          areaName !== undefined ? `'${areaName}'` : area.AreaName;
        const newDescription =
          description !== undefined ? `'${description}'` : area.Description;
        const newAddress =
          address !== undefined ? `'${address}'` : area.Address;
        const newFocalPerson =
          focalPerson !== undefined ? `'${focalPerson}'` : area.FocalPerson;
        const newContact = contact !== undefined ? `${contact}` : area.Contact;

        await request.query(
          `UPDATE Area
          SET
          AreaName = ${newAreaName},
          Description = ${newDescription},
          Address = ${newAddress},
          FocalPerson = ${newFocalPerson},
          Contact = ${newContact}
          WHERE
          AreaID = ${id}`
        );

        res.status(200).send("Area updated successfully");
      } catch (err) {
        console.log(err);
        res.status(500).send("Failed to update area in the database");
      }
    });

    // delete data from database
    app.delete("/deleteArea/:id", async (req, res) => {
      const id = req.params.id;

      try {
        const request = pool.request();
        // Changed the query to select area by areaId
        const result = await request.query(
          `SELECT * FROM Area WHERE areaId = ${id}`
        );
        const deleteArea = result.recordset[0];
        if (deleteArea) {
          // Add logic to delete related data from other tables, if any

          // Corrected the table name in the delete query
          await request.query(`DELETE FROM Area WHERE areaId = ${id}`);
          res.status(200).send("Area Deleted Successfully");
        } else {
          res.status(404).send("Area Not Found");
        }
      } catch (err) {
        console.log(err);
        res.status(500).send("Failed to delete area from database");
      }
    });

    //  -------------------Camera Endpoints--------------------
    // Send camera data to database
    app.get("/cameras", async (req, res) => {
      try {
        // Connect to the database
        await sql.connect(config);

        // Query to fetch all cameras with details
        const result = await sql.query(`
          SELECT c.CameraID, c.CameraName, c.description AS CameraDescription,a.AreaID, a.AreaName
          FROM Camera c
          INNER JOIN Area a ON c.AreaID = a.AreaID
        `);

        // Send the response with fetched data
        res.json(result.recordset);
      } catch (error) {
        // If an error occurs, send an error response
        console.error("Error fetching cameras:", error);
        res.status(500).json({ error: "Internal server error" });
      } finally {
        // Close the database connection
        await sql.close();
      }
    });
    app.post("/readArea/:areaId/addCamera", async (req, res) => {
      const areaId = req.params.areaId;
      const newCamera = req.body;

      try {
        const request = pool.request();
        await request
          .input("areaId", sql.Int, areaId)
          .input("cameraName", sql.NVarChar, newCamera.cameraName)
          .input("description", sql.NVarChar, newCamera.description)
          .query(
            "INSERT INTO Camera (AreaID, CameraName, Description) VALUES (@areaId, @cameraName, @description)"
          );

        res.status(200).send("Camera saved to database");
      } catch (err) {
        console.log(err);
        res.status(500).send("Failed to save camera to the database");
      }
    });
    app.post("/insertCamera", async (req, res) => {
      // const areaId = req.params.areaId;
      const newCamera = req.body;
      // console.log(req.params.areaId)
      // console.log(req.body)

      try {
        const request = pool.request();
        await request
          .input("areaId", sql.Int, newCamera.areaId)
          .input("cameraName", sql.NVarChar, newCamera.cameraName)
          .input("description", sql.NVarChar, newCamera.description)
          .query(
            "INSERT INTO Camera (AreaID, CameraName, Description) VALUES (@areaId, @cameraName, @description)"
          );

        res.status(200).send("Camera saved to database");
      } catch (err) {
        console.log(err);
        res.status(500).send("Failed to save camera to the database");
      }
    });

    // Get camera data from database
    app.get("/readArea/:areaId/readCamera", async (req, res) => {
      const areaId = req.params.areaId;

      try {
        const request = pool.request();
        const result = await request.query(
          `SELECT CameraID, CameraName, Description FROM Camera WHERE AreaID = ${areaId}`
        );
        res.status(200).json(result.recordset);
      } catch (err) {
        console.log(err);
        res.status(500).send("Failed to get cameras from the database");
      }
    });

    // Edit camera data in database
    app.put("/readArea/:areaId/updateCamera/:cameraId", async (req, res) => {
      const areaId = req.params.areaId;
      const cameraId = req.params.cameraId;
      const newCameraName = req.body.newCameraName;
      const newDescription = req.body.newDescription;

      try {
        const request = pool.request();
        await request
          .input("newCameraName", sql.NVarChar, newCameraName)
          .input("newDescription", sql.NVarChar, newDescription)
          .query(
            `UPDATE Camera SET CameraName = @newCameraName, Description = @newDescription WHERE CameraID = ${cameraId} AND AreaID = ${areaId}`
          );

        res.status(200).send("Camera updated successfully");
      } catch (err) {
        console.log(err);
        res.status(500).send("Failed to update camera in the database");
      }
    });
    app.put("/updateCamera/:cameraId", async (req, res) => {
      // const areaId = req.params.areaId;
      const cameraId = req.params.cameraId;
      const newCameraName = req.body.CameraName;
      const newDescription = req.body.CameraDescription;
      // console.log(req.params);
      // console.log(req.body.CameraName);

      try {
        const request = pool.request();
        await request
          .input("newCameraName", sql.NVarChar, newCameraName)
          .input("newDescription", sql.NVarChar, newDescription)
          .query(
            `UPDATE Camera SET CameraName = @newCameraName, Description = @newDescription WHERE CameraID = ${cameraId}`
          );

        res.status(200).send("Camera updated successfully");
      } catch (err) {
        console.log(err);
        res.status(500).send("Failed to update camera in the database");
      }
    });

    // Delete camera data from database
    app.delete("/readArea/:areaId/deleteCamera/:cameraId", async (req, res) => {
      const areaId = req.params.areaId;
      const cameraId = req.params.cameraId;

      try {
        const request = pool.request();
        await request.query(
          `DELETE FROM Camera WHERE CameraID = ${cameraId} AND AreaID = ${areaId}`
        );

        res.status(200).send("Camera deleted successfully");
      } catch (err) {
        console.log(err);
        res.status(500).send("Failed to delete camera from the database");
      }
    });
    app.delete("/deleteCamera/:cameraId", async (req, res) => {
      // const areaId = req.params.areaId;
      const cameraId = req.params.cameraId;

      try {
        const request = pool.request();
        await request.query(`DELETE FROM Camera WHERE CameraID = ${cameraId}`);

        res.status(200).send("Camera deleted successfully");
      } catch (err) {
        console.log(err);
        res.status(500).send("Failed to delete camera from the database");
      }
    });

    //Read All Cameras for Stats
    app.get("/readAllCameras", async (req, res) => {
      try {
        const request = pool.request();
        const result = await request.query(
          `SELECT CameraID, CameraName, Description FROM Camera`
        );
        res.status(200).json(result.recordset);
      } catch (err) {
        console.log(err);
        res.status(500).send("Failed to get cameras from the database");
      }
    });

    // -------- Bounded Rectangle Data Endpoints --------
    // send data to database
    app.post("/readCamera/:cameraId/addBoundedRectangle", async (req, res) => {
      const cameraId = req.params.cameraId;
      const { x1, y1, x2, y2, status } = req.body;
      const manualStatus = false;

      try {
        const request = pool.request();
        const cameraResult = await request.query(
          `SELECT * FROM Camera WHERE CameraID = ${cameraId}`
        );
        const camera = cameraResult.recordset[0];

        if (!camera) {
          res.status(404).send("Camera not found");
          return;
        }

        const result = await request
          .input("cameraId", sql.Int, cameraId)
          .input("x1", sql.Int, x1)
          .input("y1", sql.Int, y1)
          .input("x2", sql.Int, x2)
          .input("y2", sql.Int, y2)
          .input("status", sql.Bit, status)
          .query(
            `INSERT INTO BoundedRectangle (CameraID, x1, y1, x2, y2, Status)
            OUTPUT inserted.RectangleID
            VALUES (@cameraId, @x1, @y1, @x2, @y2, @status)`
          );

        const newRectangleId = result.recordset[0].RectangleID;

        await request
          .input("rectangleId", sql.Int, newRectangleId)
          .input("manualStatus", sql.Bit, manualStatus)
          .query(
            `INSERT INTO IoTDevices (RectangleID, Manual_Status) 
            VALUES (@rectangleId, @manualStatus)`
          );

        res.status(200).send("Bounded Rectangle saved to database");
      } catch (err) {
        console.log(err);
        res
          .status(500)
          .send("Failed to save Bounded Rectangle to the database");
      }
    });

    // get data from database
    app.get("/readCamera/:cameraId/readBoundedRectangles", async (req, res) => {
      const cameraId = req.params.cameraId;

      try {
        const request = pool.request();
        const result = await request.query(
          `SELECT * FROM BoundedRectangle WHERE CameraID = ${cameraId}`
        );
        res.status(200).json(result.recordset);
      } catch (err) {
        console.log(err);
        res
          .status(500)
          .send("Failed to get Bounded Rectangles from the database");
      }
    });

    // edit data from database
    app.put("/updateBoundedRectangle/:rectangleId", async (req, res) => {
      const rectangleId = req.params.rectangleId;
      const { x1, y1, x2, y2, status } = req.body;

      try {
        const request = pool.request();
        await request
          .input("rectangleId", sql.Int, rectangleId)
          .input("x1", sql.Int, x1)
          .input("y1", sql.Int, y1)
          .input("x2", sql.Int, x2)
          .input("y2", sql.Int, y2)
          .input("status", sql.Bit, status)
          .query(
            `UPDATE BoundedRectangle SET x1 = @x1, y1 = @y1, x2 = @x2, y2 = @y2, Status = @status WHERE RectangleID = @rectangleId`
          );

        res.status(200).send("Bounded Rectangle updated successfully");
      } catch (err) {
        console.log(err);
        res
          .status(500)
          .send("Failed to update Bounded Rectangle in the database");
      }
    });
    app.get(
      "/camera/:cameraId/boundedRectanglesWithDeviceID",
      async (req, res) => {
        const cameraId = req.params.cameraId;

        try {
          const request = pool.request();
          request.input("CameraID", cameraId);
          const result = await request.query(`
          SELECT 
            BR.x1, BR.y1, BR.x2, BR.y2, IOT.DeviceID, IOT.Manual_Status
          FROM 
            BoundedRectangle BR
          LEFT JOIN 
            IoTDevices IOT ON BR.RectangleID = IOT.RectangleID
          WHERE 
            BR.CameraID = @CameraID
        `);
          res.status(200).json(result.recordset);
        } catch (err) {
          console.log(err);
          res
            .status(500)
            .send(
              "Failed to get Bounded Rectangles and IoT Devices from the database"
            );
        }
      }
    );

    app.put("/ChangeDeviceStatus/:deviceId", async (req, res) => {
      const deviceId = req.params.deviceId;
      const { status } = req.body;

      try {
        const request = pool.request();
        request.input("DeviceID", deviceId);
        request.input("Status", status);
        const result = await request.query(`
          UPDATE IoTDevices
          SET Status = @Status
          WHERE DeviceID = @DeviceID
        `);

        if (result.rowsAffected[0] > 0) {
          res.status(200).send("Device status updated successfully");
        } else {
          res.status(404).send("Device not found");
        }
      } catch (err) {
        console.log(err);
        res.status(500).send("Failed to update device status in the database");
      }
    });

    // delete data from database
    app.delete("/deleteBoundedRectangle/:rectangleId", async (req, res) => {
      const rectangleId = req.params.rectangleId;

      try {
        const request = pool.request();
        await request.query(
          `DELETE FROM BoundedRectangle WHERE RectangleID = ${rectangleId}`
        );

        res.status(200).send("Bounded Rectangle deleted successfully");
      } catch (err) {
        console.log(err);
        res
          .status(500)
          .send("Failed to delete Bounded Rectangle from the database");
      }
    });

    app.get(
      "/readCameraWithManualStatus/:cameraId/readBoundedRectangles",
      async (req, res) => {
        const cameraId = req.params.cameraId;

        try {
          const request = pool.request();
          const result = await request.query(`
          SELECT BR.RectangleID, BR.x1, BR.y1, BR.x2, BR.y2, BR.Status, ID.Manual_Status
          FROM BoundedRectangle BR
          INNER JOIN IoTDevices ID ON BR.RectangleID = ID.RectangleID
          WHERE BR.CameraID = ${cameraId}
        `);
          res.status(200).json(result.recordset);
        } catch (err) {
          console.error(err);
          res
            .status(500)
            .send(
              "Failed to get Bounded Rectangles with manual status from the database"
            );
        }
      }
    );

    app.put("/updateManualStatus/:rectangleId", async (req, res) => {
      const rectangleId = req.params.rectangleId;
      const { Manual_Status } = req.body;
      console.log(req.body);

      try {
        const request = pool.request();
        await request.query(`
          UPDATE IoTDevices
          SET Manual_Status = ${Manual_Status}
          WHERE RectangleID = ${rectangleId}
        `);
        res.status(200).send("Manual status updated successfully");

        // Send a message to all connected WebSocket clients
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: "update" }));
          }
        });
      } catch (err) {
        console.error(err);
        res.status(500).send("Failed to update manual status");
      }
    });
    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, "./images"); // Store uploaded images in the 'images' directory
      },
      filename: function (req, file, cb) {
        // Generate a unique filename for the image
        cb(null, `${Date.now()}-${file.originalname}`);
      },
    });
    // const upload = multer({ storage: storage });

    // Route to receive and store the image
    // app.post("/fetch-image", upload.single("image"), (req, res) => {
    //   try {
    //     if (!req.file) {
    //       return res.status(400).json({ error: "No file uploaded" });
    //     }

    //     const filename = req.file.filename;
    //     res.json({ success: true, filename });
    //   } catch (error) {
    //     console.error("Error uploading image:", error);
    //     res.status(500).json({ error: "An error occurred" });
    //   }
    // });
    const upload = multer({ storage: multer.memoryStorage() });
    app.post(
      "/fetch-image/:cameraId",
      upload.single("image"),
      async (req, res) => {
        const cameraId = req.params.cameraId;

        try {
          if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
          }

          const imageBuffer = req.file.buffer;

          const request = pool.request();
          request.input("CameraID", sql.Int, cameraId);
          request.input("CameraImage", sql.VarBinary, imageBuffer);
          const result = await request.query(`
          UPDATE Camera
          SET CameraImage = @CameraImage
          WHERE CameraID = @CameraID
        `);

          if (result.rowsAffected[0] > 0) {
            res.json({
              success: true,
              message: "Image uploaded and stored in database",
            });
          } else {
            res.status(404).json({ error: "Camera not found" });
          }
        } catch (error) {
          console.error("Error uploading image:", error);
          res
            .status(500)
            .json({ error: "An error occurred while uploading the image" });
        }
      }
    );
    app.get("/read-image/:cameraId", async (req, res) => {
      const cameraId = req.params.cameraId;

      try {
        const request = pool.request();
        request.input("CameraID", cameraId);
        const result = await request.query(`
          SELECT CameraImage 
          FROM Camera
          WHERE CameraID = @CameraID
        `);

        if (result.recordset.length > 0) {
          const imageBuffer = result.recordset[0].CameraImage;
          if (imageBuffer) {
            res.writeHead(200, {
              "Content-Type": "image/jpeg",
              "Content-Length": imageBuffer.length,
            });
            res.end(imageBuffer);
          } else {
            res.status(404).send("Image not found");
          }
        } else {
          res.status(404).send("Camera not found");
        }
      } catch (error) {
        console.error("Error serving image:", error);
        res.status(500).send("An error occurred while fetching the image");
      }
    });
    // Route to serve the stored image
    // app.get("/read-image/:filename", (req, res) => {
    //   try {
    //     const { filename } = req.params;

    //     // Serve the image file from the local storage
    //     res.sendFile(path.join(__dirname, "images", filename));
    //   } catch (error) {
    //     console.error("Error serving image:", error);
    //     res.status(404).send("Image not found");
    //   }
    // });
  })
  .catch((err) => {
    console.error("Failed to connect to SQL Server:", err);
  });

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
