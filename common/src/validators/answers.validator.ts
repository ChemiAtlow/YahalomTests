import {
	registerDecorator,
	ValidationOptions,
	ValidationArguments,
	isArray,
	arrayNotEmpty,
} from "class-validator";

export function IsWithAtLeastOneCorrectAnswer(
	validationOptions?: ValidationOptions
) {
	return function(object: Object, propertyName: string) {
		registerDecorator({
			name: "isWithAtLeastOneCorrectAnswer",
			target: object.constructor,
			propertyName: propertyName,
			options: validationOptions,
			validator: {
				validate(value: any[]) {
					return (
						Array.isArray(value) &&
						value.filter(i => i.correct).length > 0
					);
				},
				defaultMessage(args) {
					return `${propertyName} must have one or more correct answer`;
				},
			},
		});
	};
}
