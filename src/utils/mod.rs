use self::web::WebError;
use secrecy::SecretString;
use serde::de;
use serde::{Deserialize, Deserializer, Serialize};

pub mod web;

#[derive(Deserialize, Serialize)]
pub struct NonEmptyString(#[serde(deserialize_with = "from_string")] String);

impl NonEmptyString {
	pub fn value(&self) -> String {
		self.0.clone()
	}

	pub fn new(val: String) -> Result<Self, WebError> {
		if val.is_empty() {
			Err(WebError {
				message: "Input string was empty!".to_owned(),
			})
		} else {
			Ok(NonEmptyString(val))
		}
	}
}

#[derive(Deserialize)]
pub struct SecretNonEmptyString(#[serde(deserialize_with = "from_secret_string")] SecretString);

impl SecretNonEmptyString {
	pub fn value(self) -> SecretString {
		self.0
	}

	pub fn new(val: String) -> Result<Self, WebError> {
		if val.is_empty() {
			Err(WebError {
				message: "Input string was empty!".to_owned(),
			})
		} else {
			Ok(SecretNonEmptyString(SecretString::new(val)))
		}
	}
}

fn from_string<'de, D>(deserializer: D) -> Result<String, D::Error>
where
	D: Deserializer<'de>,
{
	let s: &str = Deserialize::deserialize(deserializer)?;
	NonEmptyString::new(s.to_owned())
		.map(|res| res.value())
		.map_err(|_| de::Error::custom("empty strings are not allowed"))
}

fn from_secret_string<'de, D>(deserializer: D) -> Result<SecretString, D::Error>
where
	D: Deserializer<'de>,
{
	let s: &str = Deserialize::deserialize(deserializer)?;
	SecretNonEmptyString::new(s.to_owned())
		.map(|res| res.value())
		.map_err(|_| de::Error::custom("empty strings are not allowed"))
}
