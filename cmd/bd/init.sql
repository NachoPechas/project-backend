CREATE TABLE role (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  description TEXT
);

CREATE TABLE book (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  author VARCHAR(255),
  category VARCHAR(255),
  publication_year INTEGER
);

CREATE TABLE study_seat (
  id SERIAL PRIMARY KEY,
  status VARCHAR(50) DEFAULT 'Disponible',
  location_details TEXT,
  computers INTEGER,
  tiempo_restante INTEGER DEFAULT 0
);

CREATE TABLE time_slot (
  id SERIAL PRIMARY KEY,
  start_time TIME,
  end_time TIME
);

CREATE TABLE "user" (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  role_id INTEGER REFERENCES role(id),
  email VARCHAR(255) UNIQUE,
  password VARCHAR(255),
  login_attempts INTEGER DEFAULT 0,
  lock_until TIMESTAMP NULL,
  status VARCHAR(50) DEFAULT 'Activo',
  provider_auth VARCHAR(20) DEFAULT 'local',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE item (
  id SERIAL PRIMARY KEY,
  book_id INTEGER REFERENCES book(id),
  description TEXT,
  physical_condition VARCHAR(100),
  availability_status VARCHAR(50) DEFAULT 'Disponible'
);

CREATE TABLE loan (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES "user"(id),
  item_id INTEGER REFERENCES item(id),
  loan_date DATE DEFAULT CURRENT_DATE,
  due_date DATE,
  return_date DATE,
  initial_condition VARCHAR(100),
  final_condition VARCHAR(100)
);

CREATE TABLE seat_reservation (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES "user"(id),
  seat_id INTEGER REFERENCES study_seat(id),
  slot_id INTEGER REFERENCES time_slot(id),
  reservation_date DATE DEFAULT CURRENT_DATE,
  status VARCHAR(50) DEFAULT 'Activa'
);

CREATE TABLE notification (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES "user"(id),
  message TEXT,
  type VARCHAR(50),
  sent_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(50) DEFAULT 'Pendiente'
);

CREATE TABLE penalty (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES "user"(id),
  loan_id INTEGER REFERENCES loan(id),
  amount NUMERIC(10,2),
  reason TEXT,
  status VARCHAR(50) DEFAULT 'Pendiente',
  created_date DATE DEFAULT CURRENT_DATE
);