------------------------------ GROUPS TABLE ------------------------------
-- Groups table where children are organized into groups within a kindergarten
CREATE TABLE groups (
                        id UUID PRIMARY KEY,
                        name VARCHAR(100) NOT NULL,
                        description VARCHAR(500),
                        kindergarten_id UUID NOT NULL REFERENCES kindergartens(id),
                        age_range VARCHAR(50),
                        max_capacity INTEGER,
                        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
                        updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
                        UNIQUE(name, kindergarten_id)
);

CREATE TABLE staff_group_assignments (
                                         id UUID PRIMARY KEY,
                                         staff_id UUID NOT NULL REFERENCES staff(id),
                                         group_id UUID NOT NULL REFERENCES groups(id),
                                         assigned_at TIMESTAMP NOT NULL DEFAULT NOW(),
                                         is_responsible BOOLEAN NOT NULL DEFAULT false,
                                         UNIQUE(staff_id, group_id)
);

-- Indexes
CREATE INDEX idx_groups_kindergarten ON groups(kindergarten_id);
CREATE INDEX idx_staff_group_staff ON staff_group_assignments(staff_id);
CREATE INDEX idx_staff_group_group ON staff_group_assignments(group_id);