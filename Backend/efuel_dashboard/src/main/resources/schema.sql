-- Clear existing data (for development)
DELETE FROM user_roles;
DELETE FROM roles;
DELETE FROM users;
DELETE FROM fuel_prices;
DELETE FROM fuel_stations;

-- Insert roles
INSERT INTO roles(name) VALUES('ROLE_USER');
INSERT INTO roles(name) VALUES('ROLE_ADMIN');

-- Insert admin user (password: admin123)
INSERT INTO users(username, email, password, created_at) 
VALUES('admin', 'admin@efuel.com', '$2a$10$ixElCCprZ99SNqYK3GQZQO5.5UQ7MZQGXuF/4wz7JNvj3Yd3XqXbK', CURRENT_TIMESTAMP);

-- Insert regular users (password: user123)
INSERT INTO users(username, email, password, created_at) 
VALUES('user1', 'user1@efuel.com', '$2a$10$ixElCCprZ99SNqYK3GQZQO5.5UQ7MZQGXuF/4wz7JNvj3Yd3XqXbK', CURRENT_TIMESTAMP);
INSERT INTO users(username, email, password, created_at) 
VALUES('user2', 'user2@efuel.com', '$2a$10$ixElCCprZ99SNqYK3GQZQO5.5UQ7MZQGXuF/4wz7JNvj3Yd3XqXbK', CURRENT_TIMESTAMP);

-- Assign roles
INSERT INTO user_roles(user_id, role_id) VALUES(1, 2); -- admin is ADMIN
INSERT INTO user_roles(user_id, role_id) VALUES(2, 1); -- user1 is USER
INSERT INTO user_roles(user_id, role_id) VALUES(3, 1); -- user2 is USER

-- Insert fuel stations
INSERT INTO fuel_stations(name, location, status, latitude, longitude, created_at, updated_at)
VALUES('Kigali Heights Fuel', 'KN 45 St, Kigali', 'AVAILABLE', -1.9536, 30.0606, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO fuel_stations(name, location, status, latitude, longitude, created_at, updated_at)
VALUES('Green Energy Station', 'RW 101, Gisenyi', 'UNAVAILABLE', -1.6927, 29.2566, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert fuel prices
INSERT INTO fuel_prices(station_id, fuel_type, price, recorded_at)
VALUES(1, 'PETROL', 1450, CURRENT_TIMESTAMP);

INSERT INTO fuel_prices(station_id, fuel_type, price, recorded_at)
VALUES(1, 'DIESEL', 1380, CURRENT_TIMESTAMP);

INSERT INTO fuel_prices(station_id, fuel_type, price, recorded_at)
VALUES(2, 'PETROL', 1420, CURRENT_TIMESTAMP);

INSERT INTO fuel_prices(station_id, fuel_type, price, recorded_at)
VALUES(2, 'DIESEL', 1350, CURRENT_TIMESTAMP);