CREATE TABLE role (
  id INTEGER PRIMARY KEY,
  name VARCHAR(255),
  description TEXT
);

CREATE TABLE book (
  id INTEGER PRIMARY KEY,
  title VARCHAR(255),
  author VARCHAR(255),
  category VARCHAR(255),
  publication_year INT
);

CREATE TABLE study_seat (
  id INTEGER PRIMARY KEY,
  status VARCHAR(50),
  location_details TEXT,
  computers INT
);

CREATE TABLE time_slot (
  id INTEGER PRIMARY KEY,
  start_time TIME,
  end_time TIME
);

CREATE TABLE userr (
  id INTEGER PRIMARY KEY,
  name VARCHAR(255),
  role_id INTEGER, 
  email VARCHAR(255),
  status VARCHAR(50),
  CONSTRAINT fk_user_role FOREIGN KEY (role_id) REFERENCES role(id)
);

CREATE TABLE item (
  id INTEGER PRIMARY KEY,
  book_id INTEGER, 
  description TEXT,
  physical_condition VARCHAR(100),
  availability_status VARCHAR(50),
  CONSTRAINT fk_item_book FOREIGN KEY (book_id) REFERENCES book(id)
);

CREATE TABLE loan (
  id INTEGER PRIMARY KEY,
  user_id INTEGER,
  item_id INTEGER,
  loan_date DATE,
  due_date DATE,
  return_date DATE,
  initial_condition VARCHAR(100),
  final_condition VARCHAR(100),
  CONSTRAINT fk_loan_user FOREIGN KEY (user_id) REFERENCES user(id),
  CONSTRAINT fk_loan_item FOREIGN KEY (item_id) REFERENCES item(id)
);

CREATE TABLE seat_reservation (
  id INTEGER PRIMARY KEY,
  user_id INTEGER,
  seat_id INTEGER,
  slot_id INTEGER,
  reservation_date DATE,
  status VARCHAR(50),
  CONSTRAINT fk_res_user FOREIGN KEY (user_id) REFERENCES user(id),
  CONSTRAINT fk_res_seat FOREIGN KEY (seat_id) REFERENCES study_seat(id),
  CONSTRAINT fk_res_slot FOREIGN KEY (slot_id) REFERENCES time_slot(id)
);