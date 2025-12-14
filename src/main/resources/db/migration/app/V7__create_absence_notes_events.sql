------------------------------ ABSENCES TABLE ------------------------------
CREATE TABLE absences (
                          id UUID PRIMARY KEY,
                          child_id UUID NOT NULL REFERENCES children(id),
                          start_date DATE NOT NULL,
                          end_date DATE NOT NULL,
                          type VARCHAR(20) NOT NULL,  -- PLANNED, UNPLANNED
                          status VARCHAR(20) NOT NULL DEFAULT 'PENDING',  -- PENDING, APPROVED, REJECTED
                          reason VARCHAR(500),
                          reported_by UUID NOT NULL,
                          reported_by_type VARCHAR(20) NOT NULL,  -- PARENT, STAFF
                          approved_by_staff UUID,
                          approved_at TIMESTAMP,
                          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
                          CONSTRAINT check_dates CHECK (end_date >= start_date)
);

CREATE INDEX idx_absences_child ON absences(child_id);
CREATE INDEX idx_absences_dates ON absences(start_date, end_date);
CREATE INDEX idx_absences_child_dates ON absences(child_id, start_date, end_date);

------------------------------ NOTES TABLE ------------------------------
CREATE TABLE notes (
                       id UUID PRIMARY KEY,
                       child_id UUID REFERENCES children(id),  -- NULL = kindergarten-wide note
                       kindergarten_id UUID NOT NULL REFERENCES kindergartens(id),
                       title VARCHAR(200),
                       content TEXT NOT NULL,
                       note_date DATE NOT NULL,
                       created_by UUID NOT NULL,
                       created_by_type VARCHAR(20) NOT NULL,  -- PARENT, STAFF
                       created_at TIMESTAMP NOT NULL DEFAULT NOW(),
                       updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notes_child ON notes(child_id);
CREATE INDEX idx_notes_kindergarten ON notes(kindergarten_id);
CREATE INDEX idx_notes_date ON notes(note_date);

------------------------------ CALENDAR EVENTS TABLE ------------------------------
CREATE TABLE calendar_events (
                                 id UUID PRIMARY KEY,
                                 kindergarten_id UUID NOT NULL REFERENCES kindergartens(id),
                                 group_id UUID REFERENCES groups(id),  -- NULL = all groups
                                 title VARCHAR(200) NOT NULL,
                                 description TEXT,
                                 event_date DATE NOT NULL,
                                 start_time TIME,
                                 end_time TIME,
                                 location VARCHAR(300),
                                 created_by UUID NOT NULL,
                                 created_at TIMESTAMP NOT NULL DEFAULT NOW(),
                                 updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_events_kindergarten ON calendar_events(kindergarten_id);
CREATE INDEX idx_events_group ON calendar_events(group_id);
CREATE INDEX idx_events_date ON calendar_events(event_date);