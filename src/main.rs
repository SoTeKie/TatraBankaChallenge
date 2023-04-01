use auth::jwt;
use axum::{middleware, Router};
use clap::Parser;
use sqlx::postgres::PgPoolOptions;
use std::net::SocketAddr;
use utils::web::ApiState;

mod auth;
mod config;
mod user;
mod utils;

#[tokio::main]
async fn main() {
	dotenvy::dotenv().ok();
	let db_config = config::env::DbConfig::parse();
	let pool = PgPoolOptions::new()
		.max_connections(10)
		.connect(&db_config.database_url)
		.await
		.expect("Can't connect to db");

	let state = ApiState { db: pool };

	let app_router = Router::new()
		.nest("/user", user::controller::router())
		.with_state(state.clone())
		.layer(middleware::from_fn_with_state(
			state.clone(),
			jwt::middleware,
		));

	let auth_router = Router::new()
		.nest("/auth", auth::controller::router())
		.with_state(state);

	let app = Router::merge(app_router, auth_router);
	let server_config = config::env::ServerConfig::parse();
	let addr = SocketAddr::from((server_config.host, server_config.port));
	axum::Server::bind(&addr)
		.serve(app.into_make_service())
		.await
		.expect("Failed to start server");
}
