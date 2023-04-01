use super::jwt;
use crate::utils::{
	web::{ApiState, ToJsonWebResultExt, WebResult},
	{NonEmptyString, SecretNonEmptyString},
};
use axum::{extract::State, http::StatusCode, routing::post, Json, Router};
use serde::{Deserialize, Serialize};

pub fn router() -> Router<ApiState> {
	Router::new().route("/login", post(login))
}

#[derive(Deserialize)]
pub struct LoginRequest {
	pub email: NonEmptyString,
	pub password: SecretNonEmptyString,
}

#[derive(Serialize)]
pub struct LoginResponse {
	token: String,
}
pub async fn login(
	State(state): State<ApiState>,
	Json(body): Json<LoginRequest>,
) -> WebResult<LoginResponse> {
	jwt::authorize(state.db, body)
		.await
		.map(|token| (StatusCode::OK, LoginResponse { token }))
		.map_err(|e| e.to_web_error())
		.to_json()
}
