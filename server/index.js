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
	server: "DESKTOP-RE32RAN\\SQLEXPRESS", // Replace with your SQL Server instance name
	database: "fyp", // Replace with your database name
	options: {
		trustedConnection: true, // Use Windows Authentication
	},
};

// SQL Server connection pool
const pool = new sql.ConnectionPool(config);
const poolConnect = pool.connect();

poolConnect
	.then(() => {
		console.log("Connected to SQL Server");

		const storage = multer.diskStorage({
			destination: function (req, file, cb) {
				cb(null, path.join(__dirname, "public/images")); // Adjust the destination directory as needed
			},
			filename: function (req, file, cb) {
				const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
				cb(
					null,
					file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
				);
			},
		});

		const upload = multer({ storage: storage });

		// -------- Building Data Endpoints --------
		// send data to database
		app.post(
			"/insertBuilding",
			upload.single("buildingImage"),
			async (req, res) => {
				const buildingName = req.body.buildingName;
				const buildingImage = req.file
					? req.file.path.replace("public", "")
					: "";

				try {
					const request = pool.request();
					await request.query(
						`INSERT INTO BuildingData (buildingName, buildingImage) VALUES ('${buildingName}', '${buildingImage}')`
					);
					res.status(200).send("Building saved to database");
				} catch (err) {
					console.log(err);
					res.status(500).send("Failed to save building to database");
				}
			}
		);

		// get data from database
		app.get("/readBuilding", async (req, res) => {
			try {
				const request = pool.request();
				const result = await request.query("SELECT * FROM BuildingData");
				res.send(result.recordset);
			} catch (error) {
				console.error("Failed to get buildings from SQL Server:", error);
				res.status(500).send(error);
			}
		});

		// edit data from database
		app.put(
			"/updateBuilding/:id",
			upload.single("buildingImage"),
			async (req, res) => {
				const newBuildingName = req.body.newBuildingName;
				const newBuildingImage = req.file
					? req.file.path.replace("public", "")
					: "";
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

					if (newBuildingImage) {
						if (building.buildingImage) {
							fs.unlinkSync(building.buildingImage);
						}
						await request.query(
							`UPDATE BuildingData SET buildingImage = '${newBuildingImage}' WHERE id = ${id}`
						);
					}

					res.status(200).send("Building updated successfully");
				} catch (err) {
					console.log(err);
					res.status(500).send("Failed to update building in the database");
				}
			}
		);

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
					if (deleteBuilding.buildingImage) {
						fs.unlinkSync(deleteBuilding.buildingImage);
					}
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
		app.post(
			"/readBuilding/:buildingId/addLab",
			upload.single("labImage"),
			async (req, res) => {
				const buildingId = req.params.buildingId;
				const newLab = req.body;
				const newLabImage = req.file ? req.file.path.replace("public", "") : "";

				try {
					const request = pool.request();
					const result = await request.query(
						`SELECT * FROM BuildingData WHERE id = ${buildingId}`
					);
					const building = result.recordset[0];

					if (!building) {
						res.status(404).send("Building not found");
						return;
					}

					newLab.labImage = newLabImage;
					await request.query(
						`INSERT INTO LabData (labName, labImage, buildingId) VALUES ('${newLab.labName}', '${newLabImage}', ${buildingId})`
					);

					building.labs.push(newLab);
					await request.query(
						`UPDATE BuildingData SET labs = '${JSON.stringify(
							building.labs
						)}' WHERE id = ${buildingId}`
					);

					res.status(200).send("Lab saved to database");
				} catch (err) {
					console.log(err);
					res.status(500).send("Failed to save lab to the database");
				}
			}
		);

		// get data from database
		app.get("/readBuilding/:buildingId/readLab", async (req, res) => {
			const buildingId = req.params.buildingId;
			try {
				const request = pool.request();
				const result = await request.query(
					`SELECT labs FROM BuildingData WHERE id = ${buildingId}`
				);
				const labs = result.recordset[0].labs;
				res.status(200).json(labs);
			} catch (err) {
				console.log(err);
				res.status(500).send("Failed to get labs from the database");
			}
		});

		// edit data from database
		app.post(
			"/readBuilding/:buildingId/addLab",
			upload.single("labImage"),
			async (req, res) => {
				const buildingId = req.params.buildingId;
				const newLab = req.body;
				const newLabImage = req.file ? req.file.path.replace("public", "") : "";

				try {
					const request = pool.request();
					const result = await request.query(
						`SELECT * FROM BuildingData WHERE id = ${buildingId}`
					);
					const building = result.recordset[0];

					if (!building) {
						res.status(404).send("Building not found");
						return;
					}

					newLab.labImage = newLabImage;
					await request.query(
						`INSERT INTO LabData (labName, labImage, buildingId) VALUES ('${newLab.labName}', '${newLabImage}', ${buildingId})`
					);

					building.labs.push(newLab);
					await request.query(
						`UPDATE BuildingData SET labs = '${JSON.stringify(
							building.labs
						)}' WHERE id = ${buildingId}`
					);

					res.status(200).send("Lab saved to database");
				} catch (err) {
					console.log(err);
					res.status(500).send("Failed to save lab to the database");
				}
			}
		);

		// delete data from database
		app.delete(
			"/readBuilding/:buildingId/deleteLab/:labId",
			async (req, res) => {
				const buildingId = req.params.buildingId;
				const labId = req.params.labId;

				try {
					const request = pool.request();
					const result = await request.query(
						`SELECT * FROM BuildingData WHERE id = ${buildingId}`
					);
					const building = result.recordset[0];

					if (!building) {
						res.status(404).send("Building not found");
						return;
					}

					const labToDeleteIndex = building.labs.findIndex(
						(lab) => lab.id === labId
					);

					if (labToDeleteIndex === -1) {
						res.status(404).send("Lab not found in the building");
						return;
					}

					if (building.labs[labToDeleteIndex].labImage) {
						fs.unlinkSync(building.labs[labToDeleteIndex].labImage);
					}

					await request.query(`DELETE FROM LabData WHERE id = '${labId}'`);
					building.labs.splice(labToDeleteIndex, 1);
					await request.query(
						`UPDATE BuildingData SET labs = '${JSON.stringify(
							building.labs
						)}' WHERE id = ${buildingId}`
					);

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
					const result = await request.query(
						`SELECT * FROM BuildingData WHERE id = ${buildingId}`
					);
					const building = result.recordset[0];

					if (!building) {
						res.status(404).send("Building not found");
						return;
					}

					const lab = building.labs.find((lab) => lab.id === labId);

					if (!lab) {
						res.status(404).send("Lab not found in the building");
						return;
					}

					await request.query(
						`INSERT INTO PCData (pcName, pcStatus) VALUES ('${pcName}', '${pcStatus}')`
					);

					lab.pcs.push({ pcName, pcStatus });
					await request.query(
						`UPDATE BuildingData SET labs = '${JSON.stringify(
							building.labs
						)}' WHERE id = ${buildingId}`
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
						`SELECT labs FROM BuildingData WHERE id = ${buildingId}`
					);
					const building = result.recordset[0];

					if (!building) {
						res.status(404).send("Building not found");
						return;
					}

					const lab = building.labs.find((lab) => lab.id === labId);

					if (!lab) {
						res.status(404).send("Lab not found in the building");
						return;
					}

					const pcs = lab.pcs;
					res.status(200).json(pcs);
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
					const result = await request.query(
						`SELECT * FROM BuildingData WHERE id = ${buildingId}`
					);
					const building = result.recordset[0];

					if (!building) {
						res.status(404).send("Building not found");
						return;
					}

					const lab = building.labs.find((lab) => lab.id === labId);

					if (!lab) {
						res.status(404).send("Lab not found in the building");
						return;
					}

					const pcToUpdate = lab.pcs.find((pc) => pc.id === pcId);

					if (!pcToUpdate) {
						res.status(404).send("PC not found in the lab");
						return;
					}

					pcToUpdate.pcName = pcName;
					pcToUpdate.pcStatus = pcStatus;
					await request.query(
						`UPDATE PCData SET pcName = '${pcName}', pcStatus = '${pcStatus}' WHERE id = '${pcId}'`
					);
					await request.query(
						`UPDATE BuildingData SET labs = '${JSON.stringify(
							building.labs
						)}' WHERE id = ${buildingId}`
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
				const buildingId = req.params.buildingId;
				const labId = req.params.labId;
				const pcId = req.params.pcId;

				try {
					const request = pool.request();
					const result = await request.query(
						`SELECT * FROM BuildingData WHERE id = ${buildingId}`
					);
					const building = result.recordset[0];

					if (!building) {
						res.status(404).send("Building not found");
						return;
					}

					const lab = building.labs.find((lab) => lab.id === labId);

					if (!lab) {
						res.status(404).send("Lab not found in the building");
						return;
					}

					const pcToDeleteIndex = lab.pcs.findIndex((pc) => pc.id === pcId);

					if (pcToDeleteIndex === -1) {
						res.status(404).send("PC not found in the lab");
						return;
					}

					await request.query(`DELETE FROM PCData WHERE id = '${pcId}'`);
					lab.pcs.splice(pcToDeleteIndex, 1);
					await request.query(
						`UPDATE BuildingData SET labs = '${JSON.stringify(
							building.labs
						)}' WHERE id = ${buildingId}`
					);

					res.status(200).send("PC deleted successfully");
				} catch (err) {
					console.log(err);
					res.status(500).send("Failed to delete PC from the database");
				}
			}
		);
		// Your API routes go here

		app.use("/images", express.static(path.join(__dirname, "images")));

		app.listen(3001, () => {
			console.log("Server is running on port 3001");
		});
	})
	.catch((err) => {
		console.error("Failed to connect to SQL Server:", err);
	});
