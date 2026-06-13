-- password: Password123! (contributor) | AdminPass456! (maintainer)

TRUNCATE issues, users RESTART IDENTITY;

INSERT INTO users (name, email, password, role) VALUES
  ('Alice', 'alice@devpulse.io', '$2b$12$zFVKkn0IlmPk9vvf6yHj9urFrwiXa1NLTeEhAfSK2Ww2U6f2rfCm6', 'contributor'),
  ('Bob',   'bob@devpulse.io',   '$2b$12$xq6KCQza978XvuzT5K8bDOxhPXA5wWDzxj.BLoTb/L2TY08rFThJC', 'maintainer');

INSERT INTO issues (title, description, type, status, reporter_id) VALUES
  ('Login not working', 'Login button does not respond on mobile Safari browser.', 'bug', 'open', 1),
  ('Add dark mode',     'Users want a dark mode toggle in the settings page.', 'feature_request', 'in_progress', 1),
  ('Export to CSV',     'Maintainers need to export issue list to CSV file.', 'feature_request', 'resolved', 2);
