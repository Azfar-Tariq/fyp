const express = require("express");
const http = require('http'); // Import the http module
const cors = require("cors");
const sql = require("mssql");
const app = express();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

app.use(express.json());
app.use(cors());

const server = http.createServer(app); // Create HTTP server
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});



// SQL Server configuration
const config = {
  host: "localhost",
  user: "admin",
  password: "admin123",
  server: "DESKTOP-946V6E1", // Replace with your SQL Server instance name
  database: "fyp", // Replace with your database name
  options: {
    encrypt: true,
    trustServerCertificate: true, // Change to true for local dev / self-signed certs
    trustedConnection: true, // Use Windows Authentication
  },
};

// SQL Server connection pool
const pool = new sql.ConnectionPool(config);
const poolConnect = pool.connect();

poolConnect
  .then(() => {
    console.log("Connected to SQL Server");

    //  ---------------login endpoint-----------------
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
              "User logged in successfully, but database update failed.",
              error
            );
            res.status(500).json({ message: "Internal server error." });
          }
        } else {
          // Update failed, user might have invalid credentials.
          console.error("Login error:", error);
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

    // ----------Get Users for Users.js in Admin Dashboard endpoint-------------
    app.get("/users", async (req, res) => {
      try {
        const request = pool.request();
        const result = await request.query(
          "SELECT email, name, role, logged_in FROM users WHERE role = 'user';"
        );
        res.status(200).json(result.recordset);
      } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    });

    // Endpoint to grant manual control access
    app.put("/grant-manual-control/:requestId", async (req, res) => {
      try {
        const { requestId } = req.params;
        const result = await pool
          .request()
          .input("requestId", sql.Int, requestId)
          .query("SELECT teacherId FROM ManualControlRequests WHERE id = @requestId");
          const teacherId = result.recordset[0].teacherId;
        const emailResult = await pool
      .request()
      .input("teacherId", sql.Int, teacherId)
      .query("SELECT email FROM users WHERE id = @teacherId");

    const loggedInEmail = emailResult.recordset[0].email;
        console.log(loggedInEmail)

        // Emit a Socket.IO event to notify the user
        io.to(loggedInEmail).emit("manualControlNotification", {
          status: "Granted",
          email: loggedInEmail,
        });
    
        console.log(requestId);
        // Fetch the teacherId associated with the requestId
        
        // Update the request status in the database (you may want to implement notification logic here)
        await Promise.all([
    
          
        pool
          .request()
          .input("requestId", sql.Int, requestId)
          .query("UPDATE ManualControlRequests SET status = 'Granted' WHERE id = @requestId"),
        pool
          .request()
          .input("teacherId", sql.Int, teacherId)
          .query("UPDATE users SET manualControlRequested = '2' WHERE id = @teacherId")
        ]);
      
        res.status(200).json({ message: "Access granted successfully!" });
      } catch (error) {
        console.error("Error granting manual control access:", error);
        res.status(500).json({ message: "Internal server error." });
      }
      });
      
      
      // Endpoint to deny manual control access
      app.put("/deny-manual-control/:requestId", async (req, res) => {
      try {
        const { requestId } = req.params;
        const loggedInEmail = req.body.loggedInEmail

        // Emit a Socket.IO event to notify the user
        io.to(loggedInEmail).emit("manualControlNotification", {
          status: "Denied",
          email: loggedInEmail,
        });
        const result = await pool
          .request()
          .input("requestId", sql.Int, requestId)
          .query("SELECT teacherId FROM ManualControlRequests WHERE id = @requestId");
    
        const teacherId = result.recordset[0].teacherId;
      
        // Update the request status and manualControlRequested in the database
        await Promise.all([
        pool
          .request()
          .input("requestId", sql.Int, requestId)
          .query("UPDATE ManualControlRequests SET status = 'Denied' WHERE id = @requestId"),
          await pool
          .request()
          .input("teacherId", sql.Int, teacherId)
          .query("UPDATE users SET manualControlRequested = '0' WHERE id = @teacherId")
        ]);
      
        res.status(200).json({ message: "Access denied successfully!" });
      } catch (error) {
        console.error("Error denying manual control access:", error);
        res.status(500).json({ message: "Internal server error." });
      }
      });
      // // Grant  Mnual Control Endpoint
      // app.put("/grant-manual-control/:requestId", async (req, res) => {
      // try {
      //   const { requestId } = req.params;
    
      //   console.log(requestId);
      //   // Fetch the teacherId associated with the requestId
      //   const result = await pool
      //     .request()
      //     .input("requestId", sql.Int, requestId)
      //     .query("SELECT teacherId FROM ManualControlRequests WHERE id = @requestId");
      //     const teacherId = result.recordset[0].teacherId;
      //   // Update the request status in the database (you may want to implement notification logic here)
      //   await Promise.all([
    
          
      //   pool
      //     .request()
      //     .input("requestId", sql.Int, requestId)
      //     .query("UPDATE ManualControlRequests SET status = 'Granted' WHERE id = @requestId"),
      //   pool
      //     .request()
      //     .input("teacherId", sql.Int, teacherId)
      //     .query("UPDATE users SET manualControlRequested = '2' WHERE id = @teacherId")
      //   ]);
      
      //   res.status(200).json({ message: "Access granted successfully!" });
      // } catch (error) {
      //   console.error("Error granting manual control access:", error);
      //   res.status(500).json({ message: "Internal server error." });
      // }
      // });
      

    // Endpoint to handle manual control request
    app.post("/request-manual-control", async (req, res) => {
      try {
        const { teacherEmail, labId, buildingId } = req.body;

        // Fetch teacher details using email from the users table
        const requestUser = await pool
          .request()
          .input("email", sql.NVarChar, teacherEmail)
          .query("SELECT id, name FROM users WHERE email = @email");

        if (requestUser.recordset.length === 0) {
          console.error("User not found with the provided email.");
          res.status(404).json({ message: "User not found." });
          return;
        }

        const teacherId = requestUser.recordset[0].id;
        const teacherName = requestUser.recordset[0].name;

        // Update the 'manualControlRequested' status for the user
        const updateRequest = pool.request();
        await updateRequest
          .input("teacherId", sql.Int, teacherId)
          .query(
            "UPDATE users SET manualControlRequested = 1 WHERE id = @teacherId"
          );

        // Store the request in the database
        const insertRequest = pool.request();
        await insertRequest
          .input("teacherId", sql.Int, teacherId)
          .input("labId", sql.Int, labId)
          .input("buildingId", sql.Int, buildingId)
          .query(
            "INSERT INTO ManualControlRequests (teacherId, labId, buildingId, status, timestamp) VALUES (@teacherId, @labId, @buildingId, 'Pending', GETDATE())"
          );

        // Return the details of the manual control request, including teacher's name
        res.status(200).json({
          message: "Request sent successfully!",
          teacherName: teacherName,
          labId: labId,
          buildingId: buildingId,
        });
      } catch (error) {
        console.error("Error processing manual control request:", error);
        res.status(500).json({ message: "Internal server error." });
      }
    });

    // Endpoint to get manual control requests
    app.get("/manual-control-requests", async (req, res) => {
      try {
        const request = pool.request();
        const result = await request.query(`
    SELECT MCR.*, U.name AS teacherName, L.labName, B.buildingName
    FROM ManualControlRequests MCR
    JOIN users U ON MCR.teacherId = U.id
    JOIN Lab L ON MCR.labId = L.id
    JOIN BuildingData B ON MCR.buildingId = B.id
    WHERE MCR.status = 'Pending'
`);

        if (result.recordset.length > 0) {
          const manualRequests = result.recordset;
          res.status(200).json(manualRequests);
        } else {
          res.status(404).json({ message: "No manual control requests found" });
        }
      } catch (error) {
        console.error("Error fetching manual control requests:", error);
        res.status(500).json({ message: "Internal Server Error" });
      }
    });

    // -------- Building Data Endpoints --------
    // send data to database
    app.post("/insertBuilding", async (req, res) => {
      const buildingName = req.body.buildingName;

      try {
        const request = pool.request();
        await request
          .input("buildingName", sql.NVarChar, buildingName)
          .query(
            "INSERT INTO BuildingData (buildingName) VALUES (@buildingName)"
          );
        res.status(200).send("Building saved to database");
      } catch (err) {
        console.log(err);
        res.status(500).send("Failed to save building to database");
      }
    });

    // get data from database
    app.get("/readBuilding", async (req, res) => {
      try {
        const request = pool.request();
        const result = await request.query(
          "SELECT id, buildingName FROM BuildingData"
        );
        console.log(result.recordset);
        res.status(200).json(result.recordset);
      } catch (error) {
        console.error("Failed to get buildings from SQL Server:", error);
        res.status(500).send(error);
      }
    });

    // edit data from database
    app.put("/updateBuilding/:id", async (req, res) => {
      const newBuildingName = req.body.newBuildingName;
      const id = req.params.id;

      try {
        const request = pool.request();
        const result = await request.query(
          `SELECT * FROM BuildingData WHERE id = ${id}`
        );
        const building = result.recordset[0];

        if (!building) {
          res.status(404).send("Building not found");
          return;
        }

        if (newBuildingName) {
          await request.query(
            `UPDATE BuildingData SET buildingName = '${newBuildingName}' WHERE id = ${id}`
          );
        }
        res.status(200).send("Building updated successfully");
      } catch (err) {
        console.log(err);
        res.status(500).send("Failed to update building in the database");
      }
    });

    // delete data from database
    app.delete("/deleteBuilding/:id", async (req, res) => {
      const id = req.params.id;

      try {
        const request = pool.request();
        const result = await request.query(
          `SELECT * FROM BuildingData WHERE id = ${id}`
        );
        const deleteBuilding = result.recordset[0];
        if (deleteBuilding) {
          await request.query(
            `DELETE FROM cameraData where buildingId = ${id}`
          );
          await request.query(`DELETE FROM BuildingData WHERE id = ${id}`);
          res.status(200).send("Building Deleted Successfully");
        } else {
          res.status(404).send("Building Not Found");
        }
      } catch (err) {
        console.log(err);
        res.status(500).send("Failed to delete building from database");
      }
    });

    // -------- Lab Data Endpoints --------
    // send data to database
    app.post("/readBuilding/:buildingId/addLab", async (req, res) => {
      const buildingId = req.params.buildingId;
      const newLab = req.body;

      try {
        const request = pool.request();
        const buildingResult = await request.query(
          `SELECT * FROM BuildingData WHERE id = ${buildingId}`
        );
        const building = buildingResult.recordset[0];

        if (!building) {
          res.status(404).send("Building not found");
          return;
        }

        await request
          .input("buildingId", sql.Int, buildingId)
          .input("labName", sql.NVarChar, newLab.labName)
          .query(
            "INSERT INTO Lab (buildingId, labName) VALUES (@buildingId, @labName)"
          );
        res.status(200).send("Lab saved to database");
      } catch (err) {
        console.log(err);
        res.status(500).send("Failed to save lab to the database");
      }
    });

    // get data from database
    app.get("/readBuilding/:buildingId/readLab", async (req, res) => {
      const buildingId = req.params.buildingId;
      try {
        const request = pool.request();
        const result = await request.query(
          `SELECT id, labName FROM Lab WHERE buildingId = ${buildingId}`
        );
        res.status(200).json(result.recordset);
      } catch (err) {
        console.log(err);
        res.status(500).send("Failed to get labs from the database");
      }
    });

    // edit data from database
    app.put("/readBuilding/:buildingId/updateLab/:labId", async (req, res) => {
      const buildingId = req.params.buildingId;
      const labId = req.params.labId;
      const newLabName = req.body.newLabName;

      try {
        const request = pool.request();
        const buildingResult = await request.query(
          `SELECT * FROM BuildingData WHERE id = ${buildingId}`
        );
        const building = buildingResult.recordset[0];
        if (!building) {
          res.status(404).send("Building not found");
          return;
        }
        const labResult = await request.query(
          `SELECT * FROM Lab WHERE id = ${labId} AND buildingId = ${buildingId}`
        );
        const labToUpdate = labResult.recordset[0];
        if (!labToUpdate) {
          res.status(404).send("Lab not found in the building");
          return;
        }
        if (newLabName) {
          await request
            .input("newLabName", sql.NVarChar, newLabName)
            .query(
              `UPDATE Lab SET labName = @newLabName WHERE id = ${labId} AND buildingId = ${buildingId}`
            );
        }
        res.status(200).send("Lab updated successfully");
      } catch (err) {
        console.log(err);
        res.status(500).send("Failed to update lab to the database");
      }
    });

    // delete data from database
    app.delete(
      "/readBuilding/:buildingId/deleteLab/:labId",
      async (req, res) => {
        const buildingId = req.params.buildingId;
        const labId = req.params.labId;

        try {
          const request = pool.request();
          const labResult = await request.query(
            `SELECT * FROM Lab WHERE id = ${labId} AND buildingId = ${buildingId}`
          );
          const labToDelete = labResult.recordset[0];

          if (!labToDelete) {
            res.status(404).send("Lab not found");
            return;
          }

          await request.query(`DELETE FROM Lab WHERE id = '${labId}'`);

          res.status(200).send("Lab deleted successfully");
        } catch (err) {
          console.log(err);
          res.status(500).send("Failed to delete lab from the database");
        }
      }
    );

    // -------- PC's Data Endpoints --------
    // send data to database
    app.post(
      "/readBuilding/:buildingId/readLab/:labId/addCoordinates",
      async (req, res) => {
        const buildingId = req.params.buildingId;
        const labId = req.params.labId;
        const { x1, y1, x2, y2, pcStatus } = req.body;

        try {
          const request = pool.request();
          const buildingResult = await request.query(
            `SELECT * FROM BuildingData WHERE id = ${buildingId}`
          );
          const building = buildingResult.recordset[0];

          if (!building) {
            res.status(404).send("Building not found");
            return;
          }
          const labResult = await request.query(
            `SELECT * FROM Lab WHERE id = ${labId} AND buildingId = ${buildingId}`
          );
          const lab = labResult.recordset[0];
          if (!lab) {
            res.status(404).send("Lab not found in the building");
            return;
          }
          await request
            .input("buildingId", sql.Int, buildingId)
            .input("labId", sql.Int, labId)
            .input("x1", sql.Int, x1)
            .input("y1", sql.Int, y1)
            .input("x2", sql.Int, x2)
            .input("y2", sql.Int, y2)
            .input("pcStatus", sql.Bit, pcStatus)
            .query(
              `INSERT INTO cameraData (buildingId, labId, x1, y1, x2, y2, pcStatus) VALUES (@buildingID, @labId, @x1, @y1, @x2, @y2, @pcStatus)`
            );

          res.status(200).send("Coordinates saved to database");
        } catch (err) {
          console.log(err);
          res.status(500).send("Failed to save Coordinates to the database");
        }
      }
    );

    // get data from database
    app.get(
      "/readBuilding/:buildingId/readLab/:labId/readCoordinates",
      async (req, res) => {
        const buildingId = req.params.buildingId;
        const labId = req.params.labId;

        try {
          const request = pool.request();
          const result = await request.query(
            `SELECT id, x1, y1, x2, y2, pcStatus FROM cameraData WHERE labId = ${labId}`
          );
          res.status(200).json(result.recordset);
        } catch (err) {
          console.log(err);
          res.status(500).send("Failed to get Coordinates from the database");
        }
      }
    );

    // edit data from database
    app.put(
      "/readBuilding/:buildingId/readLab/:labId/updatePC/:pcId",
      async (req, res) => {
        const buildingId = req.params.buildingId;
        const labId = req.params.labId;
        const pcId = req.params.pcId;
        const { pcName, pcStatus } = req.body;

        try {
          const request = pool.request();
          await request
            .input("pcId", sql.Int, pcId)
            .input("pcName", sql.NVarChar, pcName)
            .input("pcStatus", sql.Bit, pcStatus)
            .query(
              `UPDATE PC SET pcName = @pcName, pcStatus = @pcStatus WHERE id = @pcId`
            );

          res.status(200).send("PC updated successfully");
        } catch (err) {
          console.log(err);
          res.status(500).send("Failed to update PC in the database");
        }
      }
    );

    // delete data from database
    app.delete(
      "/readBuilding/:buildingId/readLab/:labId/deleteCoordinates/:cellId",
      async (req, res) => {
        const cellId = req.params.cellId;

        try {
          const request = pool.request();
          await request.query(`DELETE FROM cameraData WHERE id = '${cellId}'`);

          res.status(200).send("Coordinates deleted successfully");
        } catch (err) {
          console.log(err);
          res
            .status(500)
            .send("Failed to delete Coordinates from the database");
        }
      }
    );
  })
  .catch((err) => {
    console.error("Failed to connect to SQL Server:", err);
  });

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
