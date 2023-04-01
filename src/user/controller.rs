use crate::{
	auth::jwt::ExtractUser,
	utils::web::{ApiState, ToJsonWebResultExt, WebResult},
};
use axum::http::StatusCode;
use axum::routing::get;
use axum::Router;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Serialize, Deserialize, sqlx::Type)]
#[sqlx(transparent)]
pub struct UserId(pub Uuid);

#[derive(Serialize)]
pub struct User {
	pub user_id: UserId,
	pub first_name: String,
	pub last_name: String,
	pub email: String,
}

pub fn router() -> Router<ApiState> {
	Router::new().route("/me", get(index))
}

async fn index(ExtractUser(user): ExtractUser) -> WebResult<User> {
	Result::Ok((StatusCode::OK, user)).to_json()
}
