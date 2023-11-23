const express = require("express");
const cors = require("cors");
const sql = require("mssql");
const app = express();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

app.use(express.json());
app.use(cors());

// SQL Server configuration
const config = {
	host: "localhost",
	user: "admin",
	password: "admin123",
	server: "DESKTOP-L1BR7L9\\SQLEXPRESS", // Replace with your SQL Server instance name
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
			"/readBuilding/:buildingId/readLab/:labId/addPC",
			async (req, res) => {
				const buildingId = req.params.buildingId;
				const labId = req.params.labId;
				const { pcName, pcStatus } = req.body;

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
						.input("labId", sql.Int, labId)
						.input("pcName", sql.NVarChar, pcName)
						.input("pcStatus", sql.Bit, pcStatus)
						.query(
							`INSERT INTO PC (labId, pcName, pcStatus) VALUES (@labId, @pcName, @pcStatus)`
						);

					res.status(200).send("PC saved to database");
				} catch (err) {
					console.log(err);
					res.status(500).send("Failed to save PC to the database");
				}
			}
		);

		// get data from database
		app.get(
			"/readBuilding/:buildingId/readLab/:labId/readPC",
			async (req, res) => {
				const buildingId = req.params.buildingId;
				const labId = req.params.labId;

				try {
					const request = pool.request();
					const result = await request.query(
						`SELECT id, pcName, pcStatus FROM PC WHERE labId = ${labId}`
					);
					res.status(200).json(result.recordset);
				} catch (err) {
					console.log(err);
					res.status(500).send("Failed to get PCs from the database");
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
			"/readBuilding/:buildingId/readLab/:labId/deletePC/:pcId",
			async (req, res) => {
				const pcId = req.params.pcId;

				try {
					const request = pool.request();
					await request.query(`DELETE FROM PC WHERE id = '${pcId}'`);

					res.status(200).send("PC deleted successfully");
				} catch (err) {
					console.log(err);
					res.status(500).send("Failed to delete PC from the database");
				}
			}
		);

		app.use("/images", express.static(path.join(__dirname, "images")));
	})
	.catch((err) => {
		console.error("Failed to connect to SQL Server:", err);
	});

app.listen(3001, () => {
	console.log("Server is running on port 3001");
});
