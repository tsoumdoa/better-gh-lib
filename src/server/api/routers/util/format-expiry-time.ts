import { Duration } from "effect";
export default function formatShareExpiryTime(expiryTime: number) {
	let formattedExpiryTime = "";
	const duration = Duration.seconds(expiryTime);
	const minutes = Duration.toMinutes(duration);
	if (minutes < 60) {
		formattedExpiryTime = `${minutes.toFixed(0)} ${minutes.toFixed(0) === "1" ? "minute" : "minutes"}`;
	} else if (minutes < 1440) {
		const hour = Duration.toHours(duration);
		formattedExpiryTime = `${hour.toFixed(1)} ${hour <= 1.0 ? "hour" : "hours"}`;
	} else {
		const days = Duration.toDays(duration);
		formattedExpiryTime = `${days.toFixed(0)} ${days.toFixed(0) === "1" ? "day" : "days"}`;
	}

	return formattedExpiryTime;
}
