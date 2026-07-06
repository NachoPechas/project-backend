
INSERT INTO role(name,description) VALUES
('Administrador','Acceso total'),
('Bibliotecario','Gestiona préstamos'),
('Estudiante','Usuario final');

INSERT INTO book(title,author,category,publication_year) VALUES
('Clean Code','Robert C. Martin','Software',2008),
('Introduction to Algorithms','Thomas H. Cormen','Algoritmos',2022),
('Design Patterns','Gang of Four','Software',1994),
('The Pragmatic Programmer','Andrew Hunt','Software',1999),
('Artificial Intelligence','Stuart Russell','IA',2021),
('Database System Concepts','Silberschatz','Bases de Datos',2020),
('Computer Networks','Andrew Tanenbaum','Redes',2019),
('Operating System Concepts','Silberschatz','Sistemas Operativos',2021);

INSERT INTO time_slot(start_time,end_time) VALUES
('08:00','10:00'),
('10:00','12:00'),
('12:00','14:00'),
('14:00','16:00'),
('16:00','18:00');


INSERT INTO usuarios(nombre,role_id,email,activo,rol,"proveedorAuth","createdAt","updatedAt") VALUES
('Tomás Angarita',3,'tangaritac@unal.edu.co',TRUE,'estudiante','google',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('Laura Gómez',2,'lgomez@unal.edu.co',TRUE,'bibliotecario','local',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('Carlos Rodríguez',1,'crodriguez@unal.edu.co',TRUE,'administrador','local',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('María Pérez',3,'mperez@unal.edu.co',TRUE,'estudiante','local',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('Juan López',3,'jlopez@unal.edu.co',TRUE,'estudiante','google',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('Ana Torres',3,'atorres@unal.edu.co',TRUE,'estudiante','local',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('Felipe Díaz',2,'fdiaz@unal.edu.co',TRUE,'bibliotecario','local',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('Sofía Ramírez',3,'sramirez@unal.edu.co',TRUE,'estudiante','google',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);

INSERT INTO study_seat(status,location_details,computers,tiempo_restante) VALUES
('Disponible','Piso 1 - A1',1,0),
('Disponible','Piso 1 - A2',0,0),
('Disponible','Piso 2 - B1',1,0),
('Ocupado','Piso 2 - B2',1,45),
('Disponible','Piso 3 - C1',0,0),
('Mantenimiento','Piso 3 - C2',1,0),
('Ocupado','Piso 1 - A3',0,20),
('Disponible','Piso 2 - B3',1,0);


INSERT INTO item(book_id,description,physical_condition,availability_status) VALUES
(1,'Ejemplar A','Excelente','Disponible'),
(1,'Ejemplar B','Bueno','Prestado'),
(2,'Ejemplar A','Excelente','Disponible'),
(3,'Ejemplar A','Bueno','Disponible'),
(4,'Ejemplar A','Excelente','Disponible'),
(5,'Ejemplar A','Bueno','Prestado'),
(6,'Ejemplar A','Excelente','Disponible'),
(7,'Ejemplar A','Regular','Disponible'),
(8,'Ejemplar A','Excelente','Disponible');


INSERT INTO loan(user_id,item_id,loan_date,due_date,initial_condition,final_condition) VALUES
(1,2,CURRENT_DATE,CURRENT_DATE+7,'Bueno',NULL),
(4,6,CURRENT_DATE-2,CURRENT_DATE+5,'Bueno',NULL),
(5,3,CURRENT_DATE-5,CURRENT_DATE+2,'Excelente',NULL),
(6,4,CURRENT_DATE-1,CURRENT_DATE+6,'Bueno',NULL);

INSERT INTO seat_reservation(user_id,seat_id,slot_id,reservation_date,status) VALUES
(2,1,1,CURRENT_DATE,'Activa'),
(3,4,2,CURRENT_DATE,'Activa'),
(4,5,3,CURRENT_DATE,'Activa'),
(5,2,4,CURRENT_DATE,'Finalizada'),
(6,8,5,CURRENT_DATE,'Activa');


INSERT INTO notification(user_id,message,type,sent_date,status) VALUES
(1,'Reserva confirmada','Reserva',CURRENT_TIMESTAMP,'Enviada'),
(2,'Libro próximo a vencer','Préstamo',CURRENT_TIMESTAMP,'Enviada'),
(3,'Su reserva fue aprobada','Reserva',CURRENT_TIMESTAMP,'Enviada'),
(4,'Debe devolver un libro mañana','Préstamo',CURRENT_TIMESTAMP,'Pendiente'),
(5,'Nueva multa registrada','Multa',CURRENT_TIMESTAMP,'Enviada'),
(6,'Puesto disponible nuevamente','Reserva',CURRENT_TIMESTAMP,'Enviada'),
(7,'Préstamo realizado con éxito','Préstamo',CURRENT_TIMESTAMP,'Enviada');


INSERT INTO penalty(user_id,loan_id,amount,reason,status,created_date) VALUES
(1,1,5000,'Entrega tardía','Pendiente',CURRENT_DATE),
(4,2,8000,'Daño menor al libro','Pagada',CURRENT_DATE-3),
(5,3,12000,'Pérdida del libro','Pendiente',CURRENT_DATE-5),
(6,4,3000,'Entrega fuera de tiempo','Pagada',CURRENT_DATE-1);