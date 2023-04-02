export interface Person {
	readonly first_name: string;
	readonly last_name: string;

	readonly profile: Profile;
}

export interface Profile {
	readonly age: number;
	readonly accounts: Array<Account>;
	readonly retirementAge: number;
	readonly monthlyPension: number;
	readonly monthsOfPension: number;
}

export interface Account {
	readonly name: string;
	readonly amount: number;
	readonly monthlyInstallment: number;
	readonly color: string;
}
