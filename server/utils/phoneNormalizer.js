export default function normalizePhone(phone) {
  if (!phone) return phone;
  if (phone.startsWith("+62")) return phone;
  if (phone.startsWith("62")) return "+" + phone;
  if (phone.startsWith("08")) return "+62" + phone.slice(1);
  if (phone.startsWith("8")) return "+62" + phone;
  return phone;
}
