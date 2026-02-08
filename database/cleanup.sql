DELETE FROM shortcuts AS s
WHERE
    s.created_at <= datetime ('now', '-1 year')
    AND NOT EXISTS (
        SELECT
            1
        FROM
            visits v
        WHERE
            v.shortcut_id = s.id
            AND v.date > datetime ('now', '-1 year')
    );

DELETE FROM shortcuts
WHERE
    expires_at IS NOT NULL
    AND expires_at <= CURRENT_TIMESTAMP;