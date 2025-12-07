------------------------------ KINDERGARTEN TABLE ------------------------------
-- Stores kindergarten information

CREATE TABLE kindergartens (
                               id UUID PRIMARY KEY,
                               name VARCHAR(255) NOT NULL UNIQUE, -- Kindergarten name
                               address VARCHAR(500), -- Physical address
                               phone_number VARCHAR(20), -- Contact phone
                               email VARCHAR(255) -- Contact email
);

-- PARENTS TABLE ------------------------------
-- Stores parent/guardian information
CREATE TABLE parents (
                         id UUID PRIMARY KEY,
                         first_name VARCHAR(100) NOT NULL,
                         last_name VARCHAR(100) NOT NULL,
                         email VARCHAR(255) NOT NULL, -- Duplicated from User for convenience
                         phone_number VARCHAR(20),
                         address VARCHAR(500),
                         can_pickup BOOLEAN NOT NULL DEFAULT true -- Can this parent pick up the child
);

------------------------------ STAFF TABLE ------------------------------
-- Stores staff information
CREATE TABLE staff (
                       id UUID PRIMARY KEY,
                       first_name VARCHAR(100) NOT NULL,
                       last_name VARCHAR(100) NOT NULL,
                       employee_id VARCHAR(50) UNIQUE, -- Staff employee number
                       phone_number VARCHAR(20),
                       email VARCHAR(255) NOT NULL,
                       position VARCHAR(100), -- Job title
                       kindergarten_id UUID REFERENCES kindergartens(id) -- Which kindergarten they work at
);

------------------------------ CHILD TABLE ------------------------------
-- Stores child information
CREATE TABLE children (
                          id UUID PRIMARY KEY,
                          first_name VARCHAR(100) NOT NULL,
                          last_name VARCHAR(100) NOT NULL,
                          birth_date DATE NOT NULL,
                          group_name VARCHAR(50), -- Class/group name
                          health_data_id UUID, -- Links to health_data table (one-to-one)
                          kindergarten_id UUID REFERENCES kindergartens(id), -- Which kindergarten child attends
                          checked_in BOOLEAN NOT NULL DEFAULT false -- Is child currently in kindergarten?
);

------------------------------ PARENT_CHILD RELATIONSHIP TABLE ------------------------------
-- Many-to-many: One parent can have multiple children, one child can have multiple parents
CREATE TABLE parent_child_relationships (
                                            id UUID PRIMARY KEY,
                                            parent_id UUID NOT NULL, -- References parents table
                                            child_id UUID NOT NULL, -- References children table
                                            relationship_type VARCHAR(50), -- "MOTHER", "FATHER", "GUARDIAN", etc.
                                            can_pickup BOOLEAN NOT NULL DEFAULT true, -- Can this parent pick up this child?
                                            can_drop_off BOOLEAN NOT NULL DEFAULT true, -- Can this parent drop off this child?
                                            is_primary_contact BOOLEAN NOT NULL DEFAULT false, -- Primary emergency contact?
                                            requires_id_verification BOOLEAN NOT NULL DEFAULT false, -- Must show ID
                                            UNIQUE(parent_id, child_id) -- Can't have duplicate parent-child pairs
);

------------------------------ HEALTH TABLE ------------------------------
-- Stores sensitive medical information for children
CREATE TABLE health_data (
                             id UUID PRIMARY KEY,
                             child_id UUID NOT NULL UNIQUE, -- One-to-one with children table
                             medical_conditions TEXT, -- Asthma, diabetes, etc. (TODO: encrypt)
                             allergies TEXT, -- Food/environmental allergies (TODO: encrypt)
                             medications TEXT, -- Current medications and instructions (TODO: encrypt)
                             emergency_contact TEXT, -- Emergency contact if different from parents
                             dietary_restrictions TEXT -- Dietary needs (vegetarian, halal, etc.)
);

------------------------------ CHECK-IN/OUT LOG TABLE ------------------------------
-- Audit trail of all check-ins and check-outs
CREATE TABLE check_in_out_log (
                                  id UUID PRIMARY KEY,
                                  child_id UUID NOT NULL, -- Which child

    -- Check-in fields
                                  check_in_time TIMESTAMP, -- When child arrived
                                  dropped_off_by UUID, -- Who dropped off (parent/staff UUID)
                                  dropped_off_by_type VARCHAR(20), -- PARENT, STAFF, or OTHER
                                  check_in_confirmed_by_staff UUID, -- Staff who confirmed check-in
                                  dropped_off_by_name VARCHAR(255), -- Name if OTHER type

    -- Check-out fields
                                  check_out_time TIMESTAMP, -- When child left (NULL = still here)
                                  picked_up_by UUID, -- Who picked up (parent/staff UUID)
                                  picked_up_by_type VARCHAR(20), -- PARENT, STAFF, or OTHER
                                  check_out_approved_by_staff UUID, -- Staff who approved pickup
                                  picked_up_by_name VARCHAR(255), -- Name if OTHER type
                                  id_verified BOOLEAN DEFAULT false, -- Was ID checked?

                                  notes TEXT, -- Optional notes about check-in/out
                                  created_at TIMESTAMP NOT NULL -- When this record was created
);

------------------------------ INDEXES FOR FAST LOOKUPS ------------------------------
-- Kindergarten lookups
CREATE INDEX idx_children_kindergarten ON children(kindergarten_id);
CREATE INDEX idx_staff_kindergarten ON staff(kindergarten_id);

-- Parent-child relationship lookups
CREATE INDEX idx_parent_child_parent ON parent_child_relationships(parent_id);
CREATE INDEX idx_parent_child_child ON parent_child_relationships(child_id);

-- Check in/out queries
CREATE INDEX idx_check_in_out_child ON check_in_out_log(child_id);
CREATE INDEX idx_check_in_out_active ON check_in_out_log(child_id, check_out_time); -- Find active check-ins

-- Health data lookup
CREATE INDEX idx_health_data_child ON health_data(child_id);