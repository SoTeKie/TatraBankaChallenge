use crate::{
	auth::controller::LoginRequest,
	config::env::JWT_SECRET,
	user::controller::{User, UserId},
	utils::web::{ApiState, WebError},
};
use axum::{
	async_trait,
	extract::{FromRef, FromRequestParts, State, TypedHeader},
	headers::{authorization::Bearer, Authorization},
	http::{request::Parts, Request, StatusCode},
	middleware::Next,
	response::{IntoResponse, Response},
	Json, RequestPartsExt,
};
use chrono::{Duration, Utc};
use jsonwebtoken::{DecodingKey, EncodingKey, Header, Validation};
use secrecy::ExposeSecret;
use serde::{Deserialize, Serialize};
use sha3::{Digest, Sha3_256};
use sqlx::PgPool;

pub async fn middleware<B>(
	State(state): State<ApiState>,
	TypedHeader(token): TypedHeader<Authorization<Bearer>>,
	request: Request<B>,
	next: Next<B>,
) -> Result<Response, AuthError> {
	let claims = get_token_data(token.token())?;
	let user = user_from_token(state.db, claims).await;
	match user {
		Ok(_) => {
			let response = next.run(request).await;
			Ok(response)
		}
		Err(sc) => Err(sc),
	}
}
fn get_token_data(token: &str) -> Result<Claims, AuthError> {
	let claims = jsonwebtoken::decode::<Claims>(
		token,
		&DecodingKey::from_secret(JWT_SECRET.as_bytes()),
		&Validation::default(),
	)
	.map(|data| data.claims)
	.map_err(|_| AuthError::InvalidToken);

	match claims {
		Ok(c) if c.exp < Utc::now().timestamp() => Err(AuthError::InvalidToken),
		rest => rest,
	}
}

async fn user_from_token(db_connection: PgPool, claims: Claims) -> Result<User, AuthError> {
	let person = sqlx::query_as!(
		User,
		r#"SELECT user_id as "user_id: UserId", first_name, last_name, email FROM users WHERE user_id = $1 LIMIT 1"#,
        claims.sub.0
	)
	.fetch_one(&db_connection)
	.await;
	person.map_err(|_| AuthError::InvalidToken)
}

pub async fn authorize(db_connection: PgPool, req: LoginRequest) -> Result<String, AuthError> {
	let password_hash = Sha3_256::digest(req.password.value().expose_secret().as_bytes());

	let password_hash = format!("{:x}", password_hash);

	let user_id: UserId = sqlx::query_scalar!(
		r#"SELECT user_id FROM users WHERE email = $1 AND password_hash = $2"#,
		req.email.value(),
		password_hash
	)
	.fetch_one(&db_connection)
	.await
	.map(UserId)
	.map_err(|_| AuthError::WrongCredentials)?;

	token_from_user_id(user_id).await
}

async fn token_from_user_id(user_id: UserId) -> Result<String, AuthError> {
	jsonwebtoken::encode(
		&Header::default(),
		&Claims::new(user_id),
		&EncodingKey::from_secret(JWT_SECRET.as_bytes()),
	)
	.map_err(|_| AuthError::TokenCreation)
}

pub struct ExtractUser(pub User);

#[async_trait]
impl<S> FromRequestParts<S> for ExtractUser
where
	PgPool: FromRef<S>,
	S: Send + Sync,
{
	type Rejection = AuthError;

	async fn from_request_parts(parts: &mut Parts, state: &S) -> Result<Self, Self::Rejection> {
		let db_conn = PgPool::from_ref(state);
		let TypedHeader(Authorization(bearer)) = parts
			.extract::<TypedHeader<Authorization<Bearer>>>()
			.await
			.map_err(|_| AuthError::InvalidToken)?;

		let claims = get_token_data(bearer.token())?;
		user_from_token(db_conn, claims).await.map(ExtractUser)
	}
}

#[derive(Deserialize, Serialize)]
pub struct Claims {
	pub sub: UserId,
	pub exp: i64,
	pub iat: i64,
}

impl Claims {
	pub fn new(id: UserId) -> Self {
		let iat = Utc::now();
		let exp = iat + Duration::hours(24);

		Self {
			sub: id,
			iat: iat.timestamp(),
			exp: exp.timestamp(),
		}
	}
}

pub enum AuthError {
	WrongCredentials,
	TokenCreation,
	InvalidToken,
}

impl IntoResponse for AuthError {
	fn into_response(self) -> Response {
		let (code, res) = self.to_web_error();
		(code, Json(res)).into_response()
	}
}

impl AuthError {
	pub fn to_web_error(self) -> (StatusCode, WebError) {
		let (status, error_message) = match self {
			AuthError::WrongCredentials => (StatusCode::UNAUTHORIZED, "Wrong credentials"),
			AuthError::TokenCreation => {
				(StatusCode::INTERNAL_SERVER_ERROR, "Internal server error")
			}
			AuthError::InvalidToken => (StatusCode::BAD_REQUEST, "Invalid token"),
		};
		let body = WebError {
			message: String::from(error_message),
		};
		(status, body)
	}
}
