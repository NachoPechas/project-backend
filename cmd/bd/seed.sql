<<<<<<< HEAD

INSERT INTO role (id, name, description) VALUES 
(1, 'Administrador' ,' Administrador General'),
(2, 'Bibliotecario', 'Gestor de préstamos y devoluciones, actualización de ejemplares y gestión operativa de penalizaciones.'),
(3, 'Estudiante', 'Usuario final. Consulta de catálogo, historial personal, reserva de puestos de estudio y préstamos.');
=======

INSERT INTO role (id, name, description) VALUES 
(1, 'Administrador' ,' Administrador General'),
(2, 'Bibliotecario', 'Gestor de préstamos y devoluciones, actualización de ejemplares y gestión operativa de penalizaciones.'),
(3, 'Estudiante', 'Usuario final. Consulta de catálogo, historial personal, reserva de puestos de estudio y préstamos.');
>>>>>>> 3cb6c85 (Docker integratios with initial Backend service)

DELIMITER $$
CREATE TRIGGER trg_item_loan
AFTER INSERT ON loan
FOR EACH ROW
BEGIN
    UPDATE item
    SET availability_status = 'Prestado'
    WHERE id = NEW.item_id;
END$$

CREATE TRIGGER trg_item_return
AFTER UPDATE ON loan
FOR EACH ROW
BEGIN
    IF NEW.return_date IS NOT NULL THEN
        UPDATE item
        SET availability_status = 'Disponible'
        WHERE id = NEW.item_id;
    END IF;
END$$

CREATE TRIGGER trg_damaged_item
AFTER UPDATE ON item
FOR EACH ROW
BEGIN
    IF NEW.physical_condition = 'Dañado' THEN
        UPDATE item
        SET availability_status = 'Mantenimiento'
        WHERE id = NEW.id;
    END IF;
END$$

CREATE TRIGGER trg_seat_reserved
AFTER INSERT ON seat_reservation
FOR EACH ROW
BEGIN
    UPDATE study_seat
    SET status = 'Ocupado'
    WHERE id = NEW.seat_id;
END$$

CREATE TRIGGER trg_seat_available
AFTER UPDATE ON seat_reservation
FOR EACH ROW
BEGIN
    IF NEW.status = 'Cancelada' OR NEW.status = 'Finalizada' THEN
        UPDATE study_seat
        SET status = 'Disponible'
        WHERE id = NEW.seat_id;
    END IF;
END$$

CREATE TRIGGER trg_late_return
AFTER UPDATE ON loan
FOR EACH ROW
BEGIN
    IF NEW.return_date > NEW.due_date THEN
        INSERT INTO penalty(
            user_id,
            loan_id,
            amount,
            reason,
            status,
            created_date
        )
        VALUES(
            NEW.user_id,
            NEW.id,
            5000,
            'Entrega tardía del ejemplar',
            'Pendiente',
            CURRENT_DATE
        );
    END IF;
END$$

CREATE TRIGGER trg_user_lock
AFTER UPDATE ON user
FOR EACH ROW
BEGIN
    IF NEW.failed_attempts >= 5 THEN
        UPDATE user
        SET status = 'Bloqueado'
        WHERE id = NEW.id;
    END IF;
END$$

CREATE TRIGGER trg_penalty_notification
AFTER INSERT ON penalty
FOR EACH ROW
BEGIN
    INSERT INTO notification(
        user_id,
        message,
        type,
        sent_date,
        status
    )
    VALUES(
        NEW.user_id,
        'Se ha generado una penalización en tu cuenta',
        'Penalización',
        CURRENT_TIMESTAMP,
        'Enviado'
    );
END$$


DELIMITER ;

CREATE UNIQUE INDEX idx_user_email ON user(email);

CREATE INDEX idx_book_title ON book(title);
CREATE INDEX idx_book_author ON book(author);
CREATE INDEX idx_book_category ON book(category);

CREATE INDEX idx_loan_user ON loan(user_id);

CREATE INDEX idx_reservation_check
ON seat_reservation(seat_id, reservation_date, slot_id);

CREATE INDEX idx_notification_user ON notification(user_id);

CREATE INDEX idx_penalty_user ON penalty(user_id);

CREATE INDEX idx_item_book ON item(book_id);
