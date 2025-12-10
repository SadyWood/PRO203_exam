------------------------------ CHILD PERMISSION TABLE ------------------------------
CREATE TABLE child_permissions (
                                   id UUID PRIMARY KEY,
                                   child_id UUID NOT NULL UNIQUE REFERENCES children(id),
                                   allow_photography BOOLEAN NOT NULL DEFAULT false,
                                   allow_picture_sharing BOOLEAN NOT NULL DEFAULT false,
                                   allow_social_media_posts BOOLEAN NOT NULL DEFAULT false,
                                   allow_trips BOOLEAN NOT NULL DEFAULT true,
                                   allow_public_name_sharing BOOLEAN NOT NULL DEFAULT false,
                                   consent_given_by UUID,
                                   consent_given_at TIMESTAMP,
                                   updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_child_permissions_child ON child_permissions(child_id);

-- Create default permissions for existing children // REMOVE AFTER UNIFYING MIGRATIONS
INSERT INTO child_permissions (id, child_id, consent_given_at, updated_at)
SELECT gen_random_uuid(), id, NOW(), NOW()
FROM children;