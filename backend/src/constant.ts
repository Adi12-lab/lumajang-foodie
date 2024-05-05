export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
export const JWT_EXPIRE = +process.env.JWT_TOKEN_EXPIRE_HOUR * 60 * 60 * 1000;
export const indoDays = [
  'Senin',
  'Selasa',
  'Rabu',
  'Kamis',
  'Jumat',
  'Sabtu',
  'Minggu',
];

export type CountResult = {
  total: number;
};

export const MAX_PROFILE_PICTURE_SIZE_IN_BYTES = 2 * 1024 * 1024;
export const VALID_UPLOADS_MIME_TYPES = ['image/jpeg', 'image/png'];
