const mongoose = require("mongoose");

const LabSchema = new mongoose.Schema({
	labName: {
		type: String,
		required: true,
	},
});

const BuildingDataSchema = new mongoose.Schema({
	buildingName: {
		type: String,
		required: true,
	},
	labs: [LabSchema],
});

const BuildingData = mongoose.model("BuildingData", BuildingDataSchema);
module.exports = BuildingData;
