SELECT request_id, created_at, status, name, email, company, country,
  topic, category, model, quantity, finish, source, message, items_json,
  inquiry_text, notes, email_status, email_id, email_updated_at
FROM inquiries
ORDER BY created_at DESC, request_id;
