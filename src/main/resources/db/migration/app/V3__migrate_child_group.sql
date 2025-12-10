-- Add group_id column to children
ALTER TABLE children ADD COLUMN group_id UUID REFERENCES groups(id);

-- Create default groups from existing groupName values
INSERT INTO groups (id, name, kindergarten_id, created_at, updated_at)
SELECT DISTINCT
    gen_random_uuid(),
    c.group_name,
    c.kindergarten_id,
    NOW(),
    NOW()
FROM children c
WHERE c.group_name IS NOT NULL
  AND c.kindergarten_id IS NOT NULL
    ON CONFLICT (name, kindergarten_id) DO NOTHING;

-- Update children to reference new groups
UPDATE children c
SET group_id = g.id
    FROM groups g
WHERE c.group_name = g.name
  AND c.kindergarten_id = g.kindergarten_id;