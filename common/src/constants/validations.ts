export const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[~!@#\$%\^&\*])(?=.{8,})/;
export const passwordDescription =
	"Password must contain: upper-case, lower-case, number, special char and minimum 8 chars";
export const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
