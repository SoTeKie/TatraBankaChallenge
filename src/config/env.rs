use clap::Parser;
use lazy_static::lazy_static;
use std::{env, net::IpAddr};

lazy_static! {
	pub static ref JWT_SECRET: String = env::var("JWT_SECRET").expect("JWT_SECRET must be set");
}

#[derive(Debug, Parser)]
pub struct ServerConfig {
	#[clap(default_value = "127.0.0.1", env)]
	pub host: IpAddr,
	#[clap(default_value = "3000", env)]
	pub port: u16,
}

#[derive(Debug, Parser)]
pub struct DbConfig {
	#[clap(
		default_value = "postgres://postgres:postgres@localhost/axum_messenger",
		env
	)]
	pub database_url: String,
}
