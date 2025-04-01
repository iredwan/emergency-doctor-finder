import * as ScheduleService from "../service/ScheduleServices.js";

export const createSchedule = async (req, res) => {
  const result = await ScheduleService.createScheduleService(req);
  return res.status(result.status ? 201 : 400).json(result);
};

export const updateSchedule = async (req, res) => {
  const result = await ScheduleService.updateScheduleService(req);
  return res.status(result.status ? 200 : 400).json(result);
};

export const deleteSchedule = async (req, res) => {
  const result = await ScheduleService.deleteScheduleService(req);
  return res.status(result.status ? 200 : 400).json(result);
};

export const getScheduleById = async (req, res) => {
  const result = await ScheduleService.getScheduleByIdService(req);
  return res.status(result.status ? 200 : 404).json(result);
};

export const getAllSchedules = async (req, res) => {
  const result = await ScheduleService.getAllSchedulesService();
  return res.status(result.status ? 200 : 400).json(result);
};

export const getScheduleByDate = async (req, res) => {
  const result = await ScheduleService.getScheduleByDateService(req);
  return res.status(result.status ? 200 : 400).json(result);
};

export const getScheduleByDoctorName = async (req, res) => {
  const result = await ScheduleService.getScheduleByDoctorNameService(req);
  return res.status(result.status ? 200 : 400).json(result);
};

export const getScheduleByNameOrSpecialty = async (req, res) => {
  const result = await ScheduleService.getScheduleBySearch(req);
  return res.status(result.status ? 200 : 400).json(result);
};
