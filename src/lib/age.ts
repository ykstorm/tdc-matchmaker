export function ageFrom(dateOfBirth: string, today = new Date()) {
  const born = new Date(dateOfBirth);
  const age = today.getFullYear() - born.getFullYear();
  const birthdayPassed =
    today.getMonth() > born.getMonth() ||
    (today.getMonth() === born.getMonth() && today.getDate() >= born.getDate());
  return birthdayPassed ? age : age - 1;
}
