export function isExternalUrl(url) {
  try {
    const { hostname } = new URL(url);
    const { hostname: currentHostname } = new URL(process.env.NEXT_PUBLIC_NEXTJS_HOST_URL);
    return !url?.startsWith('/') && hostname !== currentHostname && !url?.startsWith('tel');
  } catch (error) {
    return false;
  }
}

export function convertToDateObject(dateStr) {
  // Split date and time parts
  const parts = dateStr.split(' ');
  const dateParts = parts[0].split('/');
  const timePart = parts[1];
  const amPm = parts[2];

  // Reformat the date into YYYY-MM-DD
  const dateReformatted = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;

  // Convert time to 24-hour format
  let [hours, minutes] = timePart.split(':');
  hours = parseInt(hours, 10);

  // Adjust hours based on AM/PM
  if (amPm === 'PM' && hours !== 12) {
    hours += 12;
  } else if (amPm === 'AM' && hours === 12) {
    hours = 0; // Midnight case
  }

  // Create the full datetime string in ISO 8601 format (YYYY-MM-DDTHH:mm)
  const timeReformatted = `${('0' + hours).slice(-2)}:${minutes}`;
  const fullDateTime = `${dateReformatted}T${timeReformatted}`;

  // Return the new Date object
  return new Date(fullDateTime);
}

export const getPageUri = async (uri, slug, type) => {
  switch (type) {
    case "page":
      return uri;
    case "action-team":
      return uri;
    case "news":
      return `/news/${slug}`;
    case "event":
      return `/event/${slug}`;
    default:
      // Handle other types of paths here
      return "/";
  }
};
