const express = require("express");
const http = require("http"); // Import the http module
const cors = require("cors");
const sql = require("mssql");
const multer = require("multer");
const path = require("path");
const app = express();
require("dotenv").config();

app.use(express.json());
app.use(cors());

const server = http.createServer(app); // Create HTTP server

// SQL Server configuration
const config = {
  host: `${process.env.HOST}`,
  user: `${process.env.USER}`,
  password: `${process.env.PASSWORD}`,
  server: `${process.env.SERVER}`, // Replace with your SQL Server instance name
  database: `${process.env.DATABASE}`, // Replace with your database name
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

    app.get("/checkServerStatus", (req, res) => {
      res.status(200).json({ serverStatus: true });
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
      const BoardID = 1;
      const Relay1 = 1;
      const Mode1 = 1;
      const Relay2 = 1;
      const Mode2 = 1;
      const Relay3 = 1;
      const Mode3 = 1;

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
          .input("BoardID", sql.Int, BoardID)
          .input("RectangleID", sql.Int, newRectangleId)
          .input("Relay1", sql.Bit, Relay1)
          .input("Mode1", sql.Bit, Mode1)
          .input("Relay2", sql.Bit, Relay2)
          .input("Mode2", sql.Bit, Mode2)
          .input("Relay3", sql.Bit, Relay3)
          .input("Mode3", sql.Bit, Mode3)
          .query(
            `INSERT INTO BoardStatus (BoardID, RectangleID, Relay1, Mode1, Relay2, Mode2, Relay3, Mode3) 
            VALUES (@BoardID, @RectangleID, @Relay1, @Mode1, @Relay2, @Mode2, @Relay3, @Mode3)`
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
    app.get(
      "/camera/:cameraId/boundedRectanglesWithDeviceID",
      async (req, res) => {
        const cameraId = req.params.cameraId;

        try {
          const request = pool.request();
          const result = await request.query(`
          SELECT 
            BR.x1, BR.y1, BR.x2, BR.y2, IOT.DeviceID
          FROM 
            BoundedRectangle BR
          LEFT JOIN 
            IoTDevices IOT ON BR.RectangleID = IOT.RectangleID
          WHERE 
            BR.CameraID = ${cameraId}
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
          request.input("CameraID", sql.Int, cameraId);
          const result = await request.query(`
        SELECT 
          BR.RectangleID, 
          BR.x1, 
          BR.y1, 
          BR.x2, 
          BR.y2, 
          BS.Mode1,
          BS.Mode2,
          BS.Mode3
        FROM 
          BoundedRectangle BR
        INNER JOIN 
          BoardStatus BS ON BR.RectangleID = BS.RectangleID
        WHERE 
          BR.CameraID = @CameraID
      `);

          // console.log(result.recordset);
          // Convert Mode1, Mode2, and Mode3 from BIT to boolean
          const response = result.recordset.map((record) => ({
            ...record,
            Mode1: record.Mode1 === 1,
            Mode2: record.Mode2 === 1,
            Mode3: record.Mode3 === 1,
          }));
          // console.log(response);

          res.status(200).json(response);
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

    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, "./images"); // Store uploaded images in the 'images' directory
      },
      filename: function (req, file, cb) {
        // Generate a unique filename for the image
        const ext = path.extname(file.originalname);
        cb(null, `lab_image${ext}`);
      },
    });
    const upload = multer({ storage: storage });

    // Route to receive and store the image
    app.post("/fetch-image", upload.single("image"), (req, res) => {
      console.log("API Called");
      try {
        if (!req.file) {
          return res.status(400).json({ error: "No file uploaded" });
        }

        const filename = req.file.filename;
        res.json({ success: true, filename });
        console.log("API success");
      } catch (error) {
        console.error("Error uploading image:", error);
        res.status(500).json({ error: "An error occurred" });
      }
    });

    // Route to serve the stored image
    app.get("/read-image/:filename", (req, res) => {
      try {
        const { filename } = req.params;

        // Serve the image file from the local storage
        res.sendFile(path.join(__dirname, "images", filename));
      } catch (error) {
        console.error("Error serving image:", error);
        res.status(404).send("Image not found");
      }
    });

    // api to recieve stats for frontend
    app.put("/energydata", async (req, res) => {
      const { BoardID, Amp, Vol, Power } = req.body;
      console.log(BoardID);
      console.log(Amp);
      console.log(Vol);
      console.log(Power);

      // Check if all required fields are provided
      if (
        !BoardID ||
        Amp === undefined ||
        Vol === undefined ||
        Power === undefined
      ) {
        return res.status(400).json({
          Status: "FAILURE",
          Response: 400,
          Message: "Invalid input. BoardID, Amp, Vol, and Power are required.",
        });
      }

      try {
        const request = pool.request();
        request.input("BoardID", sql.Int, BoardID);

        // Check if the BoardID exists in the database
        const boardCheckResult = await request.query(
          "SELECT BoardID FROM BoardStatus WHERE BoardID = @BoardID"
        );
        if (boardCheckResult.recordset.length === 0) {
          return res.status(501).json({
            Status: "FAILURE",
            Response: 501,
            Message: "Board not found in DB",
          });
        }

        // Update the values of Amp, Vol, and Power for the specified BoardID
        // request.input("BoardID", sql.Int, BoardID);
        request.input("Amp", sql.Real, Amp);
        request.input("Vol", sql.Real, Vol);
        request.input("Power", sql.Real, Power);
        request.input("Timestamp", sql.DateTime, new Date());

        await request.query(`
      INSERT INTO EnergyConsumption (BoardID, Amp, Vol, Power, Timestamp)
      VALUES (@BoardID, @Amp, @Vol, @Power, @Timestamp)
    `);

        res.status(200).json({
          Status: "SUCCESS",
          Response: 200,
          Message: "Record Updated",
        });
      } catch (error) {
        console.error("Error updating record:", error);
        res.status(500).json({
          Status: "FAILURE",
          Response: 500,
          Message: "Internal Server Error",
        });
      }
    });

    // Create an endpoint to retrieve energy data
    app.get("/recvStats", async (req, res) => {
      try {
        const pool = await sql.connect(config);
        const result = await pool
          .request()
          .query("SELECT Amp, Vol, Power, Timestamp FROM EnergyConsumption");

        // Format the data to the required structure
        const formattedData = result.recordset.map((row) => ({
          Amp: row.Amp,
          Vol: row.Vol,
          Power: row.Power,
          TimeStamp: row.Timestamp,
        }));

        res.status(200).json(formattedData);
      } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({
          Status: "FAILURE",
          Response: 500,
          Message: "Internal Server Error",
        });
      }
    });

    // ***************  Desktop Agent APIs ***************
    // send mode of relay requested by desktop agent
    app.get("/getMode/:relayId", async (req, res) => {
      const relayId = parseInt(req.params.relayId);
      console.log("Relay", relayId);

      // Validate the input
      if (isNaN(relayId)) {
        return res.status(400).send("Invalid input. Relay ID are required.");
      }

      // Check if Relay is within the expected range
      if (![1, 2, 3].includes(relayId)) {
        return res.status(400).send("Invalid Relay. This relay does not exist");
      }

      try {
        // Query the database for the mode of the relay
        const request = pool.request();
        const result = await request.query(`
      SELECT Mode${relayId} AS Mode
      FROM BoardStatus
    `);

        // If no results are found, return a failure response
        if (result.recordset.length === 0) {
          return res.status(404).json({
            Status: "FAILURE",
            Response: 404,
            Message: `Mode for Relay ${relayId} not found in DB`,
          });
        }

        // If results are found, return the mode of the relay
        res.status(200).json({
          Mode: result.recordset[0].Mode, // Assuming only one row is returned
        });
      } catch (err) {
        // If an error occurs during database query, return a failure response
        console.error(err);
        res.status(500).send("Failed to get mode of relay from the database");
      }
    });

    // desktop agent will update mode
    app.put("/updateMode/:boardId", async (req, res) => {
      const boardId = parseInt(req.params.boardId, 10);
      const { Relay, Mode } = req.body;
      console.log("Relay", Relay);
      console.log("Mode", Mode);

      // Validate the input
      if (isNaN(boardId) || isNaN(Relay) || Mode === undefined) {
        return res
          .status(400)
          .send("Invalid input. BoardID, Relay, and Mode are required.");
      }

      // Check if Relay is within the expected range
      if (![1, 2, 3].includes(Relay)) {
        return res.status(400).send("Invalid Relay. It should be 1, 2, or 3.");
      }

      // Construct the column name for the mode
      const modeColumn = `Mode${Relay}`;
      if (Mode !== 0 && Mode !== 1) {
        return res.status(400).send("Invalid Mode. It should be 0 or 1.");
      }
      // const modeValue = Mode ? 1 : 0; // Ensuring the mode is either 0 or 1
      // console.log("Mode Value", modeValue);

      try {
        await pool.connect();
        const request = pool.request();
        request.input("BoardID", sql.Int, boardId);
        request.input("Mode", sql.Bit, Mode);

        // SQL query to update the mode
        const updateQuery = `
      UPDATE BoardStatus
      SET ${modeColumn} = @Mode
      WHERE BoardID = @BoardID;
    `;

        await request.query(updateQuery);

        res.status(200).send("Relay mode updated successfully");
      } catch (err) {
        console.error(err);
        res.status(500).send("Failed to update relay mode");
      }
    });

    app.get("/getRectangleData/:cameraId", async (req, res) => {
      const { cameraId } = req.params;
      try {
        const sqlRequest = pool.request();
        sqlRequest.input("CameraID", sql.Int, cameraId);

        const result = await sqlRequest.query(`
          SELECT RectangleID, x1, y1, x2, y2 FROM BoundedRectangle WHERE CameraID = @CameraID
        `);

        if (result.recordset.length > 0) {
          const rectangles = result.recordset.map((rectangle) => {
            return {
              RectangleID: rectangle.RectangleID,
              x1: rectangle.x1,
              y1: rectangle.y1,
              x2: rectangle.x2,
              y2: rectangle.y2,
            };
          });
          res.status(200).json(rectangles);
        } else {
          res
            .status(404)
            .json({ message: "No rectangles found for the specified camera" });
        }
      } catch (err) {
        console.error("SQL error:", err);
        res.status(500).json({ message: "Internal server error" });
      }
    });

    app.put("/updateBoardStatus/:rectangleId", async (req, res) => {
      console.log("Board Status Updated");
      const { rectangleId } = req.params;
      const { status } = req.body;
      console.log("RectangleId", rectangleId);
      console.log("Status", status);
      try {
        const sqlRequest = pool.request(); // Changed variable name from 'request' to 'sqlRequest'
        sqlRequest.input("status", status); // Renamed 'request' to 'sqlRequest' here
        sqlRequest.input("RectangleID", sql.Int, rectangleId);

        // Check Mode2 and Mode3
        const result = await sqlRequest.query(`
          SELECT Mode1, Mode2 FROM BoardStatus WHERE RectangleID = @RectangleID AND BoardID = 1
        `);

        if (result.recordset.length > 0) {
          const { Mode1, Mode2 } = result.recordset[0];
          // console.log(Mode2, Mode3);

          if (Mode1 === true && Mode2 === true) {
            // Update Relay2 and Relay3 to 0
            await sqlRequest.query(`
              UPDATE BoardStatus
              SET Relay1 = @status, Relay2 = @status
              WHERE RectangleID = @RectangleID AND BoardID = 1
            `);

            res.status(200).json({ message: `Relays updated to ${status}` });
          } else {
            res.status(200).json({ message: "No update needed" });
          }
        } else {
          res.status(404).json({ message: "RectangleID not found" });
        }
      } catch (err) {
        console.error("SQL error:", err);
        res.status(500).json({ message: "Internal server error" });
      }
    });

    // change all relay status on when manual
    app.put("/changeDeviceStatus/:boardId", async (req, res) => {
      const boardId = req.params.boardId;
      const { status } = req.body;

      try {
        const request = pool.request();
        request.input("BoardID", boardId);
        request.input("Status", status);
        const result = await request.query(`
          UPDATE BoardStatus
          SET Relay1 = @Status, Relay2 = @Status, Relay3 = @Status
          WHERE BoardID = @BoardID
        `);

        if (result.rowsAffected[0] > 0) {
          res.status(200).send("Board status updated successfully");
        } else {
          res.status(404).send("Board not found");
        }
      } catch (err) {
        console.log(err);
        res.status(500).send("Failed to update Board status in the database");
      }
    });

    // tell desktop to shutdown on when occupancy status is none or 0
    app.get("/occupancyStatus", async (req, res) => {
      console.log("Occupancy Status API Called");
      try {
        // Query the database for all entries in the BoundedRectangle table
        const pool = await sql.connect(config);
        const request = pool.request();
        const result = await request.query(`
      SELECT CAST(Status AS INT) AS Status
      FROM BoundedRectangle
    `);

        // Convert the integer status to boolean
        const response = result.recordset.map((record) => ({
          ...record,
          Status: record.Status === 1,
        }));

        // Send the response
        res.status(200).json(response);
        console.log(response);
      } catch (err) {
        // If an error occurs during the query, return a failure response
        console.error("Error fetching rectangle status:", err);
        res.status(500).json({
          Status: "FAILURE",
          Response: 500,
          Message: "Failed to fetch rectangle status from the database",
        });
      }
    });

    // ***************  Board APIs ***************
    // send board data for requested board id
    app.post("/boardStatus", async (req, res) => {
      // Extract the BoardID from the request body
      const { BoardID } = req.body;
      console.log("BoardID: ", BoardID);

      try {
        // Query the database for the board status based on BoardID
        const request = pool.request();
        request.input("BoardID", BoardID);
        const result = await request.query(`
      SELECT BoardID,
             CAST(Relay1 AS INT) AS Relay1,
             CAST(Mode1 AS INT) AS Mode1,
             CAST(Relay2 AS INT) AS Relay2,
             CAST(Mode2 AS INT) AS Mode2,
             CAST(Relay3 AS INT) AS Relay3,
             CAST(Mode3 AS INT) AS Mode3
      FROM BoardStatus
      WHERE BoardID = @BoardID
    `);

        // If no results are found, return a failure response
        if (result.recordset.length === 0) {
          return res.status(404).json({
            Status: "FAILURE",
            Response: 404,
            Message: `BoardID not found in DB. BoardID= ${BoardID}`,
          });
        }

        // If results are found, return the board status
        res.status(200).json(result.recordset);
      } catch (err) {
        // If an error occurs during database query, return a failure response
        console.error(err);
        res.status(500).json({
          Status: "FAILURE",
          Response: 500,
          Message: "Failed to fetch board status from the database",
        });
      }
    });
  })
  .catch((err) => {
    console.error("Failed to connect to SQL Server:", err);
  });

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
