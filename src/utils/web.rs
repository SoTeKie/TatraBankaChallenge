use axum::extract::FromRef;
use axum::http::StatusCode;
use axum::Json;
use serde::Serialize;
use sqlx::PgPool;
use std::fmt;

#[derive(Serialize)]
pub struct WebError {
	pub message: String,
}

impl fmt::Display for WebError {
	fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
		write!(f, "{}", self.message)
	}
}

pub type WebResult<T> = Result<(StatusCode, Json<T>), (StatusCode, Json<WebError>)>;

pub trait ToJsonWebResultExt<T> {
	fn to_json(self) -> WebResult<T>;
}

impl<T> ToJsonWebResultExt<T> for Result<(StatusCode, T), (StatusCode, WebError)> {
	fn to_json(self) -> WebResult<T> {
		self.map(|r| (r.0, Json(r.1))).map_err(|e| (e.0, Json(e.1)))
	}
}

pub fn internal_error() -> (StatusCode, WebError) {
	(
		StatusCode::INTERNAL_SERVER_ERROR,
		WebError {
			message: String::from("Internal server error. Please try again later!"),
		},
	)
}
#[derive(Clone, FromRef)]
pub struct ApiState {
	pub db: PgPool,
}
