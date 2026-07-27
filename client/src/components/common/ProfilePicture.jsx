import DefaultAvatar from "../../assets/default-avatar.png";
import { getImageUrl } from "../../utils/imageHelpers";

export default function ProfilePicture({ src, alt, size = 40 }) {
  return (
    <img
      src={getImageUrl(src, {
        fallback: DefaultAvatar,
        width: size,
        height: size,
      })}
      alt={alt}
      className="rounded-full object-cover"
      style={{ width: size, height: size }}
    />
  );
}
