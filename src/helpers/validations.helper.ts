import { BookingPerson } from '@/types/models/bookingPerson.types';
import moment from 'moment';

const isEmail = (value: string) => /\S+@\S+\.\S+/.test(value);
const isPassword = (value: string) =>
  value.length >= 6 &&
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^\w\s]).{8,}$/.test(value);
const isNumber = (value: string) => /^\d+$/.test(value);
const isTel = (value: string) => /^07[2389][0-9]{7}$/.test(value);
const isText = (value: string) => /^\s*[\s\S]+?\s*$/.test(value);
const isUrl = (value: string) => /(ftp|http|https|www):\/\/[^ "]+$/.test(value);
const isTextarea = (value: string) => /^\s*[\s\S]+?\s*$/.test(value);
const isNid = (value: string) => value.length === 16;
const isTin = (value: string) => value.length === 9;
const isPassport = (value: string) => /^[a-zA-Z0-9]{12}$/g.test(value);
const isPlateNumber = (value: string) => /^R[A-Z]{2}\d{3}[A-Z]$/g.test(value);

export const validateInputs = (value: string, type: string) => {
  if (!value) {
    return false;
  }

  switch (type) {
    case 'email':
      return isEmail(value);
    case 'password':
      return isPassword(value);
    case 'number':
      return isNumber(value);
    case 'tel':
      return isTel(value);
    case 'text':
      return isText(value);
    case 'url':
      return isUrl(value);
    case 'textarea':
      return isTextarea(value);
    case 'nid':
      return isNid(value);
    case 'tin':
      return isTin(value);
    case 'passport':
      return isPassport(value);
    case 'plate_number':
      return isPlateNumber(value);
    default:
      return true;
  }
};

export const validatePersonAgeRange = (
  value: number,
  bookingPeople: BookingPerson[] | [],
  ageRange = 'adults'
) => {
  if (bookingPeople?.length <= 0) return false;
  const ageRangePeople = bookingPeople?.map((person) => {
    const age = moment().diff(person?.dateOfBirth, 'years');
    const range = age >= 13 ? 'adults' : age >= 6 ? 'children' : undefined;
    return range;
  });

  return ageRangePeople?.filter((range) => range === ageRange)?.length >= value;
};

export default validateInputs;
