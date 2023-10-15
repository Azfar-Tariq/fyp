const mongoose = require("mongoose");

const PCSchema = new mongoose.Schema({
	pcName: {
		type: String,
		required: true,
	},
	pcStatus: {
		type: Boolean,
		default: false,
		required: true,
	},
});

const LabSchema = new mongoose.Schema({
	labName: {
		type: String,
		required: true,
	},
	pcs: [PCSchema],
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
