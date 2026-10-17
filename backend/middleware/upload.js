import multer from "multer";

export const MAX_FILE_SIZE = 10 * 1024 * 1024;
export const MAX_JOB_DESCRIPTION_LENGTH = 50000;

export const uploadResume = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 1,
    fields: 1,
    fieldSize: MAX_JOB_DESCRIPTION_LENGTH * 4,
  },
});
