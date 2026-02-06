import { IT_LECTURERS } from './itLecturers';
import { BUSINESS_LECTURERS } from './businessLecturers';
import { DESIGN_LECTURERS } from './designLecturers';
import { LAW_LECTURERS } from './lawLecturers';
import { LANGUAGES_LECTURERS } from './languagesLecturers';
import { LecturerData } from '../../types';

export const ALL_LECTURERS: LecturerData[] = [
  ...IT_LECTURERS,
  ...BUSINESS_LECTURERS,
  ...DESIGN_LECTURERS,
  ...LAW_LECTURERS,
  ...LANGUAGES_LECTURERS,
];

export {
  IT_LECTURERS,
  BUSINESS_LECTURERS,
  DESIGN_LECTURERS,
  LAW_LECTURERS,
  LANGUAGES_LECTURERS,
};
