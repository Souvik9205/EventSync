import { Router } from "express";
import {
  ScanEventController,
  VerifiedAttendanceController,
} from "../controller/scanController";

const scanRouter = Router();

scanRouter.post("/check", ScanEventController);
scanRouter.post("/verified", VerifiedAttendanceController);

export default scanRouter;
